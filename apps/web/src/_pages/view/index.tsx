import { AssetCard } from "@/components/asset-card";
import { useUser } from "@/hooks/useUser";
import { getAssetData } from "@/lib/query-assets";
import { QueriedAsset } from "@/types/query";
import * as React from "react";

export default function ViewPage() {
  const { connected, address } = useUser();
  const [assets, setAssets] = React.useState<QueriedAsset[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const data = await getAssetData();
      setAssets(data);
    }
    fetchData();
  }, [connected, address]);

  return (
    <div className="flex">
      <section className="container grid items-center gap-6 py-8 md:py-10 w-full">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            View your Atomic Assets 🖼️
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            With on-chain likes and comments.
          </p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 w-full gap-6">
          {assets.map((asset) => (
            <AssetCard {...asset} key={asset.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
