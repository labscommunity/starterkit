import { Action, AddCommentInput, State } from "../types";

declare const ContractError: new (message?: string) => any;

export function addComment(state: State, action: Action) {
  const input = action.input as AddCommentInput;

  state.comments.push({
    comment: input.txnData.comment,
    username: input.txnData.username,
    id: action.caller,
  });

  return { state };
}

export function likePost(state: State, action: Action) {
  if (action.caller in state.likes) {
    throw new ContractError("User has already liked!");
  }

  state.likes[action.caller] = true;

  return { state };
}
