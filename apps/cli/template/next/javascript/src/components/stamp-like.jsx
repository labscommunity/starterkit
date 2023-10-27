import * as React from "react";
import Stamps from "@permaweb/stampjs";
// @ts-ignore
import { InjectedArweaveSigner } from "warp-contracts-plugin-signature";
import Arweave from "arweave";
import { Heart } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

let stampInstance;

async function getStamps() {
  if (stampInstance) return stampInstance;
  // @ts-ignore
  const { WarpFactory } = await import("warp-contracts");
  stampInstance = Stamps.init({
    warp: WarpFactory.forMainnet(),
    arweave: Arweave.init({}),
    wallet: new InjectedArweaveSigner(window.arweaveWallet), // Ensure you have injected the Arweave wallet globally
  });
  return stampInstance;
}

export function Stamp(props) {
  const { connected } = useUser();
  const [stampCount, setStampCount] = React.useState(0);
  const [hasStamped, setHasStamped] = React.useState(false);

  const handleStampClick = async () => {
    if (!hasStamped) {
      const stamps = await getStamps();
      await stamps.stamp(props.txId, 0, []);
      const newCount = stampCount + 1;
      setStampCount(newCount);
      setHasStamped(true);
    }
  };

  React.useEffect(() => {
    async function fetchStampData() {
      const stamps = await getStamps();
      const { total } = await stamps.count(props.txId);
      const stampedStatus = await stamps.hasStamped(props.txId);

      setStampCount(total);
      setHasStamped(stampedStatus);
    }

    fetchStampData();
  }, [props.txId]);

  return (
    <HoverCard>
      <HoverCardTrigger className={cn("flex gap-2 items-center")}>
        <span>{stampCount}</span>
        <button
          onClick={handleStampClick}
          disabled={!connected || hasStamped}
          className={`
            transition 
            ${hasStamped ? "text-red-500" : ""}
            ${!hasStamped && connected ? "hover:text-red-500" : ""}
          `}
        >
          <Heart size={16} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {!connected ? (
          <div className="text-center">Please connect to app before liking.</div>
        ) : (
          hasStamped && <div className="text-center">You have already liked this post.</div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}