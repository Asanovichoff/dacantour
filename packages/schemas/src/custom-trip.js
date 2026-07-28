"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTripRequestSchema = void 0;
const zod_1 = require("zod");
exports.CustomTripRequestSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Please enter your name").max(120),
    email: zod_1.z.string().trim().email("Enter a valid email").max(200),
    phone: zod_1.z.string().trim().max(60).optional().or(zod_1.z.literal("")),
    interests: zod_1.z.string().trim().max(500).optional().or(zod_1.z.literal("")),
    preferredDates: zod_1.z.string().trim().max(200).optional().or(zod_1.z.literal("")),
    groupSize: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    message: zod_1.z.string().trim().min(1, "Tell us a little about your trip").max(4000),
    company: zod_1.z.string().optional(),
});
//# sourceMappingURL=custom-trip.js.map