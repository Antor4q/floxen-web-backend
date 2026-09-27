import { z } from "zod";

export const createCategoryValidationSchema = z.object({
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
      .optional()
});

export const updateCategoryValidationSchema = z.object({
  name: z
    .enum([
      "BACKGROUND",
      "SECTION",
      "SHADER",
      "TEMPLATES",
      "GRADIENTS",
    ])
    .optional(),

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
    .optional(),
});
