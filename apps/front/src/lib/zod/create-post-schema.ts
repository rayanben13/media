// lib/schemas/post.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .default("false"),
});

export const updatePostSchema = z.object({
  id: z.string().transform((val) => Number(val)),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .default("false"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
