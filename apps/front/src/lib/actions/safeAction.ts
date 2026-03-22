// lib/safe-action.ts
import { ZodError, ZodSchema } from "zod";

export type ActionResult<T> =
  | { data: T; error?: undefined; fieldErrors?: undefined }
  | { data?: undefined; error: string; fieldErrors?: Record<string, string[]> };

export function createSafeAction<TInput, TResult>(
  schema: ZodSchema<TInput>,
  handler: (input: TInput) => Promise<TResult>,
) {
  return async (
    _: unknown,
    formData: FormData,
  ): Promise<ActionResult<TResult>> => {
    try {
      const values = Object.fromEntries(formData.entries());

      const input = schema.parse(values);

      const result = await handler(input);

      return { data: result };
    } catch (error) {
      // ✅ Zod validation errors
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        error.issues.forEach((issue) => {
          const field = issue.path.join(".");
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        });

        return {
          error: "Validation failed",
          fieldErrors,
        };
      }

      // ✅ Backend/GraphQL errors
      if (error instanceof Error) {
        return { error: error.message };
      }

      return { error: "Something went wrong" };
    }
  };
}
