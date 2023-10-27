import { Loader2 } from "lucide-react";

export function Spinner(props) {
  const size = props.size || 28;
  return <Loader2 height={size} width={size} className={`animate-spin`} />;
}
