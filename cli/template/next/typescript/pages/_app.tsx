import "@/styles/globals.css";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ArweaveWalletKit
          config={{
            permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH", "ACCESS_PUBLIC_KEY", "SIGNATURE"],
            ensurePermissions: true,
            appInfo: {
              name: "StarterKit",
            },
          }}
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
              <Component {...pageProps} />;
            </div>
          </div>
          <TailwindIndicator />
        </ArweaveWalletKit>
      </ThemeProvider>
    </div>
  );
}
