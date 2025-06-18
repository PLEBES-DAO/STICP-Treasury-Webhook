import "dotenv/config"; // Load environment variables from .env
import { createSTCICPDEPOSITS } from "../sticp-plebes/ic/STICP/index.js";
import { createicrc1Actor } from "./ic/icrc1/index.js";
import { ICP_CANISTER,STICP_CANISTER } from "./functions/constants.js";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { toDefaultSub, defaultIcrcTransferHex, reverseFormatIcrcBalance } from "./functions/utils.js";

// Read identity from env
const json = JSON.parse(process.env.IDENTITY_JSON || "[]");

if (!Array.isArray(json) || json.length !== 2) {
  throw new Error("Invalid or missing IDENTITY_JSON in environment variables.");
}

const existingIdentity = Ed25519KeyIdentity.fromJSON(json);

console.log("existing", existingIdentity.getPrincipal().toText());


//Setting up Canister Actors to interact with ICP using the existingIdentity signature. in this case TREASURY camister

const stICPDepositsActor = createSTCICPDEPOSITS({
  agentOptions: { identity: existingIdentity },
});
const icpActor = createicrc1Actor(ICP_CANISTER, {
  agentOptions: { identity: existingIdentity },
});
const stICPActor = createicrc1Actor(STICP_CANISTER, {
  agentOptions: { identity: existingIdentity },
});


//gathering toHex subAccount address where we will deposit our ICP to mint stICP as staking

const toHex = await stICPDepositsActor.getDepositAddress([
  existingIdentity.getPrincipal().toText(),
]);


                const balance = await icpActor.icrc1_balance_of(
                toDefaultSub(existingIdentity.getPrincipal())
                );
                const balanceSTICP = await stICPActor.icrc1_balance_of(
                toDefaultSub(existingIdentity.getPrincipal())
                );
                console.log("balances ICP", balance, "stICP", balanceSTICP);




//Preparing the Transfer Amount and metadata.
const fee = await icpActor.icrc1_fee();
const amount = await icpActor.icrc1_balance_of(
  toDefaultSub(existingIdentity.getPrincipal())
);
const transferBalance = Number(amount - fee);




//Transfering ICP to the HEX provided by the STC deposit canister subacccount.

const transfer = await icpActor.transfer(
  defaultIcrcTransferHex(toHex, BigInt(transferBalance))
);
console.log("transfer", transfer);

//calling @depositICP() after transfering ICP to the HEX sub account provided. this will MINT STICP to the given conversion rate.

const deposit = await stICPDepositsActor.depositIcp();
console.log("deposit", deposit);

// TODO:
// Create a webhook or CRON job that:
// - Periodically runs this script
// - Sends ICP to deposit address
// - Calls depositIcp() to mint stICP
