import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import NavBar from "@/components/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StarterKit",
  description: "Create a full-stack, typesafe Arweave app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ArweaveWalletKit
        config={{
          permissions: [
            "ACCESS_ADDRESS",
            "SIGN_TRANSACTION",
            "DISPATCH",
            "ACCESS_PUBLIC_KEY",
            "SIGNATURE",
          ],
          ensurePermissions: true,
          appInfo: {
            name: "StarterKit",
          },
        }}
      >
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </ArweaveWalletKit>
    </html>
  );
}
