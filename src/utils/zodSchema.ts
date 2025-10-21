import z from "zod";

export const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

export const genreSchema = z
  .object({
    name: z.string().min(3),
  })
  .strict();

export const theaterSchema = z
  .object({
    name: z.string().min(3),
    city: z.string().min(3),
  })
  .strict();

export const movieSchema = z
  .object({
    title: z.string().min(3),
    genre: z.string().min(3),
    theaters: z.array(z.string().min(3)).min(1),
    description: z.string().min(3).optional(),
    price: z.number(),
    available: z.boolean(),
    bonus: z.string().optional(),
  })
  .strict();

export const authSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]),
});
