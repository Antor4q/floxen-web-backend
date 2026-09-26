import { z } from "zod";

export const createDesignValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .trim(),

    slug: z
      .string()
      .optional()
      ,

    description: z
      .string()
      .trim()
      .optional(),

    type: z.enum(["SECTION", "COMPONENT", "PAGE"]),

    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

    tags: z
      .array(z.string().trim())
      .default([]),

    technologies: z
      .array(z.string().trim())
      .default([]),

    author: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"),

    previewVideo: z
      .string()
      .url("Invalid preview video URL"),

    sourceFile: z
      .string()
      .min(1, "Source file is required")
      .trim(),

    prompt: z
      .string()
      .min(1, "Prompt is required")
      .trim(),

    isFree: z
      .boolean()
      .default(false),

    status: z
      .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
      .default("DRAFT"),

    views: z
      .number()
      .int()
      .min(0)
      .default(0),

    likesCount: z
      .number()
      .int()
      .min(0)
      .default(0),
  }),
});