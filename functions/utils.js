export function toDefaultSub(owner, subaccount = []) {
  return { owner: owner, subaccount: subaccount };
}

export function defaultDepositIcpSwap(token, amount, fee = 3000) {
  return { token: token, amount: amount, fee: fee };
}

export function ApproveICP(spender, fee, amount) {
  return {
    fee: [],
    memo: [],
    from_subaccount: [],
    created_at_time: [],
    amount: amount,
    expected_allowance: [],
    expires_at: [],
    spender: { owner: spender, subaccount: [] },
  };
}

export function defaultIcrcTransferArgs(
  to,
  transferBalance,
  fee = [],
  subaccount = [],
  from_subaccount = []
) {
  return {
    fee: fee,
    amount: transferBalance,
    memo: [],
    from_subaccount: from_subaccount,
    to: toDefaultSub(to, subaccount),
    created_at_time: [],
  };
}

export function formatIcrcBalance(balance, supply) {
  let supplyAMillionth = Number(supply) / 100000000;
  return (Number(balance) * supplyAMillionth) / Number(supply);
}

export function reverseFormatIcrcBalance(scaledBalance, supply) {
  let supplyAMillionth = Number(supply) / 100000000;
  let floatNumber = (Number(scaledBalance) * Number(supply)) / supplyAMillionth;
  let truncatedInt = Math.trunc(floatNumber);
  return truncatedInt;
}

export function numberToVecNat8(number) {
  const byteArray = [];

  // Convert the number to bytes (big-endian order)
  while (number > 0) {
    byteArray.push(number & 0xff); // Extract the least significant byte
    number = number >> 8; // Shift the number by 8 bits
  }

  // Reverse the array for big-endian representation
  return new Uint8Array(byteArray.reverse());
}

export function defaultIcrcTransferBobSpawnerArgs(
  transferBalance,
  fee = [],
  subaccount = [],
  from_subaccount = []
) {
  return {
    fee: { e8s: BigInt(10000) },
    amount: { e8s: transferBalance },
    memo: BigInt(1347768404),
    from_subaccount: from_subaccount,
    to: Array.from(
      Uint8Array.from(
        Buffer.from(
          "c988141ab9e48a318eae1feb54dea3c60e4030d1082a6c8d215efd7cda45bd03",
          "hex"
        )
      )
    ),
    created_at_time: [],
  };
}



export function defaultIcrcTransferHex(
  hex,
  transferBalance,
  fee = [],
  subaccount = [],
  from_subaccount = []
) {
  return {
    fee: { e8s: BigInt(10000) },
    amount: { e8s: transferBalance },
    memo: BigInt(1347768404),
    from_subaccount: from_subaccount,
    to: Array.from(
      Uint8Array.from(
        Buffer.from(
          hex,
          "hex"
        )
      )
    ),
    created_at_time: [],
  };
}
