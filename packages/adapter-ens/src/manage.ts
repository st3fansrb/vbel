import type { Account } from "viem";
import { createSubname, setRecords } from "@ensdomains/ensjs/wallet";
import { getResolver } from "@ensdomains/ensjs/public";
import type { EnsWriteConfig } from "@vbel/config";
import { createReadClient, createWriteClient } from "./client.js";

export interface SubjectSubnameResult {
  name: string;
  txHash: string;
}

export interface SetRecordsResult {
  txHash: string;
}

export type OelRecordUpdate = Partial<Record<"payload" | "anchor" | "status" | "pubkey", string>>;

/**
 * Write access to VBEL's ENS presence: one subname per subject under a
 * parent name we own, carrying oel.* text records. Constructing this class
 * requires EnsWriteConfig — obtaining that config is the point where spend
 * authority exists; do not construct it earlier than necessary.
 */
export class EnsIssuerRegistry {
  private readonly wallet: ReturnType<typeof createWriteClient>;
  private readonly reader: ReturnType<typeof createReadClient>;
  private readonly account: Account;
  private readonly parentName: string;

  constructor(config: EnsWriteConfig) {
    this.wallet = createWriteClient(config);
    this.reader = createReadClient(config);
    // createWriteClient always sets an account; the generic return type just doesn't narrow that far.
    this.account = this.wallet.account as Account;
    this.parentName = config.parentName;
  }

  private subnameFor(label: string): string {
    return `${label}.${this.parentName}`;
  }

  /** Creates label.<parentName>, reusing the parent's resolver so the subname resolves immediately. */
  async createSubjectSubname(label: string): Promise<SubjectSubnameResult> {
    const resolverAddress = await getResolver(this.reader, { name: this.parentName });
    if (!resolverAddress) {
      throw new Error(`parent name ${this.parentName} has no resolver set — configure it before creating subnames`);
    }

    const name = this.subnameFor(label);
    const txHash = await createSubname(this.wallet, {
      name,
      owner: this.account.address,
      contract: "registry",
      resolverAddress,
      account: this.account,
    });

    return { name, txHash };
  }

  /** Sets one or more oel.* text records on an existing name. */
  async setOelRecords(name: string, records: OelRecordUpdate): Promise<SetRecordsResult> {
    const resolverAddress = await getResolver(this.reader, { name });
    if (!resolverAddress) {
      throw new Error(`${name} has no resolver set — create it with a resolver first`);
    }

    const texts = Object.entries(records)
      .filter((entry): entry is [string, string] => entry[1] !== undefined)
      .map(([key, value]) => ({ key: `oel.${key}`, value }));

    if (texts.length === 0) {
      throw new Error("setOelRecords called with no records to set");
    }

    const txHash = await setRecords(this.wallet, { name, resolverAddress, texts, account: this.account });
    return { txHash };
  }
}
