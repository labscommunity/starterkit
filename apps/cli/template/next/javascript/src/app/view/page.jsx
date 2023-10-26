import { Assets } from "@/components/assets";

export const metadata = {
  title: `View`,
};

export default function ViewPage() {
  return (
    <div className="flex">
      <section className="container grid items-center gap-6 py-8 md:py-10 w-full">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            View your Atomic Assets 🖼️
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">With on-chain likes and comments.</p>
        </div>
        <Assets />
      </section>
    </div>
  );
}
