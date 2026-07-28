import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { InquiriesService } from "./inquiries.service";
import { Inquiry } from "./inquiry.entity";
import { NotificationsService } from "../notifications/notifications.service";

describe("InquiriesService", () => {
  let service: InquiriesService;
  let save: jest.Mock;
  let notify: jest.Mock;

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue({ id: "uuid-1" });
    notify = jest.fn().mockResolvedValue({ delivered: true });

    const moduleRef = await Test.createTestingModule({
      providers: [
        InquiriesService,
        {
          provide: getRepositoryToken(Inquiry),
          useValue: { create: (x: unknown) => x, save },
        },
        { provide: NotificationsService, useValue: { notifyTeam: notify } },
      ],
    }).compile();

    service = moduleRef.get(InquiriesService);
  });

  it("stores the inquiry and notifies the team", async () => {
    const res = await service.submit({
      type: "fixed-trip",
      name: "Sofia",
      email: "sofia@example.com",
      tripTitle: "Song-Köl Horse Trek",
      message: "Is June still open?",
    } as never);

    expect(res).toEqual({ id: "uuid-1", ok: true });
    expect(save).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0][0].subject).toContain("Song-Köl");
  });

  it("silently ignores honeypot spam (no save, no email)", async () => {
    const res = await service.submit({
      name: "Bot",
      email: "bot@spam.com",
      message: "buy stuff",
      company: "definitely a bot",
    } as never);

    expect(res.ok).toBe(true);
    expect(res.id).toBe("ignored");
    expect(save).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});
