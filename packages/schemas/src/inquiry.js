"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquirySchema = exports.InquiryType = void 0;
const zod_1 = require("zod");
exports.InquiryType = zod_1.z.enum(["general", "fixed-trip"]);
exports.InquirySchema = zod_1.z.object({
    type: exports.InquiryType.default("general"),
    tripSlug: zod_1.z.string().max(120).optional(),
    tripTitle: zod_1.z.string().max(200).optional(),
    departureLabel: zod_1.z.string().max(120).optional(),
    name: zod_1.z.string().trim().min(2, "Please enter your name").max(120),
    email: zod_1.z.string().trim().email("Enter a valid email").max(200),
    phone: zod_1.z.string().trim().max(60).optional().or(zod_1.z.literal("")),
    groupSize: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    preferredDates: zod_1.z.string().trim().max(200).optional().or(zod_1.z.literal("")),
    message: zod_1.z.string().trim().min(1, "Please add a message").max(4000),
    company: zod_1.z.string().optional(),
});
//# sourceMappingURL=inquiry.js.map