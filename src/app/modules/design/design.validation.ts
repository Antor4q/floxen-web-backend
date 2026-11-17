import { z } from "zod";
import { DesignCategory, DesignStatus } from "./design.interface";

const tagArray = z
  .array(z.string().trim().min(1).max(30))
  .max(10)
  .transform((arr) => [...new Set(arr.map((t) => t.toLowerCase()))]);

const techArray = z
  .array(z.string().trim().min(1).max(30))
  .max(10)
  .transform((arr) => [...new Set(arr)]);

export const createDesignSchema = z
  .object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().min(10).max(500),
    category: z.nativeEnum(DesignCategory),
    prompt: z.string().trim().min(20).max(20000),
    tags: tagArray.default([]),
    technologies: techArray.default([]),
    isFree: z.boolean().default(false),
    status: z.nativeEnum(DesignStatus).default(DesignStatus.DRAFT),
  })
  .strict();

// Update e shudhu file pathale o cholbe, tai "at least one field" check service e
export const updateDesignSchema = createDesignSchema.partial().strict();