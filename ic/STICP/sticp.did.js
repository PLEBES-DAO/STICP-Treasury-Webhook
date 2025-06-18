export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const DissolveState = IDL.Variant({
    'DissolveDelaySeconds' : IDL.Nat64,
    'WhenDissolvedTimestampSeconds' : IDL.Nat64,
  });
  const Neuron = IDL.Record({
    'id' : IDL.Nat64,
    'accountId' : AccountIdentifier,
    'stakedMaturityE8sEquivalent' : IDL.Opt(IDL.Nat64),
    'dissolveState' : IDL.Opt(DissolveState),
    'cachedNeuronStakeE8s' : IDL.Nat64,
  });
  const GovernanceError = IDL.Record({
    'error_message' : IDL.Text,
    'error_type' : IDL.Int32,
  });
  const NeuronsError = IDL.Variant({
    'InsufficientMaturity' : IDL.Null,
    'InsufficientStake' : IDL.Null,
    'Other' : IDL.Text,
    'GovernanceError' : GovernanceError,
    'ProposalNeuronMissing' : IDL.Null,
  });
  const NeuronResult = IDL.Variant({ 'ok' : Neuron, 'err' : NeuronsError });
  const AvailableLiquidityGraph = IDL.Vec(IDL.Tuple(IDL.Int, IDL.Nat64));
  const BlockIndex = IDL.Nat64;
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const ICRC1TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TokenError = IDL.Variant({
    'InsufficientAllowance' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'ErrorOperationStyle' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'LedgerTrap' : IDL.Null,
    'ErrorTo' : IDL.Null,
    'Other' : IDL.Text,
    'BlockUsed' : IDL.Null,
    'AmountTooSmall' : IDL.Null,
  });
  const WithdrawalsError = IDL.Variant({
    'InvalidAddress' : IDL.Null,
    'TransferError' : TransferError,
    'NeuronsError' : NeuronsError,
    'InsufficientBalance' : IDL.Null,
    'ICRC1TransferError' : ICRC1TransferError,
    'InsufficientLiquidity' : IDL.Null,
    'Other' : IDL.Text,
    'TokenError' : TokenError,
  });
  const PayoutResult = IDL.Variant({
    'ok' : BlockIndex,
    'err' : WithdrawalsError,
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Time = IDL.Int;
  const Withdrawal = IDL.Record({
    'id' : IDL.Text,
    'readyAt' : IDL.Opt(Time),
    'total' : IDL.Nat64,
    'pending' : IDL.Nat64,
    'createdAt' : Time,
    'user' : IDL.Principal,
    'disbursed' : IDL.Nat64,
    'available' : IDL.Nat64,
    'expectedAt' : Time,
    'disbursedAt' : IDL.Opt(Time),
  });
  const Result_1 = IDL.Variant({ 'ok' : Withdrawal, 'err' : WithdrawalsError });
  const DepositErr = IDL.Variant({
    'TransferFailure' : IDL.Null,
    'BalanceLow' : IDL.Null,
  });
  const DepositReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : DepositErr });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  const FlushPendingDepositsResult = IDL.Variant({
    'ok' : IDL.Vec(TransferResult),
    'err' : NeuronsError,
  });
  const ApplyInterestSummary = IDL.Record({
    'applied' : Tokens,
    'affiliatePayouts' : IDL.Nat,
    'totalHolders' : IDL.Nat,
    'supply' : IDL.Record({ 'after' : Tokens, 'before' : Tokens }),
    'timestamp' : Time,
    'remainder' : Tokens,
  });
  const ApplyInterestResult = IDL.Variant({
    'ok' : ApplyInterestSummary,
    'err' : NeuronsError,
  });
  const SplitNewWithdrawalNeuronsResult = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64, IDL.Bool)),
    'err' : NeuronsError,
  });
  const DailyResult = IDL.Tuple(
    IDL.Opt(ApplyInterestResult),
    IDL.Opt(FlushPendingDepositsResult),
    IDL.Opt(SplitNewWithdrawalNeuronsResult),
  );
  const Result = IDL.Variant({ 'ok' : IDL.Reserved, 'err' : IDL.Text });
  const JobResult = IDL.Record({
    'completedAt' : IDL.Opt(Time),
    'result' : IDL.Opt(Result),
    'startedAt' : Time,
  });
  const Lead = IDL.Record({
    'firstTouchAt' : Time,
    'principal' : IDL.Principal,
    'convertedAt' : IDL.Opt(Time),
    'lastTouchAt' : Time,
    'affiliate' : IDL.Opt(IDL.Principal),
  });
  const Payout = IDL.Record({ 'createdAt' : Time, 'amount' : IDL.Nat });
  const UpgradeData = IDL.Variant({
    'v1' : IDL.Record({
      'codes' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
      'leads' : IDL.Vec(Lead),
      'totals' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
      'conversions' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Principal))),
      'payouts' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(Payout))),
    }),
  });
  const ReferralStats = IDL.Record({
    'code' : IDL.Text,
    'count' : IDL.Nat,
    'earned' : IDL.Nat,
  });
  const Metric = IDL.Record({
    't' : IDL.Text,
    'value' : IDL.Text,
    'help' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'labels' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Blob = IDL.Vec(IDL.Nat8);
  const NeuronsResult = IDL.Variant({
    'ok' : IDL.Vec(Neuron),
    'err' : NeuronsError,
  });
  const NeuronId = IDL.Record({ 'id' : IDL.Nat64 });
  const TxReceiptError = IDL.Variant({
    'InsufficientAllowance' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'ErrorOperationStyle' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'LedgerTrap' : IDL.Null,
    'ErrorTo' : IDL.Null,
    'Other' : IDL.Text,
    'BlockUsed' : IDL.Null,
    'AmountTooSmall' : IDL.Null,
  });
  const TxReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TxReceiptError });
  return IDL.Service({
    'accountIdFromPrincipal' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'addOwner' : IDL.Func([IDL.Principal], [], ['oneway']),
    'addStakingNeuron' : IDL.Func([IDL.Nat64], [NeuronResult], []),
    'aprMicrobips' : IDL.Func([], [IDL.Nat64], ['query']),
    'availableBalance' : IDL.Func([], [IDL.Nat64], []),
    'availableLiquidityGraph' : IDL.Func([], [AvailableLiquidityGraph], []),
    'completeWithdrawal' : IDL.Func(
        [IDL.Principal, IDL.Nat64, IDL.Text],
        [PayoutResult],
        [],
      ),
    'createWithdrawal' : IDL.Func([Account, IDL.Nat64], [Result_1], []),
    'depositIcp' : IDL.Func([], [DepositReceipt], []),
    'depositIcpFor' : IDL.Func([IDL.Principal], [DepositReceipt], []),
    'exchangeRate' : IDL.Func([], [IDL.Nat64, IDL.Nat64], ['query']),
    'flushPendingDeposits' : IDL.Func(
        [],
        [IDL.Opt(FlushPendingDepositsResult)],
        [],
      ),
    'getAppliedInterest' : IDL.Func([], [IDL.Vec(ApplyInterestSummary)], []),
    'getAppliedInterestMerges' : IDL.Func(
        [],
        [IDL.Vec(IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64, NeuronResult)))],
        [],
      ),
    'getDepositAddress' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Text], ['query']),
    'getDepositAddressFor' : IDL.Func([IDL.Principal], [IDL.Text], ['query']),
    'getDepositSubaccount' : IDL.Func(
        [IDL.Opt(IDL.Text)],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'getDepositSubaccount2' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'getDepositSubaccount3' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getDepositSubaccountFor' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'getLastDailyJobResult' : IDL.Func([], [DailyResult], []),
    'getLastJobResult' : IDL.Func([IDL.Text], [IDL.Opt(JobResult)], []),
    'getReferralData' : IDL.Func([], [IDL.Opt(UpgradeData)], []),
    'getReferralStats' : IDL.Func([], [ReferralStats], []),
    'getTotalMaturity' : IDL.Func([], [IDL.Nat64], []),
    'get_all_owners' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'listDissolvingNeurons' : IDL.Func([], [IDL.Vec(Neuron)], []),
    'listNeuronsToDisburse' : IDL.Func([], [IDL.Vec(Neuron)], []),
    'listWithdrawals' : IDL.Func([IDL.Principal], [IDL.Vec(Withdrawal)], []),
    'metrics' : IDL.Func([], [IDL.Vec(Metric)], []),
    'neuronAccountId' : IDL.Func([IDL.Principal, IDL.Nat64], [IDL.Text], []),
    'neuronAccountIdSub' : IDL.Func([IDL.Principal, Blob], [IDL.Text], []),
    'refreshNeuronsAndApplyInterest' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64, IDL.Bool))],
        [],
      ),
    'removeDisbursedNeurons' : IDL.Func(
        [IDL.Vec(IDL.Nat64)],
        [IDL.Vec(Neuron)],
        [],
      ),
    'removeOwner' : IDL.Func([IDL.Principal], [], ['oneway']),
    'resetStakingNeurons' : IDL.Func([IDL.Vec(IDL.Nat64)], [NeuronsResult], []),
    'setAppliedInterest' : IDL.Func([IDL.Vec(ApplyInterestSummary)], [], []),
    'setAprOverride' : IDL.Func([IDL.Opt(IDL.Nat64)], [], []),
    'setInitialSnapshot' : IDL.Func(
        [],
        [IDL.Text, IDL.Vec(IDL.Tuple(Account, IDL.Nat))],
        [],
      ),
    'setLastJobResult' : IDL.Func([IDL.Text, JobResult], [], []),
    'setMetrics' : IDL.Func([IDL.Opt(IDL.Principal)], [], ['oneway']),
    'setReferralData' : IDL.Func([IDL.Opt(UpgradeData)], [], []),
    'setSchedulerPaused' : IDL.Func([IDL.Bool], [], []),
    'setToken' : IDL.Func([IDL.Principal], [], ['oneway']),
    'setTokenMintingAccount' : IDL.Func([], [], []),
    'setTotalMaturity' : IDL.Func([IDL.Nat64], [], []),
    'stakingNeuronBalances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64))],
        [],
      ),
    'stakingNeurons' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'id' : NeuronId, 'accountId' : IDL.Text }))],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], []),
    'withdrawProtocolFees' : IDL.Func([IDL.Principal], [TxReceipt], []),
    'withdrawalsTotal' : IDL.Func([], [IDL.Nat64], []),
  });
};
export const init = ({ IDL }) => { return []; };