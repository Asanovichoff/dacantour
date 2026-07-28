import { Controller, Get } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";

@Controller("health")
@SkipThrottle()
export class HealthController {
  @Get()
  check() {
    return { status: "ok", service: "dacantour-api", time: new Date().toISOString() };
  }
}
