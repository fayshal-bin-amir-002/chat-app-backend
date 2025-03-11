import { z } from "zod";

export const authValidationSchema = z.object({
  body: z.object({
    email: z.string().trim().email({ message: "Invalid email format." }),
    password: z
      .string({ required_error: "Password is required." })
      .trim()
      .min(6, { message: "Password must be at least 6 characters long." }),
  }),
});
