import { z } from "zod";

/**
 * CustomTripRequest — the "build your own Kyrgyzstan trip" interest panel.
 */
export const CustomTripRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(60).optional().or(z.literal("")),

  interests: z.string().trim().max(500).optional().or(z.literal("")),
  preferredDates: z.string().trim().max(200).optional().or(z.literal("")),
  groupSize: z.coerce.number().int().min(1).max(100).optional(),
  message: z.string().trim().min(1, "Tell us a little about your trip").max(4000),

  // Honeypot — see inquiry.ts
  company: z.string().optional(),
});

export type CustomTripRequest = z.infer<typeof CustomTripRequestSchema>;
