import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CustomTripsService } from "./custom-trips.service";
import { CustomTripRequest } from "./custom-trip.entity";
import { NotificationsService } from "../notifications/notifications.service";

describe("CustomTripsService", () => {
  let service: CustomTripsService;
  let save: jest.Mock;
  let notify: jest.Mock;

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue({ id: "ct-1" });
    notify = jest.fn().mockResolvedValue({ delivered: true });

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomTripsService,
        {
          provide: getRepositoryToken(CustomTripRequest),
          useValue: { create: (x: unknown) => x, save },
        },
        { provide: NotificationsService, useValue: { notifyTeam: notify } },
      ],
    }).compile();

    service = moduleRef.get(CustomTripsService);
  });

  it("stores the request and notifies the team", async () => {
    const res = await service.submit({
      name: "Lena",
      email: "lena@example.com",
      interests: "Song-Köl horses, Kel-Suu",
      message: "Two weeks in July for 4 people",
    } as never);

    expect(res).toEqual({ id: "ct-1", ok: true });
    expect(save).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify.mock.calls[0][0].subject).toContain("custom-trip");
  });

  it("silently ignores honeypot spam", async () => {
    const res = await service.submit({
      name: "Bot",
      email: "bot@spam.com",
      message: "spam",
      company: "bot inc",
    } as never);

    expect(res.id).toBe("ignored");
    expect(save).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});
