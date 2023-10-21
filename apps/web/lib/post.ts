import { Asset } from "@/types/post";
import { contractId } from "@/contracts/contractData.json";
import { createTransaction } from "arweavekit/transaction";

const toArrayBuffer = async (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (e) => {
      resolve(e.target?.result as ArrayBuffer);
    });
  });

export async function postAsset(asset: Asset) {
  const data: ArrayBuffer = await toArrayBuffer(asset.file);

  // array of input tags
  const inputTags: { name: string; value: string }[] = [
    // Content mime (media) type (For eg, "image/png")
    { name: "Content-Type", value: asset.file.type },
    // Help network identify post as SmartWeave Contract
    { name: "App-Name", value: "SmartWeaveContract" },
    { name: "App-Version", value: "0.3.0" },
    // Link post to contract source
    { name: "Contract-Src", value: contractId },
    // Initial state for our post (as a contract instance)
    {
      name: "Init-State",
      value: JSON.stringify({
        creator: asset.creatorId,
        owner: asset.creatorId,
        ticker: "STARTERKIT-ASSET",
        balances: {
          [asset.creatorId]: 1,
        },
        contentType: asset.file.type,
        comments: [],
        likes: {},
      }),
    },
    { name: "Creator-Name", value: asset.creatorName },
    // Standard tags following ANS-110 standard for discoverability of asset
    { name: "Creator", value: asset.creatorId },
    { name: "Title", value: asset.title },
    { name: "Description", value: asset.description },
    { name: "Type", value: "image" },
  ];

  // adding hashtags passed in by users to the 'inputTags' array
  asset.tags.map((t, i) => {
    inputTags.push({ name: t.value, value: t.value });
  });

  const txn = await createTransaction({
    type: "data",
    environment: "mainnet",
    data: data,
    options: {
      tags: inputTags,
      signAndPost: true,
    },
  });

  console.log("PRE Transaction data >>>>>>>>>>>>>>", asset, inputTags);
  console.log("POST Transaction data >>>>>>>>>>>>>>", txn);
}
