"use client";

import { siteConfig } from "@/config/site";
import { InputForm } from "@/components/input-form";
import Head from "next/head";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>
      <div className="flex">
        <section className="container grid items-center gap-6 py-8 md:py-10 w-full">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Create your own Atomic Assets 🖼️
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">With real world rights.</p>
          </div>
          <InputForm />
          {/* <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div> */}
        </section>
      </div>
    </>
  );
}
