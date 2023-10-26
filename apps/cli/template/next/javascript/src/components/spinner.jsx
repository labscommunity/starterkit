import { Loader2 } from "lucide-react";

export function Spinner(props) {
  const size = props.size || 6;
  return <Loader2 className={`h-${size} w-${size} animate-spin`} />;
}
