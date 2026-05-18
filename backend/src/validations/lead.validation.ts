import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2),

  email: z.string().email(),

  status: z
    .enum([
      "New",
      "Contacted",
      "Qualified",
      "Lost",
    ])
    .optional(),

  source: z.enum([
    "Website",
    "Instagram",
    "Referral",
  ]),
});

export const updateLeadSchema =
  createLeadSchema.partial();