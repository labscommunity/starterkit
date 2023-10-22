import * as React from "react";
import Link from "next/link";

interface FooterLink {
  title: string;
  href: string;
  disabled?: boolean;
}

export function Footer() {
  // Links:
  const links: FooterLink[] = [
    { title: "GitHub", href: "https://github.com/labscommunity/starterkit/" },
    { title: "ArweaveKit Docs", href: "https://docs.arweavekit.com/" },
    { title: "Twitter", href: "https://twitter.com/CommunityLabs" },
    { title: "Community Labs", href: "https://www.communitylabs.com/" },
  ];
  return (
    <footer className="flex flex-col md:flex-row pl-5 md:pl-0 justify-center py-5 gap-3 md:gap-10 border-t">
      {links?.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={`
              flex items-center font-medium transition-colors hover:text-foreground/80 text-sm text-foreground/60
              ${link.disabled ? "cursor-not-allowed opacity-80" : ""}
            `}
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Security measure for external links
        >
          {link.title}
        </Link>
      ))}
    </footer>
  );
}
