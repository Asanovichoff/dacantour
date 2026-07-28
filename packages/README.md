# packages/ — shared code (FE + BE)

Shared TypeScript types and **Zod schemas** used by both the frontend and backend so
the inquiry / custom-trip payloads validate identically on both sides (the contract).

Planned (Phase 2):

```
packages/
└── schemas/           # @dacantour/schemas
    ├── package.json
    └── src/
        ├── inquiry.ts        # zod InquirySchema + type
        ├── custom-trip.ts    # zod CustomTripRequestSchema + type
        └── index.ts
```

Consumed via the npm workspace (`"@dacantour/schemas": "*"`).
