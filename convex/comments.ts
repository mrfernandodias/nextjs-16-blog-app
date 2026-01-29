import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .filter((q) => q.eq(q.field('postId'), args.postId))
      .order('desc')
      .collect();
    return comments;
  }
});

export const createComment = mutation({
  args: { postId: v.id('posts'), body: v.string() },
  handler: async (ctx, args) => {

    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const comment = await ctx.db.insert('comments', {
      postId: args.postId,
      authorId: user._id,
      authorName: user.name || 'Anonymous',
      body: args.body,
    });
    return comment;
  }
})
