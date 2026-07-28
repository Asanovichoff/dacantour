import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  const origins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  app.enableCors({ origin: origins, methods: ["GET", "POST"], credentials: false });
  app.setGlobalPrefix("api", { exclude: ["health"] });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  new Logger("Bootstrap").log(`Dacan Tour API listening on http://localhost:${port}`);
}

void bootstrap();
