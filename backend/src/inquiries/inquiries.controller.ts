import { Body, Controller, Post, HttpCode } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { InquirySchema, type Inquiry as InquiryDto } from "@dacantour/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { InquiriesService } from "./inquiries.service";

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  // Tighter limit on writes: 5 submissions / minute / IP.
  @Post()
  @HttpCode(201)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  submit(@Body(new ZodValidationPipe(InquirySchema)) dto: InquiryDto) {
    return this.inquiries.submit(dto);
  }
}
