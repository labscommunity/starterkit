import { QueriedComment } from "@/types/query";
import { queryAllTransactionsGQL } from "arweavekit/graphql";
import { getTransaction } from "arweavekit/transaction";

export async function getComments(txId: string): Promise<QueriedComment[]> {
  const query = `
query{
  transactions(tags: [
  { name: "Content-Type", values: ["text/plain"] }, 
          { name: "Data-Protocol", values: ["comment"] },
          { name: "Data-Source", values: "${txId}" }
  ] first: 100) {
edges {
  node {
    id
    owner {
      address
    }
    tags {
      name
      value
    }
    block {
      timestamp
    }
  }
}
}
}

`;

  const response = await queryAllTransactionsGQL(query, {
    gateway: "ar-io.dev",
    filters: {},
  });
  const commentsList = await Promise.all(
    response.map(async (edges): Promise<QueriedComment> => {
      const comment = await getTransaction({
        transactionId: edges.node.id,
        environment: "mainnet",
      });

      return {
        id: edges.node.id,
        comment: new TextDecoder().decode(comment.data),
        creatorId: edges.node.owner.address,
      };
    })
  );

  return commentsList;
}
