import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { NotificationsService } from "../src/notifications/notifications.service";

/**
 * Full-stack API tests: HTTP → Zod validation → TypeORM → Postgres.
 * Needs a database (CI provides one as a service container; locally run
 * `cd infra && docker compose up postgres`). Email is mocked.
 */
describe("Submissions (e2e)", () => {
  let app: INestApplication;
  const notifyTeam = jest.fn().mockResolvedValue({ delivered: true });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(NotificationsService)
      .useValue({ notifyTeam })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api", { exclude: ["health"] });
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => notifyTeam.mockClear());

  const validInquiry = {
    name: "E2E Traveler",
    email: "e2e@example.com",
    message: "Is the June departure still open?",
    type: "fixed-trip",
    tripTitle: "Song-Köl Silk Road Horse Trek",
    groupSize: 2,
  };

  describe("POST /api/inquiries", () => {
    it("stores a valid inquiry and notifies the team", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/inquiries")
        .send(validInquiry)
        .expect(201);

      expect(res.body.ok).toBe(true);
      expect(res.body.id).toMatch(/[0-9a-f-]{36}/);
      expect(notifyTeam).toHaveBeenCalledTimes(1);
      expect(notifyTeam.mock.calls[0][0].subject).toContain("Song-Köl");
    });

    it("rejects an invalid payload with field errors", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/inquiries")
        .send({ name: "A", email: "not-an-email", message: "" })
        .expect(400);

      expect(res.body.errors).toHaveProperty("email");
      expect(res.body.errors).toHaveProperty("message");
      expect(notifyTeam).not.toHaveBeenCalled();
    });

    it("silently drops honeypot spam", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/inquiries")
        .send({ ...validInquiry, company: "spam corp" })
        .expect(201);

      // Looks like success to the bot, but nothing is stored or emailed.
      expect(res.body.id).toBe("ignored");
      expect(notifyTeam).not.toHaveBeenCalled();
    });

    it("coerces a numeric string group size", async () => {
      await request(app.getHttpServer())
        .post("/api/inquiries")
        .send({ ...validInquiry, groupSize: "4" })
        .expect(201);
    });
  });

  describe("POST /api/custom-trips", () => {
    it("stores a custom-trip request", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/custom-trips")
        .send({
          name: "Custom Traveler",
          email: "custom@example.com",
          interests: "Kel-Suu, horses",
          message: "Two weeks in July for four people",
        })
        .expect(201);

      expect(res.body.ok).toBe(true);
      expect(notifyTeam).toHaveBeenCalledTimes(1);
    });

    it("requires a message", async () => {
      await request(app.getHttpServer())
        .post("/api/custom-trips")
        .send({ name: "Custom Traveler", email: "custom@example.com" })
        .expect(400);
    });
  });

  it("GET /health reports ok", async () => {
    const res = await request(app.getHttpServer()).get("/health").expect(200);
    expect(res.body.status).toBe("ok");
  });
});
