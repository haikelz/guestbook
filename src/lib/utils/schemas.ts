import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, {
      message: "Your message must contain at least 1 character and more!",
    })
    .max(500, { message: "Keep your message under 500 characters." }),
});
