"use client";

import { useState } from "react";

export default function PayScreen() {
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  const recommendations = [
    {
      id: "secret-recipe-cake",
      name: "Secret Recipe Chocolate Indulgence",
      image: "/secretrecipecake.jpg",
      promoPrice: "RM13.00",
      originalPrice: "RM25.20",
      discount: "48%",
    },
    {
      id: "gongcha-tea",
      name: "Gong Cha Milk Foam Series",
      image: "/gongchatea.jpg",
      promoPrice: "RM21.00",
      originalPrice: "RM28.15",
      discount: "25%",
    },
    {
      id: "tealive-boba",
      name: "Tealive Signature Boba Tea",
      image: "/tealivebobatea.jpg",
      promoPrice: "RM34.70",
      originalPrice: "RM69.40",
      discount: "50%",
    },
  ];

  const normalizedAmount = amount.replace(/,/g, "").trim();
  const amountValue = Number(normalizedAmount);
  const canConfirm =
    normalizedAmount.length > 0 && Number.isFinite(amountValue) && amountValue > 0;

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div
      className="min-h-full bg-[#efeff1] text-[#26272b]"
      style={{ fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif" }}
    >
      <header className="bg-[#2f5fb4] px-4 pb-14 pt-4 text-white">
        <div className="relative flex items-center justify-center pb-4">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute left-0 h-6 w-6 shrink-0 fill-white"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
          <h1 className="text-[20px] font-medium leading-none">Transfer Money</h1>
        </div>
        <p className="text-[13px] text-[#dbe7ff]">Transfer to</p>
      </header>

      <div className="-mt-10 px-4 pb-4 pt-0">
        <div className="overflow-hidden rounded-md shadow-[0_2px_10px_rgba(24,35,56,0.12)]">
          <div className="bg-[linear-gradient(150deg,#e8dcc7_0%,#e1ceb0_45%,#d2bb97_100%)] px-1.5 py-1.5">
            <div className="flex items-center gap-3 rounded-[16px] border-[3px] border-[#6d4c37] bg-[rgba(247,235,211,0.45)] px-2.5 py-1.5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#b8e2f3] text-[#1477e9]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.2">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5 19c0-3.1 3.2-5 7-5s7 1.9 7 5" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium leading-none text-[#23262b]">WONG JUN SHEN</p>
                <p className="mt-0.5 text-[11px] leading-none text-[#666c74]">Junshen</p>
                <p className="mt-1 text-[12px] leading-none text-[#666c74]">+60 11-512 88210</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#dbe0eb] px-3 py-1.5 text-[11px] text-[#444b55]">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <circle cx="10" cy="10" r="8" />
              <path d="M6.2 10.3 8.7 12.7 13.8 7.6" />
            </svg>
            <p>Always verify recipient name before transferring.</p>
          </div>
        </div>

        <div className="mt-3 rounded-md bg-[#e5e5e8] px-3 pb-2 pt-2">
          <p className="text-[13px] text-[#63656b]">Amount</p>
          <div className="mt-1 flex items-baseline gap-2 border-b-2 border-[#77797e] pb-1.5">
            <span className="text-[20px] font-bold leading-none text-[#0a66df]">RM</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder=""
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              className="w-full bg-transparent text-[22px] font-medium leading-none text-[#2b2c30] placeholder:text-[#9ea0a6] outline-none"
              aria-label="Amount"
            />
          </div>
        </div>

        <div className="mt-2 rounded-md bg-[#e5e5e8] px-3 pb-1.5 pt-2">
          <p className="text-[13px] text-[#76787d]">Payment Details (optional)</p>
          <input
            type="text"
            maxLength={25}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            className="mt-2 w-full border-b border-[#a2a5aa] bg-transparent pb-0.5 text-[13px] text-[#2b2c30] outline-none placeholder:text-[#a0a2a8]"
            placeholder=""
            aria-label="Payment details"
          />
          <p className="pt-0.5 text-right text-[12px] text-[#7f8187]">{details.length}/25</p>
        </div>

        <div className="mt-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(24,35,56,0.06)] ring-1 ring-[#e6e8ee]">
            <div className="flex items-center justify-between border-b border-[#eef0f4] px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-[#eaf1ff] text-[#2f78e8]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
                    <path d="M12 2 9.2 8.6 2 9.3l5.5 4.8L5.8 21 12 17.3 18.2 21l-1.7-6.9L22 9.3l-7.2-.7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] font-semibold leading-none text-[#1f2430]">
                    Picked for you
                  </p>
                  <p className="mt-0.5 text-[10px] leading-none text-[#7a8090]">
                    Based on your purchases at Haidilao
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#ff6a28]">
                Deals
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#f7f8fb] p-2">
              {recommendations.map((deal) => {
                const isSelected = selectedDeal === deal.id;

                return (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => setSelectedDeal((prev) => (prev === deal.id ? null : deal.id))}
                    aria-pressed={isSelected}
                    className={`group overflow-hidden rounded-xl bg-white text-left transition-all duration-150 ${
                      isSelected
                        ? "ring-2 ring-[#2f78e8] shadow-[0_6px_16px_rgba(40,83,148,0.18)]"
                        : "ring-1 ring-[#e4e7ee] hover:ring-[#c9d2e2]"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="h-16 w-full object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded-md bg-[#ff6a28] px-1 py-[2px] text-[8px] font-bold leading-none text-white shadow-sm">
                        -{deal.discount}
                      </span>
                      <span className="absolute bottom-1 left-1 rounded-md bg-white/95 px-1 py-[2px] text-[8px] font-semibold leading-none text-[#2d66d3] backdrop-blur-sm">
                        Voucher
                      </span>
                    </div>

                    <div className="px-1.5 pb-1.5 pt-1">
                      <p className="line-clamp-2 h-[24px] text-[9px] font-medium leading-[1.25] text-[#2a2f37]">
                        {deal.name}
                      </p>

                      <div className="mt-1 flex flex-col gap-[1px]">
                        <p className="text-[11px] font-bold leading-none text-[#1e63d6]">
                          {deal.promoPrice}
                        </p>
                        <p className="text-[9px] leading-none text-[#a0a4ad] line-through">
                          {deal.originalPrice}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          className={`mx-auto mt-3 block w-[86%] rounded-full py-2.5 text-[16px] font-medium transition-colors ${
            canConfirm
              ? "bg-[#0a66e8] text-white"
              : "bg-[#d4d4d7] text-[#8b8d92]"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
