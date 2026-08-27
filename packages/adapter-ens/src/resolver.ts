import type { EnsPublicClient } from "@ensdomains/ensjs";
import type { IdentityResolver, IssuerAttestation } from "@vbel/core";
import { resolveIssuerRecords } from "./resolve.js";

/**
 * An IdentityResolver backed by ENS text records instead of a list we
 * assemble ourselves — see @vbel/adapter-identity-static for that version
 * and why it exists. Here the trust root moves to whoever controls the
 * name's resolver on-chain, which is checkable independently of us.
 *
 * `issuerId` follows the `urn:vbel:org:<label>` convention used throughout
 * this demo; the label becomes the ENS subname `<label>.<parentName>`.
 *
 * Known gap, stated rather than solved: `at` is not honoured for real
 * historical scoping. ENS gives current chain state, not "the record as of
 * a past timestamp" — that would need resolving at a specific block number,
 * which ENS's text-record reads don't expose cleanly. Same category of
 * documented limitation as the static registry's own trust-root note.
 */
export class EnsIdentityResolver implements IdentityResolver {
  constructor(
    private readonly client: EnsPublicClient,
    private readonly parentName: string,
    private readonly attestedBy: string
  ) {}

  private nameFor(issuerId: string): string {
    const label = issuerId.replace("urn:vbel:org:", "");
    return `${label}.${this.parentName}`;
  }

  async resolve(issuerId: string, _at: string): Promise<IssuerAttestation | null> {
    const name = this.nameFor(issuerId);
    const record = await resolveIssuerRecords(this.client, name);
    if (!record.pubkey) return null;

    return {
      issuerId,
      publicKey: record.pubkey,
      attestedBy: this.attestedBy,
      validFrom: "1970-01-01T00:00:00.000Z",
      validUntil: null,
      signature: null,
    };
  }
}
