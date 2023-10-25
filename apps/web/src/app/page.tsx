"use client";

import { InputForm } from "@/components/input-form";

export default function IndexPage() {
  return (
    <div className="flex">
      <section className="container grid items-center gap-6 py-8 md:py-10 w-full">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Create your own Atomic Assets 🖼️
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            With real world rights.
          </p>
        </div>
        <InputForm />
      </section>
    </div>
  );
}
