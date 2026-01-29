import z from "zod";

import { Id } from "@/convex/_generated/dataModel";

export const commentSchema = z.object({
  postId: z.custom<Id<'posts'>>(),
  body: z.string().min(3),
});

export type CommentSchema = z.infer<typeof commentSchema>;
