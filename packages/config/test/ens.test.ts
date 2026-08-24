import { describe, expect, it } from "vitest";
import { loadEnsReadConfig, loadEnsWriteConfig } from "../src/ens.js";

const VALID_KEY = ("0x" + "1".repeat(64)) as `0x${string}`;

describe("loadEnsReadConfig", () => {
  it("does not require a private key", () => {
    const config = loadEnsReadConfig({
      ENS_RPC_URL: "https://sepolia.example.com",
    } as NodeJS.ProcessEnv);

    expect(config).toEqual({ rpcUrl: "https://sepolia.example.com", network: "sepolia" });
  });

  it("defaults to sepolia, never mainnet, unless explicitly set", () => {
    const config = loadEnsReadConfig({ ENS_RPC_URL: "https://x.example.com" } as NodeJS.ProcessEnv);
    expect(config.network).toBe("sepolia");
  });
});

describe("loadEnsWriteConfig", () => {
  it("requires ENS_PARENT_NAME and ENS_OWNER_PRIVATE_KEY, named explicitly when missing", () => {
    expect(() => loadEnsWriteConfig({ ENS_RPC_URL: "https://x.example.com" } as NodeJS.ProcessEnv)).toThrowError(
      /ENS_PARENT_NAME[\s\S]*ENS_OWNER_PRIVATE_KEY/
    );
  });

  it("rejects a malformed private key", () => {
    expect(() =>
      loadEnsWriteConfig({
        ENS_RPC_URL: "https://x.example.com",
        ENS_PARENT_NAME: "vbel-issuer.eth",
        ENS_OWNER_PRIVATE_KEY: "not-a-key",
      } as NodeJS.ProcessEnv)
    ).toThrow();
  });

  it("parses a complete, valid write config", () => {
    const config = loadEnsWriteConfig({
      ENS_RPC_URL: "https://x.example.com",
      ENS_NETWORK: "sepolia",
      ENS_PARENT_NAME: "vbel-issuer.eth",
      ENS_OWNER_PRIVATE_KEY: VALID_KEY,
    } as NodeJS.ProcessEnv);

    expect(config.parentName).toBe("vbel-issuer.eth");
    expect(config.ownerPrivateKey).toBe(VALID_KEY);
  });
});
