import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email("enter a valid email"),
  password: z.string().min(6, "password must be atleaste 6 caractere"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email("enter a valid email"),
  password: z.string().min(6, "password must be atleaste 6 caractere"),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
