import { describe, expect, it } from "vitest";
import type { EnsWriteConfig } from "@vbel/config";
import { EnsIssuerRegistry } from "../src/manage.js";

const config: EnsWriteConfig = {
  rpcUrl: "https://sepolia.example.com",
  network: "sepolia",
  parentName: "vbel-issuer.eth",
  ownerPrivateKey: `0x${"1".repeat(64)}`,
};

describe("EnsIssuerRegistry", () => {
  it("constructs from injected config without touching the network", () => {
    expect(() => new EnsIssuerRegistry(config)).not.toThrow();
  });
});
