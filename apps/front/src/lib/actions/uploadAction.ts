// lib/actions/uploadAction.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // ✅ Validate file
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPEG, PNG, WebP, and GIF are allowed" };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { error: "File size must be less than 5MB" };
  }

  // ✅ Generate unique filename
  const ext = file.name.split(".").pop();
  const uniqueName = `${randomBytes(16).toString("hex")}.${ext}`;
  const filePath = `posts/${uniqueName}`;

  // ✅ Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ✅ Upload to Supabase
  const { error } = await supabase.storage
    .from("postImage")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }

  // ✅ Get public URL
  const { data: urlData } = supabase.storage
    .from("postImage")
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
  };
}

// ✅ Delete image from Supabase
export async function deleteImage(url: string) {
  try {
    // Extract file path from URL
    const path = url.split("/storage/v1/object/public/postImage/")[1];
    if (!path) return;

    await supabase.storage.from("postImage").remove([`postImage/${path}`]);
  } catch (error) {
    console.error("Delete image error:", error);
  }
}
