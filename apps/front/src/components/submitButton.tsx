"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type Props = {
  text?: string;
  loadingText?: string;
  className?: string;
};

export default function SubmitButton({
  text = "Submit",
  loadingText = "Loading...",
  className = "",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 ${className}`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {loadingText}
        </span>
      ) : (
        text
      )}{" "}
    </Button>
  );
}
