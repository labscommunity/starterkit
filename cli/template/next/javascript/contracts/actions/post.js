/* eslint-disable no-undef */

export function addComment(state, action) {
  const input = action.input;

  state.comments.push({
    comment: input.txnData.comment,
    username: input.txnData.username,
    id: action.caller,
  });

  return { state };
}

export function likePost(state, action) {
  if (action.caller in state.likes) {
    throw new ContractError("User has already liked!");
  }

  state.likes[action.caller] = true;

  return { state };
}
