"use client"

import { test } from "@/serverFunctions/handleAuth";

export default function Home() {
  return (
    <main>
      <button
        onClick={async () => {
          await test()
        }}
      >
        click
      </button>
    </main>
  );
}