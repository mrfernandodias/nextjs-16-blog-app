'use server';

import { fetchMutation } from "convex/nextjs";
import { updateTag } from "next/cache";
import z from "zod";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";

import { postSchema } from "./schemas/blog";


export async function createBlogAction(data: z.infer<typeof postSchema>) {
  let storageId: Id<"_storage"> | undefined;
  try {
    const parsed = postSchema.parse(data);
    if (!parsed) {
      throw new Error("Invalid post data");
    }

    const token = await getToken();

    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    )

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.image.type },
      body: parsed.image,
    });

    if (!uploadResult.ok) {
      return {
        success: false,
        message: "Image upload failed",
      }
    }

    const uploadPayload = await uploadResult.json();
    if (!uploadPayload?.storageId) {
      throw new Error("Upload did not return a storageId");
    }
    storageId = uploadPayload.storageId as Id<"_storage">;
    await fetchMutation(api.posts.createPost, {
      body: parsed.content,
      title: parsed.title,
      imageStorageId: storageId,
    }, { token });

  } catch (error) {
    if (storageId) {
      try {
        await fetchMutation(api.posts.deleteImage, { storageId }, { token: await getToken() });
      } catch {
        // Best-effort cleanup; ignore storage cleanup errors.
      }
    }
    return {
      success: false,
      message: (error as Error).message,
    }
  }

  updateTag('blog-posts');
  return {
    success: true,
  };

}
