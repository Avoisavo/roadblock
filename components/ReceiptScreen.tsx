import Image from "next/image";
import { type ReactNode } from "react";

export default function ReceiptScreen() {
  return (
    <div
      className="flex min-h-full flex-col bg-[#f2f2f3] px-5 pb-6 pt-23 text-[#1d1e22]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}
    >
      <div className="mb-3 flex justify-center">
        <div className="grid h-17 w-17 place-items-center rounded-full bg-[#14d860]">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-8 w-8"
          >
            <path
              d="M5.5 12.5l4.2 4.2L18.8 7.5"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <p className="text-center text-[46px] font-medium leading-none tracking-[-0.5px]">RM 7.00</p>
      <p className="text-center text-[13px] font-normal leading-none text-[#6f7074]">Paid</p>

      <div className="mx-auto mt-3 w-fit rounded-xl bg-[#e5ebf3] px-3.5 py-1.5 text-[15px] font-medium text-[#1b67bf]">
        + 7 points
      </div>

      <div className="mt-11 space-y-3">
        <DetailRow label="Merchant" value="KONG WEI YEW" />
        <DetailRow label="Payment Details" value="No.8" />
        <DetailRow
          label="Transaction Type"
          value="QR TNGD"
          prefix={
            <span className="mr-1.5 inline-flex items-center align-middle">
              <Image
                src="/image.png"
                alt="DuitNow"
                width={26}
                height={32}
                className="h-5 w-auto object-contain"
              />
            </span>
          }
        />
        <DetailRow label="Date/Time" value="23/04/2026 12:28:43" />
        <DetailRow
          label="eWallet Ref No."
          value="2026042310110000010000TNGOW3MY171339686080792"
          wrap
        />
        <DetailRow label="Payment Method" value="eWallet Balance" />
      </div>

      <div className="mt-6 grid grid-cols-[120px_1fr] gap-3 rounded-xs bg-[#dce7f6] px-3 py-3">
        <div className="h-24 rounded-md bg-[linear-gradient(120deg,#7bd6ff_0%,#95e6ff_45%,#d5f5ff_100%)]" />
        <div>
          <p className="text-[15px] font-bold leading-[1.12]">Pay without the hassle of reloading!</p>
          <p className="mt-1 text-[14px] leading-[1.12] text-[#4d5f7f]">
            Complete payments even if your eWallet balance is insufficient. No more last minute reloads!
          </p>
          <button
            type="button"
            className="mt-2 w-full rounded-full bg-[#045ff5] py-1.5 text-[14px] font-semibold text-white"
          >
            Set up now
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-[#0a66e8] py-3 text-[19px] font-medium text-white"
      >
        Done
      </button>
    </div>
  );
}

function DetailRow({
  label,
  value,
  wrap = false,
  prefix,
}: {
  label: string;
  value: string;
  wrap?: boolean;
  prefix?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr] items-start gap-2">
      <p className="text-[14px] text-[#8b8d92]">{label}</p>
      <p className={`text-right font-medium leading-[1.2] ${wrap ? "break-all text-[14px]" : "text-[14px]"}`}>
        {prefix}
        {value}
      </p>
    </div>
  );
}
