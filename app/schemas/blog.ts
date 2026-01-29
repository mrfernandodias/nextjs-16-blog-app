import z from "zod";

const MAX_BYTES = 5_000_000; // 5 MB

export const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  image: z.instanceof(File)
    .refine((file) => file.size > 0, { message: "Image file is required" })
    .refine((file) => file.size <= MAX_BYTES, { message: "Image file size must be less than 5 MB" }),
});
