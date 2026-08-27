import { describe, expect, it } from "vitest";
import type { EnsReadConfig, EnsWriteConfig } from "@vbel/config";
import { createReadClient, createWriteClient } from "../src/client.js";

/**
 * Client construction is local (no RPC call happens until a method is
 * invoked), so these run without network access. Live behavior — resolving
 * real names, sending real transactions — is exercised only by the manual
 * scripts in scripts/, never by the automated suite.
 */
describe("createReadClient / createWriteClient", () => {
  it("wires the read client to sepolia by default", () => {
    const config: EnsReadConfig = { rpcUrl: "https://sepolia.example.com", network: "sepolia" };
    const client = createReadClient(config);
    expect(client.chain.id).toBe(11155111);
  });

  it("wires the read client to mainnet only when explicitly configured", () => {
    const config: EnsReadConfig = { rpcUrl: "https://mainnet.example.com", network: "mainnet" };
    const client = createReadClient(config);
    expect(client.chain.id).toBe(1);
  });

  it("derives the wallet address from the injected private key, not from the environment", () => {
    const config: EnsWriteConfig = {
      rpcUrl: "https://sepolia.example.com",
      network: "sepolia",
      parentName: "vbel-issuer.eth",
      ownerPrivateKey: `0x${"1".repeat(64)}`,
    };
    const wallet = createWriteClient(config);
    expect(wallet.account.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
});
