import type { z } from "zod";

/**
 * Shared by every per-adapter schema in this package. Fails fast with every
 * missing/invalid var named at once, instead of one cryptic runtime error
 * the first time a field is used deep inside an adapter.
 */
export function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  source: NodeJS.ProcessEnv,
  label: string
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const lines = result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid ${label} configuration:\n${lines.join("\n")}`);
  }
  return result.data;
}
