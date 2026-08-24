import { config as loadDotenv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Next only reads .env from its own project directory, but this is a
 * monorepo with one .env at the root shared by the CLI, the smoke scripts
 * and this app. Load it here so there is exactly one file holding secrets
 * and no per-clone symlink to forget.
 *
 * On a hosting platform the environment is injected directly and this is a
 * no-op — dotenv never overrides variables that are already set.
 */
loadDotenv({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Workspace packages ship TypeScript-built ESM; Next must transpile them
  // rather than treat them as prebuilt node_modules.
  transpilePackages: ["@vbel/core", "@vbel/config", "@vbel/domain-delivery", "@vbel/adapter-solana"],
};

export default nextConfig;
