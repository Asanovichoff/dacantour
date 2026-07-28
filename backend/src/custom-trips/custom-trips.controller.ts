import { Body, Controller, Post, HttpCode } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { CustomTripRequestSchema, type CustomTripRequest as CustomTripDto } from "@dacantour/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { CustomTripsService } from "./custom-trips.service";

@Controller("custom-trips")
export class CustomTripsController {
  constructor(private readonly customTrips: CustomTripsService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  submit(@Body(new ZodValidationPipe(CustomTripRequestSchema)) dto: CustomTripDto) {
    return this.customTrips.submit(dto);
  }
}
