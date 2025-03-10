import { z } from "zod";

export const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required." })
      .trim()
      .min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().trim().email({ message: "Invalid email format." }),
    password: z
      .string({ required_error: "Password is required." })
      .trim()
      .min(6, { message: "Password must be at least 6 characters long." }),
    profile_image: z
      .string({ required_error: "Profile image is required." })
      .trim()
      .url({ message: "Profile image must be a valid URL." }),
  }),
});
