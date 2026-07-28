import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CustomTripRequest as CustomTripDto } from "@dacantour/schemas";
import { CustomTripRequest } from "./custom-trip.entity";
import { NotificationsService } from "../notifications/notifications.service";

export interface SubmitResult {
  id: string;
  ok: true;
}

@Injectable()
export class CustomTripsService {
  private readonly logger = new Logger(CustomTripsService.name);

  constructor(
    @InjectRepository(CustomTripRequest) private readonly repo: Repository<CustomTripRequest>,
    private readonly notifications: NotificationsService,
  ) {}

  async submit(dto: CustomTripDto): Promise<SubmitResult> {
    if (dto.company && dto.company.trim().length > 0) {
      this.logger.warn(`Honeypot triggered on custom-trip request from ${dto.email} — ignoring.`);
      return { id: "ignored", ok: true };
    }

    const entity = this.repo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone || null,
      interests: dto.interests || null,
      preferredDates: dto.preferredDates || null,
      groupSize: dto.groupSize ?? null,
      message: dto.message,
      status: "new",
    });
    const saved = await this.repo.save(entity);

    await this.notifications.notifyTeam({
      subject: "New custom-trip request — Dacan Tour",
      text: [
        `Name: ${dto.name}`,
        `Email: ${dto.email}`,
        dto.phone ? `Phone: ${dto.phone}` : null,
        dto.interests ? `Interests: ${dto.interests}` : null,
        dto.preferredDates ? `Dates: ${dto.preferredDates}` : null,
        dto.groupSize ? `Group size: ${dto.groupSize}` : null,
        "",
        dto.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return { id: saved.id, ok: true };
  }
}
