"use client";

import { useState } from "react";

export default function PayScreen() {
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  const recommendations = [
    {
      id: "tealive-boba",
      name: "Haidilao RM13 Drink Pair",
      image: "/tealivebobatea.jpg",
      promoPrice: "RM13.00",
      originalPrice: "RM25.20",
      discount: "48%",
    },
    {
      id: "gongcha-pearls",
      name: "Haidilao Cake & Drink Bundle",
      image: "/gongchatea.jpg",
      promoPrice: "RM21.00",
      originalPrice: "RM28.15",
      discount: "25%",
    },
    {
      id: "tealive-combo",
      name: "Haidilao B1F1 Snack Set",
      image: "/tealivebobatea.jpg",
      promoPrice: "RM34.70",
      originalPrice: "RM69.40",
      discount: "50%",
    },
    {
      id: "gongcha-combo",
      name: "Haidilao B1F1 Supper Combo",
      image: "/gongchatea.jpg",
      promoPrice: "RM31.80",
      originalPrice: "RM63.60",
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
      <header className="bg-[#2f5fb4] px-4 pb-20 pt-6 text-white">
        <div className="relative flex items-center justify-center pb-7">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute left-0 h-6 w-6 shrink-0 fill-white"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
          <h1 className="text-[24px] font-medium leading-none">Transfer Money</h1>
        </div>
        <p className="text-[15px] text-[#dbe7ff]">Transfer to</p>
      </header>

      <div className="-mt-16 px-4 pb-6 pt-0">
        <div className="overflow-hidden rounded-md shadow-[0_2px_10px_rgba(24,35,56,0.12)]">
          <div className="bg-[linear-gradient(150deg,#e8dcc7_0%,#e1ceb0_45%,#d2bb97_100%)] px-2 py-2">
            <div className="flex items-center gap-4 rounded-[20px] border-[4px] border-[#6d4c37] bg-[rgba(247,235,211,0.45)] px-3 py-2.5">
              <div className="grid h-13 w-13 place-items-center rounded-full bg-[#b8e2f3] text-[#1477e9]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5 19c0-3.1 3.2-5 7-5s7 1.9 7 5" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-medium leading-none text-[#23262b]">WONG JUN SHEN</p>
                <p className="mt-1 text-[13px] leading-none text-[#666c74]">Junshen</p>
                <p className="mt-1.5 text-[14px] leading-none text-[#666c74]">+60 11-512 88210</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#dbe0eb] px-3 py-2 text-[13px] text-[#444b55]">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
              <circle cx="10" cy="10" r="8" />
              <path d="M6.2 10.3 8.7 12.7 13.8 7.6" />
            </svg>
            <p>Always verify recipient name before transferring.</p>
          </div>
        </div>

        <div className="mt-5 rounded-md bg-[#e5e5e8] px-3 pb-3.5 pt-3">
          <p className="text-[16px] text-[#63656b]">Amount</p>
          <div className="mt-2 flex items-baseline gap-2 border-b-2 border-[#77797e] pb-2.5">
            <span className="text-[25px] font-bold leading-none text-[#0a66df]">RM</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder=""
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              className="w-full bg-transparent text-[28px] font-medium leading-none text-[#2b2c30] placeholder:text-[#9ea0a6] outline-none"
              aria-label="Amount"
            />
          </div>
        </div>

        <div className="mt-3 rounded-md bg-[#e5e5e8] px-3 pb-2 pt-3">
          <p className="text-[16px] text-[#76787d]">Payment Details (optional)</p>
          <input
            type="text"
            maxLength={25}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            className="mt-4 w-full border-b border-[#a2a5aa] bg-transparent pb-1 text-[16px] text-[#2b2c30] outline-none placeholder:text-[#a0a2a8]"
            placeholder=""
            aria-label="Payment details"
          />
          <p className="pt-1 text-right text-[16px] text-[#7f8187]">{details.length}/25</p>
        </div>

        <div className="mt-4">
          <div className="rounded-xl border border-[#d7d9de] bg-[#e5e5e8] px-2.5 py-2">
            <p className="text-[12px] font-medium leading-[1.25] text-[#2c323a]">
              Based on your purchase behavior, here are suggestions for HAIDILAO.
            </p>
            <div className="mt-2 grid max-h-58 grid-cols-2 gap-2 overflow-y-auto pr-0.5">
              {recommendations.map((deal) => {
                const isSelected = selectedDeal === deal.id;

                return (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => setSelectedDeal((prev) => (prev === deal.id ? null : deal.id))}
                    aria-pressed={isSelected}
                    className={`rounded-lg bg-white p-1 text-left transition ${
                      isSelected
                        ? "ring-2 ring-[#2f78e8] shadow-[0_4px_12px_rgba(40,83,148,0.2)]"
                        : "ring-1 ring-[#d4dae4]"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-[#eceff5]">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="h-20 w-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded-full bg-[#2d66d3] px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Voucher
                      </span>
                    </div>

                    <p className="mt-1 h-8 overflow-hidden text-[12px] leading-[1.2] text-[#2a2f37]">
                      {deal.name}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1">
                      <p className="text-[15px] font-semibold leading-none text-[#1e63d6]">{deal.promoPrice}</p>
                      <span className="rounded-full bg-[#ff6a28] px-1 py-[1px] text-[10px] font-semibold leading-none text-white">
                        {deal.discount}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] leading-none text-[#8a8f99] line-through">{deal.originalPrice}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          className={`mx-auto mt-7 block w-[86%] rounded-full py-3 text-[19px] font-medium transition-colors ${
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
