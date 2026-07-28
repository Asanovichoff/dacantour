import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { HealthModule } from "../src/health/health.module";

/**
 * A DB-free e2e that boots just the health endpoint. The inquiry/custom-trip
 * e2e (which needs Postgres) runs in CI against a service container — see
 * to-do.md Phase 4.
 */
describe("Health (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [HealthModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health → 200 ok", () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect((res) => {
        if (res.body.status !== "ok") throw new Error("health not ok");
      });
  });
});
