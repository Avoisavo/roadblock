"use client";

import { useState } from "react";
import PayScreen from "../components/PayScreen";
import ReceiptScreen from "../components/ReceiptScreen";

type DemoScreen = "pay" | "receipt";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<DemoScreen>("pay");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-107.5 flex-col p-3 sm:py-6">
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-[#d8deeb] bg-white/95 p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveScreen("pay")}
          className={`w-1/2 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition ${
            activeScreen === "pay"
              ? "bg-[#0666dc] text-white"
              : "text-[#476083] hover:bg-[#eef4ff]"
          }`}
        >
          Pay Screen
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen("receipt")}
          className={`w-1/2 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition ${
            activeScreen === "receipt"
              ? "bg-[#0666dc] text-white"
              : "text-[#476083] hover:bg-[#eef4ff]"
          }`}
        >
          Success Screen
        </button>
      </div>

      <section className="relative h-202.5 overflow-hidden rounded-4xl border border-[#d8deeb] bg-[#f2f2f4] shadow-[0_20px_45px_rgba(22,38,78,0.18)] sm:h-205">
        {activeScreen === "pay" ? <PayScreen /> : <ReceiptScreen />}
      </section>
    </main>
  );
}
