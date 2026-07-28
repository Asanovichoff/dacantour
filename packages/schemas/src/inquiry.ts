import { z } from "zod";

/**
 * Inquiry — a general question or interest in a specific fixed-departure trip.
 * Shared by the frontend form and the NestJS API so both validate identically.
 */
export const InquiryType = z.enum(["general", "fixed-trip"]);

export const InquirySchema = z.object({
  type: InquiryType.default("general"),

  // Trip context (optional — present when inquiring about a specific trip/date)
  tripSlug: z.string().max(120).optional(),
  tripTitle: z.string().max(200).optional(),
  departureLabel: z.string().max(120).optional(),

  // Contact
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(60).optional().or(z.literal("")),

  // Details
  groupSize: z.coerce.number().int().min(1).max(100).optional(),
  preferredDates: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please add a message").max(4000),

  // Spam protection honeypot: real users never fill this. The server treats a
  // filled value as spam (silently), so we keep it lenient in the schema.
  company: z.string().optional(),
});

export type Inquiry = z.infer<typeof InquirySchema>;
