import contractData from "@/contracts/contractData.json";
// imports
import { queryAllTransactionsGQL } from "arweavekit/graphql";

// function to fetch posts create from defined contract source
export async function getAssetData() {
  const response = await queryAllTransactionsGQL(query, {
    gateway: "arweave.net",
    filters: {},
  });

  const findTagValue = (tagName, tags) => {
    return tags.find((tag) => tag.name === tagName)?.value;
  };

  const findTopicValues = (tags) => {
    return tags.filter((tag) => tag.name.includes(tag.value)).map((tag) => tag.value);
  };

  const determineLicense = (tags) => {
    let licenses = [];

    if (findTagValue("Access", tags) === "Restricted") {
      licenses.push(findTagValue("Access", tags) ?? "");
      licenses.push(findTagValue("Access-Fee", tags) ?? "");
    } else if (findTagValue("Derivation", tags) === "Allowed-with-license-fee") {
      licenses.push(findTagValue("Derivation", tags) ?? "");
      licenses.push(findTagValue("Derivation-Fee", tags) ?? "");
    } else if (findTagValue("Commercial-Use", tags) === "Allowed") {
      licenses.push(findTagValue("Commercial-Use", tags) ?? "");
      licenses.push(findTagValue("Commercial-Fee", tags) ?? "");
    } else {
      licenses.push("Default-Public-Use");
      licenses.push("None");
    }

    return licenses;
  };

  return response.map((edges) => {
    const tags = edges.node.tags;

    return {
      id: edges.node.id,
      title: findTagValue("Title", tags) || "",
      description: findTagValue("Description", tags) || "",
      license: determineLicense(tags),
      topics: findTopicValues(tags),
      creatorId: findTagValue("Creator", tags) || edges.node.owner.address,
      creatorName: findTagValue("Creator-Name", tags) || "",
    };
  });
}
// query requesting posts referencing the defined contract source
const queryId = contractData.contractId;
const query = `
query{
  transactions(tags: [
  { name: "Contract-Src", values: ["${queryId}"] }
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
