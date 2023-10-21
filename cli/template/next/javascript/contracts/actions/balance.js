/* eslint-disable no-undef */
export function balance(state, action) {
  const balances = state.balances;
  const target = action.input.target ?? action.caller;
  const ticker = state.ticker;

  if (typeof target !== "string") {
    throw new ContractError("Must specify target to get balance for");
  }

  if (target.length !== 43) {
    throw new ContractError("Target is not valid.");
  }

  if (typeof balances[target] !== "number") {
    throw new ContractError("Cannot get balance, target does not exist");
  }

  return {
    result: {
      target,
      ticker,
      balance: balances[target] || 0,
    },
  };
}
