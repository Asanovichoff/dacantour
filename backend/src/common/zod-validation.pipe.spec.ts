import { BadRequestException } from "@nestjs/common";
import { InquirySchema } from "@dacantour/schemas";
import { ZodValidationPipe } from "./zod-validation.pipe";

describe("ZodValidationPipe", () => {
  const pipe = new ZodValidationPipe(InquirySchema);

  it("passes and normalizes a valid payload", () => {
    const out = pipe.transform({
      name: "Sofia",
      email: "sofia@example.com",
      message: "Hello",
    });
    expect(out.name).toBe("Sofia");
    expect(out.type).toBe("general"); // default applied
  });

  it("rejects an invalid payload with field errors", () => {
    try {
      pipe.transform({ name: "A", email: "not-an-email", message: "" });
      fail("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const res = (e as BadRequestException).getResponse() as { errors: Record<string, string> };
      expect(res.errors.email).toBeDefined();
      expect(res.errors.name).toBeDefined();
      expect(res.errors.message).toBeDefined();
    }
  });

  it("coerces groupSize from a string", () => {
    const out = pipe.transform({
      name: "Sofia",
      email: "sofia@example.com",
      message: "Hi",
      groupSize: "4",
    });
    expect(out.groupSize).toBe(4);
  });
});
