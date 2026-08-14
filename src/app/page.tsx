import { Greeter } from "@/components/greeter";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-white/[.145] dark:text-zinc-400">
            selfish
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Cloud Agent environment check
          </h1>
          <p className="max-w-sm text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Enter a name and send it to the <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.85em] dark:bg-white/[.08]">/api/greet</code> route
            handler to confirm the full client → server round trip works.
          </p>
        </div>
        <Greeter />
      </main>
    </div>
  );
}
