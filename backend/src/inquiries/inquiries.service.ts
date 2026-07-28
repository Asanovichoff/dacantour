import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Inquiry as InquiryDto } from "@dacantour/schemas";
import { Inquiry } from "./inquiry.entity";
import { NotificationsService } from "../notifications/notifications.service";

export interface SubmitResult {
  id: string;
  ok: true;
}

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>,
    private readonly notifications: NotificationsService,
  ) {}

  async submit(dto: InquiryDto): Promise<SubmitResult> {
    // Honeypot: pretend success without storing/notifying.
    if (dto.company && dto.company.trim().length > 0) {
      this.logger.warn(`Honeypot triggered on inquiry from ${dto.email} — ignoring.`);
      return { id: "ignored", ok: true };
    }

    const entity = this.repo.create({
      type: dto.type ?? "general",
      tripSlug: dto.tripSlug ?? null,
      tripTitle: dto.tripTitle ?? null,
      departureLabel: dto.departureLabel ?? null,
      name: dto.name,
      email: dto.email,
      phone: dto.phone || null,
      groupSize: dto.groupSize ?? null,
      preferredDates: dto.preferredDates || null,
      message: dto.message,
      status: "new",
    });
    const saved = await this.repo.save(entity);

    await this.notifications.notifyTeam({
      subject: dto.tripTitle
        ? `New inquiry: ${dto.tripTitle}`
        : "New general inquiry — Dacan Tour",
      text: [
        `Name: ${dto.name}`,
        `Email: ${dto.email}`,
        dto.phone ? `Phone: ${dto.phone}` : null,
        dto.tripTitle ? `Trip: ${dto.tripTitle}` : null,
        dto.departureLabel ? `Departure: ${dto.departureLabel}` : null,
        dto.groupSize ? `Group size: ${dto.groupSize}` : null,
        dto.preferredDates ? `Dates: ${dto.preferredDates}` : null,
        "",
        dto.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return { id: saved.id, ok: true };
  }
}
