import z from "zod";

export const genreSchema = z
  .object({
    name: z.string().min(3),
  })
  .strict();
