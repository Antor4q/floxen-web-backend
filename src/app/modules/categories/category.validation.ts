import { z } from "zod";

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.enum([
      "BACKGROUND",
      "SECTION",
      "SHADER",
      "TEMPLATES",
      "GRADIENTS",
    ]),

    slug: z
      .string()
      .min(1, "Slug is required")
      .trim()
      .toLowerCase()
      .optional(),

    description: z
      .string()
      .trim()
      .optional(),

    isActive: z
      .enum(["ACTIVE", "INACTIVE"])
      .default("ACTIVE")
      .optional(),
  }),
});