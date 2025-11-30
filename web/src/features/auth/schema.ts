import { z } from "zod";

const firstName = z.string().min(1);
const lastName = z.string().min(1);
const email = z.email();
const password = z.string().min(8);
const confirm = z.string().min(8);

export const registerSchema = z
  .object({
    firstName,
    lastName,
    email,
    password,
    confirm,
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  email,
  password,
});

export const loginSearchSchema = z.object({
  redirect: z.string().default("/").catch("/"),
});
