import { z } from "zod";
export declare const CustomTripRequestSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    interests: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    preferredDates: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    groupSize: z.ZodOptional<z.ZodNumber>;
    message: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    message: string;
    phone?: string | undefined;
    groupSize?: number | undefined;
    preferredDates?: string | undefined;
    company?: string | undefined;
    interests?: string | undefined;
}, {
    name: string;
    email: string;
    message: string;
    phone?: string | undefined;
    groupSize?: number | undefined;
    preferredDates?: string | undefined;
    company?: string | undefined;
    interests?: string | undefined;
}>;
export type CustomTripRequest = z.infer<typeof CustomTripRequestSchema>;
