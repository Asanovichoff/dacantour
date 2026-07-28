import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { buildDatabaseUrl, redactUrl } from "./config/database";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { CustomTripsModule } from "./custom-trips/custom-trips.module";
import { Inquiry } from "./inquiries/inquiry.entity";
import { CustomTripRequest } from "./custom-trips/custom-trip.entity";

@Module({
  imports: [
    // Reads backend/.env first, then falls back to infra/.env so the API shares the
    // same Postgres credentials Docker was started with.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "../infra/.env"] }),

    // Global rate limit: 10 requests / minute / IP (POST routes tighten this further).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),

    // forRootAsync so the factory runs *after* ConfigModule has loaded the env files.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const url = buildDatabaseUrl();
        new Logger("Database").log(`Connecting to ${redactUrl(url)}`);
        return {
          type: "postgres" as const,
          url,
          entities: [Inquiry, CustomTripRequest],
          synchronize: process.env.NODE_ENV !== "production", // v1: auto-create tables in dev
          retryAttempts: 5,
          retryDelay: 3000,
        };
      },
    }),

    HealthModule,
    NotificationsModule,
    InquiriesModule,
    CustomTripsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
