import { z } from "zod";
import type { loginSchema, loginSearchSchema, registerSchema } from "./schema";

export type RegisterSchema = z.infer<typeof registerSchema>;

export type RegisterDto = Omit<RegisterSchema, "confirm">;

export type LoginDto = z.infer<typeof loginSchema>;

export type LoginSearchSchema = z.infer<typeof loginSearchSchema>;
