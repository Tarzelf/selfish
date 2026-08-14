"use client";

import { useState } from "react";

interface GreetResponse {
  message: string;
  receivedAt: string;
}

export function Greeter() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/greet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as GreetResponse;
      setGreeting(data.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Your name
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
          className="rounded-lg border border-black/[.12] bg-transparent px-4 py-2.5 text-base text-black outline-none transition-colors focus:border-black/[.4] dark:border-white/[.18] dark:text-zinc-50 dark:focus:border-white/[.5]"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 items-center justify-center rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Greeting…" : "Say hello"}
        </button>
      </form>

      {greeting && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {greeting}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}
