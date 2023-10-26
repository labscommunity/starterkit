import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size?: number;
};

export function Spinner(props: SpinnerProps) {
  const size = props.size || 6;
  return <Loader2 className={`h-${size} w-${size} animate-spin`} />;
}
