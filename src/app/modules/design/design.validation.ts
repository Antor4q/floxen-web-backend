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

// Default chhara base fields (update er jonno safe)
const baseShape = {
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(500),
  category: z.nativeEnum(DesignCategory),
  prompt: z.string().trim().min(20).max(20000),
  tags: tagArray,
  technologies: techArray,
  isFree: z.boolean(),
  status: z.nativeEnum(DesignStatus),
};

// CREATE: default shoho
export const createDesignSchema = z
  .object({
    ...baseShape,
    tags: tagArray.default([]),
    technologies: techArray.default([]),
    isFree: z.boolean().default(false),
    status: z.nativeEnum(DesignStatus).default(DesignStatus.DRAFT),
  })
  .strict();

// UPDATE: shob optional, default nai. File o ashte pare, tai "at least one" check service e
export const updateDesignSchema = z.object(baseShape).partial().strict();