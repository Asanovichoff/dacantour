import { PipeTransform, BadRequestException } from "@nestjs/common";
import type { ZodSchema } from "zod";

/**
 * Validates and parses the request body against a shared Zod schema (the FE/BE
 * contract in @dacantour/schemas). Returns a 400 with field errors on failure.
 */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      throw new BadRequestException({ message: "Validation failed", errors: fieldErrors });
    }
    return result.data;
  }
}
