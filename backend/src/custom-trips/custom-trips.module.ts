import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomTripRequest } from "./custom-trip.entity";
import { CustomTripsService } from "./custom-trips.service";
import { CustomTripsController } from "./custom-trips.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [TypeOrmModule.forFeature([CustomTripRequest]), NotificationsModule],
  controllers: [CustomTripsController],
  providers: [CustomTripsService],
})
export class CustomTripsModule {}
