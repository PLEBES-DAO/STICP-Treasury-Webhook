import "dotenv/config"; // Load environment variables from .env
import { createSTCICPDEPOSITS } from "../sticp-plebes/ic/STICP/index.js";
import { createicrc1Actor } from "./ic/icrc1/index.js";
import { ICP_CANISTER } from "./functions/constants.js";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { toDefaultSub, defaultIcrcTransferHex, reverseFormatIcrcBalance } from "./functions/utils.js";

// Read identity from env
const json = JSON.parse(process.env.IDENTITY_JSON || "[]");

if (!Array.isArray(json) || json.length !== 2) {
  throw new Error("Invalid or missing IDENTITY_JSON in environment variables.");
}

const existingIdentity = Ed25519KeyIdentity.fromJSON(json);

console.log("existing", existingIdentity.getPrincipal().toText());

const stICPDepositsActor = createSTCICPDEPOSITS({
  agentOptions: { identity: existingIdentity },
});
const icpActor = createicrc1Actor(ICP_CANISTER, {
  agentOptions: { identity: existingIdentity },
});
const stICPActor = createicrc1Actor("qfr6e-biaaa-aaaak-qafuq-cai", {
  agentOptions: { identity: existingIdentity },
});

const toHex = await stICPDepositsActor.getDepositAddress([
  existingIdentity.getPrincipal().toText(),
]);
console.log("toHex", toHex);

const balance = await icpActor.icrc1_balance_of(
  toDefaultSub(existingIdentity.getPrincipal())
);
const balanceSTICP = await stICPActor.icrc1_balance_of(
  toDefaultSub(existingIdentity.getPrincipal())
);
console.log("balances ICP", balance, "stICP", balanceSTICP);

const fee = await icpActor.icrc1_fee();
const amount = await icpActor.icrc1_balance_of(
  toDefaultSub(existingIdentity.getPrincipal())
);
const transferBalance = Number(amount - fee);
console.log("amount to transfer", amount);

const transfer = await icpActor.transfer(
  defaultIcrcTransferHex(toHex, BigInt(transferBalance))
);
console.log("transfer", transfer);

const deposit = await stICPDepositsActor.depositIcp();
console.log("deposit", deposit);

// TODO:
// Create a webhook or CRON job that:
// - Periodically runs this script
// - Sends ICP to deposit address
// - Calls depositIcp() to mint stICP
