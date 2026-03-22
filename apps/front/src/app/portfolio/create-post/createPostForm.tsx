// components/post/post-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost, updatePost } from "@/lib/actions/postsAction";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
};

type Props = {
  post?: Post;
};

export default function PostForm({ post }: Props) {
  const isEdit = !!post;
  const action = isEdit ? updatePost : createPost;
  const [state, formAction] = useActionState(action, null);
  const router = useRouter();
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState({
    title: post?.title || "",
    content: post?.content || "",
    thumbnail: post?.thumbnail || "",
    published: post?.published || false,
  });

  useEffect(() => {
    if (state?.data) {
      const { slug, id } = state.data;
      if (slug && id) {
        router.push(`/${slug}/${id}`);
      } else {
        router.push("/dashboard/my-posts");
      }
      router.refresh();
    }
  }, [state?.data, router]);

  // ✅ Sync thumbnail ref when value changes
  useEffect(() => {
    if (thumbnailRef.current) {
      thumbnailRef.current.value = values.thumbnail;
    }
  }, [values.thumbnail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getFieldError = (field: string) => {
    return state?.fieldErrors?.[field]?.[0];
  };

  // ✅ Handle thumbnail change from ImageUpload
  const handleThumbnailChange = (url: string) => {
    setValues((prev) => ({ ...prev, thumbnail: url }));
    // ✅ Also update the hidden input directly
    if (thumbnailRef.current) {
      thumbnailRef.current.value = url;
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Global Error */}
      {state?.error && !state?.fieldErrors && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {isEdit && <input type="hidden" name="id" value={post.id} />}

        {/* ✅ Hidden input with ref */}
        <input
          ref={thumbnailRef}
          type="hidden"
          name="thumbnail"
          defaultValue={values.thumbnail}
        />

        {/* ✅ Hidden input for published */}
        <input
          type="hidden"
          name="published"
          value={values.published ? "true" : "false"}
        />

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Enter post title..."
            className={getFieldError("title") ? "border-red-400" : ""}
          />
          {getFieldError("title") && (
            <p className="text-xs text-red-500">{getFieldError("title")}</p>
          )}
        </div>

        {/* ✅ Image Upload */}
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <ImageUpload
            value={values.thumbnail}
            onChange={handleThumbnailChange}
          />
          {getFieldError("thumbnail") && (
            <p className="text-xs text-red-500">{getFieldError("thumbnail")}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            name="content"
            value={values.content}
            onChange={handleChange}
            rows={12}
            placeholder="Write your post content..."
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y ${
              getFieldError("content") ? "border-red-400" : "border-gray-300"
            }`}
          />
          {getFieldError("content") && (
            <p className="text-xs text-red-500">{getFieldError("content")}</p>
          )}
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
          <button
            type="button"
            onClick={() =>
              setValues((prev) => ({ ...prev, published: !prev.published }))
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${
              values.published ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                values.published ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-medium">
              {values.published ? "Published" : "Draft"}
            </p>
            <p className="text-xs text-gray-500">
              {values.published
                ? "Visible to everyone"
                : "Only you can see this"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
