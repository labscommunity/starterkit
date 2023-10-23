import { useMediaQuery } from "react-responsive";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../tailwind.config"; // Your tailwind config

const fullConfig = resolveConfig(tailwindConfig);

const breakpoints = fullConfig?.theme?.screens || {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

export function useBreakpoint(breakpointKey) {
  const breakpointValue = breakpoints[breakpointKey];
  const bool = useMediaQuery({
    query: `(max-width: ${breakpointValue})`,
  });
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

  return {
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    [`isAbove${capitalizedKey}`]: !bool,
    [`isBelow${capitalizedKey}`]: bool,
  };
}
