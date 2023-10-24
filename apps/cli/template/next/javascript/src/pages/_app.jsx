import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
  return (
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
            <Component {...pageProps} />
          </div>
          <Toaster />
          <Footer />
        </div>
        <TailwindIndicator />
      </ArweaveWalletKit>
    </ThemeProvider>
  );
}
