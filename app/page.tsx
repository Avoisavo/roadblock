"use client";

import { type ChangeEvent, type ReactNode, useEffect, useRef, useState } from "react";

type IconName =
  | "goal-city"
  | "apple-zone"
  | "asnb"
  | "my-prepaid"
  | "my-business"
  | "parking"
  | "travel-plus"
  | "more"
  | "cardmatch"
  | "payday"
  | "travel"
  | "taobao"
  | "apply"
  | "cash-flow"
  | "transfer"
  | "cards"
  | "home"
  | "eshop"
  | "go-finance"
  | "near-me"
  | "shield"
  | "eye"
  | "search"
  | "location"
  | "plane"
  | "link"
  | "grow"
  | "rewards"
  | "fuel-pump";

type PaymentVariant = "standard" | "travel";

type Recommendation = {
  id: string;
  name: string;
  image: string;
  promoPrice: string;
  originalPrice: string;
  discount: string;
  addOnContext: string;
};

type PaymentConfig = {
  merchantAmount: number;
  merchantName: string;
  paymentDetails: string;
  refNo: string;
  recommendations: Recommendation[];
  addOnTitle: string;
  addOnBadge: string;
  safeCopy: string;
};

const favourites = [
  { icon: "goal-city", label: "Goal City" },
  { icon: "apple-zone", label: "Apple Zone", apple: true },
  { icon: "asnb", label: "ASNB", logo: true },
  { icon: "my-prepaid", label: "MY Prepaid", prepaid: true },
  { icon: "my-business", label: "My Business", outlined: true },
  { icon: "parking", label: "Parking" },
  { icon: "travel-plus", label: "Travel+" },
  { icon: "more", label: "More", circle: true },
] as const;

const recommended = [
  { icon: "cardmatch", label: "CardMatch", cardmatch: true },
  { icon: "payday", label: "Payday" },
  { icon: "travel", label: "Travel" },
  { icon: "taobao", label: "Taobao", badge: true },
] as const;

const quickActions = [
  { icon: "apply", label: "Apply" },
  { icon: "cash-flow", label: "Cash flow" },
  { icon: "transfer", label: "Transfer" },
  { icon: "cards", label: "Cards" },
] as const;

const INITIAL_ACCOUNT_BALANCE = 500;

function formatCurrency(amount: number) {
  return `RM ${amount.toFixed(2)}`;
}

const paymentConfigs: Record<PaymentVariant, PaymentConfig> = {
  standard: {
    merchantAmount: 45,
    merchantName: "Hotpot",
    paymentDetails: "1 order from Hotpot",
    refNo: "xxxxxxxxx",
    addOnTitle: "Add to this payment",
    addOnBadge: "Optional",
    safeCopy: "Your payments will be processed in a safe and secured environment!",
    recommendations: [
      {
        id: "secret-recipe-cake",
        name: "Inside Scoop Ice Cream",
        image: "/insidescoop.jpg",
        promoPrice: "RM12.00",
        originalPrice: "RM25.20",
        discount: "48%",
        addOnContext: "Ice cream add-on",
      },
      {
        id: "gongcha-tea",
        name: "Tealive Boba Tea",
        image: "/tealivebobatea.jpg",
        promoPrice: "RM5.00",
        originalPrice: "RM28.15",
        discount: "25%",
        addOnContext: "Bubble tea add-on",
      },
    ],
  },
  travel: {
    merchantAmount: 188,
    merchantName: "Airport Essentials",
    paymentDetails: "1 order from Airport Essentials",
    refNo: "TRV-24819",
    addOnTitle: "Add travel essentials",
    addOnBadge: "Travel ready",
    safeCopy: "Pack smart and pay quickly for your trip essentials.",
    recommendations: [
      {
        id: "travel-luggage",
        name: "Carry-on Luggage",
        image: "/luggage.jpg",
        promoPrice: "RM89.00",
        originalPrice: "RM129.00",
        discount: "31%",
        addOnContext: "Travel add-on",
      },
      {
        id: "travel-neckpillow",
        name: "Memory Foam Neck Pillow",
        image: "/neckpillow.jpg",
        promoPrice: "RM29.00",
        originalPrice: "RM49.00",
        discount: "41%",
        addOnContext: "Comfort add-on",
      },
    ],
  },
};

function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "location":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M20 4 14.3 19.2c-.2.6-1 .7-1.4.1l-2.8-4-4.3-2.9c-.5-.4-.5-1.1.1-1.3L20 4Z" fill="currentColor" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="m2 13 8-.5L20.5 4c.8-.7 2 .1 1.6 1.1l-3.6 7.3 3.1 1.5c.7.3.6 1.3-.1 1.5l-3.8 1-2 3.8c-.4.7-1.4.7-1.7-.1l-1.4-3L2.7 15c-1-.3-.8-1.9.3-2Z" fill="currentColor" />
        </svg>
      );
    case "link":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M9.5 14.5 7 17a4 4 0 0 1-5.7-5.6L5.8 7A4 4 0 0 1 11.5 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="m14.5 9.5 2.5-2.5a4 4 0 1 1 5.7 5.6L18.2 17a4 4 0 0 1-5.7 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="m8.5 15.5 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 2.5 19 5v6.2c0 4.2-2.7 8-7 10.3-4.3-2.3-7-6.1-7-10.3V5l7-2.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeDasharray="3.2 3.2" />
          <path d="m8.1 12.2 2.4 2.3 5-5.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M2 12s3.7-6 10-6 10 6 10 6-3.7 6-10 6S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        </svg>
      );
    case "apply":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="10" y="6" width="22" height="34" rx="3.5" fill="none" stroke="currentColor" strokeWidth="3.4" />
          <path d="M18 6v8h14" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M16 19h11M16 26h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="33.5" cy="30.5" r="8.5" fill="white" stroke="currentColor" strokeWidth="3.2" />
          <path d="m30.5 30.6 2.1 2.1 4.2-4.7" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cash-flow":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 8a16 16 0 1 0 16 16H24Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" />
          <path d="M24 8a16 16 0 0 1 16 16H24Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" />
          <path d="M24 8v16h16" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "transfer":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="m8 22 28-10-10 28-5.2-9.1L8 22Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" />
          <path d="m20.8 30.9 2.7-8.3 12.5-10.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cards":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="8" y="10" width="32" height="24" rx="3.5" fill="none" stroke="currentColor" strokeWidth="3.4" />
          <path d="M8 19h32M27 28h8" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case "grow":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="13.5" r="9.5" fill="#ffc843" stroke="#e7a62a" strokeWidth="2.4" />
          <path d="M19.3 13.5h9.4" stroke="#b98519" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 23v9" stroke="#4cab58" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M24 28c-3.8-5.3-9.7-3.5-11.5-1.1C16 28.5 19.8 32.8 24 28Z" fill="#76cf7b" />
          <path d="M24 28c3.8-5.3 9.7-3.5 11.5-1.1C32 28.5 28.2 32.8 24 28Z" fill="#7fd28f" />
          <path d="M15 36h18" stroke="#8f5e37" strokeWidth="4" strokeLinecap="round" />
          <path d="M18 36c1.7-3.6 3.8-5.4 6-5.4 2.2 0 4.3 1.8 6 5.4" fill="#9c6840" />
          <path d="M8 14h3M37 11h3M10 20h2.5M35 20H38" stroke="#75b7ff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "rewards":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="10" y="18" width="28" height="20" rx="2.5" fill="#2f64e8" />
          <rect x="10" y="14" width="28" height="7" rx="2.5" fill="#ffd54b" />
          <path d="M24 14v24M10 28h28" stroke="white" strokeWidth="2.5" />
          <path d="M19 10c1.8 0 3.3 1.4 3.3 3.2 0 .8-.4 1.8-1.1 2.6H17c-1.4-1.2-1.6-3.7.3-5 .5-.5 1-.8 1.7-.8Zm10 0c-1.8 0-3.3 1.4-3.3 3.2 0 .8.4 1.8 1.1 2.6H31c1.4-1.2 1.6-3.7-.3-5-.5-.5-1-.8-1.7-.8Z" fill="#ffd54b" />
          <path d="M8 14h2.5M37.5 11H40M9.5 20H12" stroke="#ffb26f" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "fuel-pump":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.2" />
          <path d="M24 6a18 18 0 1 1-13.8 29.6" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <rect x="21" y="16" width="9" height="15" rx="1.7" fill="none" stroke="currentColor" strokeWidth="2.7" />
          <path d="M30 19h3.5c1.4 0 2.5 1.1 2.5 2.5v5.5c0 1.1.9 2 2 2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 19.5h2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
    case "cardmatch":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="11" y="11" width="18" height="24" rx="2.8" fill="none" stroke="currentColor" strokeWidth="3.3" transform="rotate(-11 20 23)" />
          <rect x="19" y="9" width="18" height="24" rx="2.8" fill="none" stroke="currentColor" strokeWidth="3.3" transform="rotate(-11 28 21)" />
          <rect x="22.5" y="20" width="8" height="11" rx="2" fill="#ffd54b" />
          <path d="M36 13.5v-5M39 16.5h5M35.5 16.5h-4.5M36 20.8v4.2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "payday":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="11" y="10" width="26" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="3.2" />
          <path d="M18 6v8M30 6v8M11 18h26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 35h8" fill="none" stroke="#ffd54b" strokeWidth="4.2" strokeLinecap="round" />
          <text x="24" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">25</text>
        </svg>
      );
    case "travel":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M10 34c4.4-6.7 9.2-10 14-10s9.6 3.3 14 10Z" fill="#ffd54b" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M12 34h24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M15 23c0-6 4.2-10 9-10 4.8 0 9 4 9 10-5.4 0-9 1.6-9 8.4 0-6.8-3.6-8.4-9-8.4Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M24 13v18M31 17l-7 6M17 17l7 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M33 25c0-3.4 2.3-5.6 5-5.6 2.7 0 5 2.2 5 5.6-3 0-5 1-5 4.5 0-3.5-2-4.5-5-4.5Z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M38 19.4v9.3" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
    case "taobao":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="5" y="5" width="38" height="38" rx="9" fill="#f5882f" />
          <text x="24" y="14" textAnchor="middle" fontSize="7" fontWeight="700" fill="white">Taobao</text>
          <circle cx="24" cy="29" r="10" fill="#f7b15d" />
          <circle cx="20.5" cy="27" r="1.5" fill="#60311c" />
          <circle cx="27.5" cy="27" r="1.5" fill="#60311c" />
          <path d="M21 32c2 1.7 4 1.7 6 0" fill="none" stroke="#60311c" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "goal-city":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="15" cy="12" r="5.2" fill="#ffd08b" />
          <path d="M10 26c1.8-5 4.5-8 8.2-8 3.8 0 6.3 2.4 7.8 7l-4.8 3.3-3.2-3-4.1 8H9.5Z" fill="#4c8ef6" />
          <path d="m24.5 10 8.2 6.6v10.8c0 5.4-3.4 10.1-8.2 12.6-4.8-2.5-8.2-7.2-8.2-12.6V16.6Z" fill="#ffd54b" stroke="#e9a825" strokeWidth="1.8" />
          <path d="M24.5 17.8 26.1 22l4.4.2-3.4 2.8 1.1 4.2-3.7-2.3-3.7 2.3 1.1-4.2-3.4-2.8 4.4-.2Z" fill="#f09c1f" />
        </svg>
      );
    case "apple-zone":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M29.9 7.5c-1.8.2-4 1.4-5.2 3.1-1 1.4-1.8 3.2-1.4 5 2 .1 4.1-1 5.3-2.7 1.2-1.6 1.9-3.4 1.3-5.4Z" fill="currentColor" />
          <path d="M34.7 24.8c0-5 4.1-7.4 4.3-7.5-2.3-3.4-6-3.9-7.3-4-3-.3-5.9 1.8-7.4 1.8-1.6 0-4-1.8-6.5-1.7-3.4.1-6.5 2-8.2 5-3.5 6-.9 15 2.5 20 1.7 2.4 3.7 5 6.4 4.9 2.6-.1 3.6-1.7 6.8-1.7 3.2 0 4.1 1.7 6.8 1.7 2.8 0 4.6-2.5 6.2-4.9 1.9-2.7 2.6-5.4 2.7-5.6-.1 0-6.3-2.4-6.3-8Z" fill="currentColor" />
        </svg>
      );
    case "asnb":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <text x="24" y="28" textAnchor="middle" fontSize="17" fontWeight="800" fill="currentColor">ASNB</text>
        </svg>
      );
    case "my-prepaid":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="14" y="6.5" width="20" height="34" rx="3.5" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M20.5 11h7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 32h12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 16.5c4.4 1.4 6 5.6 6 7.5s-1.6 6.1-6 7.5M39 20.2c1.8.8 2.6 2.6 2.6 3.8 0 1.2-.8 3-2.6 3.8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="23.5" y="16" width="13" height="9.5" rx="2" fill="#ffd54b" stroke="currentColor" strokeWidth="2.2" />
          <text x="30" y="22.7" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor">+60</text>
        </svg>
      );
    case "my-business":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M11 18h26v17H11Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M9 18h30l-2.4-7H11.4Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M15 35V25h8v10M28 25h5v10h-5Z" fill="none" stroke="currentColor" strokeWidth="2.8" />
          <path d="M14 11h20" fill="none" stroke="#ffd54b" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case "parking":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M11 28h5l5-11h9l5 7h4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="31.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <circle cx="32" cy="31.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <rect x="25.5" y="8" width="11" height="12" rx="2.3" fill="#ffd54b" stroke="currentColor" strokeWidth="2.6" />
          <text x="31" y="17" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor">P</text>
        </svg>
      );
    case "travel-plus":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="travel-plus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#326cf0" />
              <stop offset="100%" stopColor="#7b4dff" />
            </linearGradient>
          </defs>
          <path d="M15 31c0-6.2 4.6-11 11-11 6.2 0 11 4.4 11 10.4 0 6.1-4.8 11.1-11.8 11.1-3.4 0-6.6-1.2-8.9-3.4" fill="url(#travel-plus-gradient)" />
          <path d="M10 29.8c.5-8.4 7.1-15.1 15.6-15.1 8.9 0 16.1 7.2 16.1 16.1" fill="none" stroke="#7f66ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M27 10.5c2.8 1.5 4.8 4.4 5.2 7.8" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M35 8.5v4M33 10.5h4" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
    case "more":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="17" fill="#ffe36a" stroke="currentColor" strokeWidth="3" />
          <circle cx="18" cy="24" r="2.8" fill="currentColor" />
          <circle cx="24" cy="24" r="2.8" fill="currentColor" />
          <circle cx="30" cy="24" r="2.8" fill="currentColor" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.5H9.6V21H5a1 1 0 0 1-1-1Z" fill="currentColor" />
        </svg>
      );
    case "eshop":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="9" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 5h3l2 9h8.6l2.2-7H7.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18.5" cy="6.7" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <text x="18.5" y="8.2" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="currentColor">e</text>
        </svg>
      );
    case "go-finance":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.7" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <path d="M12 7.4v9.2M14.7 9.4c-.5-1-1.7-1.8-3.2-1.8-1.9 0-3.3 1-3.3 2.6s1.2 2.3 3.8 2.8c2.4.5 3.5 1.2 3.5 2.8 0 1.8-1.5 3-3.7 3-1.7 0-3-.7-3.9-1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "near-me":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 21c4.6-5.8 6.8-9.5 6.8-12.3A6.8 6.8 0 1 0 5.2 8.7C5.2 11.5 7.4 15.2 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          <circle cx="12" cy="8.7" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
  }
}

function StatusBar({ battery = "44" }: { battery?: string }) {
  return (
    <div className="status-bar">
      <span>3:39</span>
      <span className="location-arrow">
        <Icon name="location" className="icon-svg" />
      </span>
      <div className="status-icons">
        <span><Icon name="plane" className="icon-svg" /></span>
        <span><Icon name="link" className="icon-svg" /></span>
        <span className="battery">{battery}</span>
      </div>
    </div>
  );
}

function TopSearch({ placeholder = "Pay Bills" }: { placeholder?: string }) {
  return (
    <div className="top-search">
      <div className="country-pill">
        <span className="flag">🇲🇾</span>
        <span>MY</span>
        <span className="city-slice" />
      </div>
      <div className="search-pill">
        <span className="glass"><Icon name="search" className="icon-svg" /></span>
        <span>{placeholder}</span>
      </div>
      <div className="avatar">
        <span />
        <b />
        <i />
      </div>
    </div>
  );
}

function FeatureIcon({
  item,
}: {
  item: (typeof favourites)[number] | (typeof recommended)[number];
}) {
  return (
    <div className="feature">
      <div
        className={[
          "feature-mark",
          "apple" in item && item.apple ? "apple-mark" : "",
          "logo" in item && item.logo ? "asnb-mark" : "",
          "prepaid" in item && item.prepaid ? "prepaid-mark" : "",
          "outlined" in item && item.outlined ? "outlined-mark" : "",
          "circle" in item && item.circle ? "circle-mark" : "",
          "badge" in item && item.badge ? "taobao-mark" : "",
          "cardmatch" in item && item.cardmatch ? "cardmatch-mark" : "",
        ].join(" ")}
      >
        <Icon name={item.icon} className="icon-svg" />
      </div>
      <div className="feature-label">{item.label}</div>
    </div>
  );
}

function BottomNav({ onScan }: { onScan: () => void }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-item active">
        <span><Icon name="home" className="icon-svg" /></span>
        <b>Home</b>
      </div>
      <div className="nav-item">
        <span><Icon name="eshop" className="icon-svg" /></span>
        <b>eShop</b>
      </div>
      <button className="scan-fab" aria-label="Open scanner" onClick={onScan}>
        <span className="scan-icon">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
      <div className="nav-item">
        <span><Icon name="go-finance" className="icon-svg" /></span>
        <b>GOfinance</b>
      </div>
      <div className="nav-item">
        <span><Icon name="near-me" className="icon-svg" /></span>
        <b>Near Me</b>
      </div>
    </nav>
  );
}

function WalletHero({ accountBalance }: { accountBalance: number }) {
  return (
    <section className="wallet-shell">
      <div className="wallet-hero">
        <StatusBar battery="45" />
        <TopSearch />
        <div className="balance-row">
          <span className="shield"><Icon name="shield" className="icon-svg" /></span>
          <strong>{formatCurrency(accountBalance)}</strong>
          <span className="eye"><Icon name="eye" className="icon-svg" /></span>
        </div>
        <div className="asset-link">View asset details ›</div>
        <div className="hero-actions">
          <button>+&nbsp; Add money</button>
          <button>Transactions ›</button>
        </div>
      </div>
      <div className="quick-panel" aria-label="Quick actions">
        {quickActions.map((item) => (
          <div className="quick-action" key={item.label}>
            <span><Icon name={item.icon} className="icon-svg" /></span>
            <b>{item.label}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeScreen({
  accountBalance,
  onScan,
}: {
  accountBalance: number;
  onScan: () => void;
}) {
  return (
    <div className="phone home-phone">
      <div className="home-scroll">
        <WalletHero accountBalance={accountBalance} />
        <main className="home-content">
          <section className="info-grid">
            <div className="mini-card grow">
              <span className="mini-graphic"><Icon name="grow" className="icon-svg" /></span>
              <div>
                <b>Grow your money</b>
                <p>Start with just RM10</p>
              </div>
            </div>
            <div className="mini-card fuel">
              <div className="fuel-head">
                <span>BUDI<br />MADANI<br />RON95</span>
                <div>
                  <b>BUDI95</b>
                  <p>RON95 at RM1.99</p>
                </div>
              </div>
              <div className="fuel-balance">
                <div>
                  <p>Fuel balance</p>
                  <b>159 litres</b>
                </div>
                <span><Icon name="fuel-pump" className="icon-svg" /></span>
              </div>
            </div>
            <div className="mini-card rewards">
              <span className="mini-graphic"><Icon name="rewards" className="icon-svg" /></span>
              <div>
                <b>GOrewards</b>
                <em>6 pts</em>
              </div>
            </div>
          </section>

          <section className="hero-card-row">
            <div className="side-promo" />
            <div className="travel-banner">
              <span><em>Promo</em> Visa Travel Card</span>
              <h2>Wiser travels this spring with up to 5% cashback</h2>
              <p>Check it out</p>
              <b>GOfinance</b>
              <strong>VISA</strong>
            </div>
          </section>
          <div className="dots"><span /><span /><span /><b /></div>

          <section className="section-block">
            <h2>Recommended</h2>
            <div className="four-grid">
              {recommended.map((item) => (
                <FeatureIcon item={item} key={item.label} />
              ))}
            </div>
          </section>

          <section className="section-block favourites-block">
            <div className="title-row">
              <h2>My Favourites</h2>
              <button>Edit</button>
            </div>
            <div className="four-grid">
              {favourites.slice(0, 4).map((item) => (
                <FeatureIcon item={item} key={item.label} />
              ))}
            </div>
          </section>

          <section className="finance-strip">
            <div className="title-row">
              <div>
                <h2>GOfinance</h2>
                <p>Grow and protect your money easily.</p>
              </div>
              <button>Open ›</button>
            </div>
            <div className="finance-grid">
              {[
                ["Get more cash", "💰"],
                ["Compare insurances", "🛡️"],
                ["Get credit report", "📊"],
                ["Send money overseas", "💱"],
                ["Invest your money", "📈"],
                ["Spend globally", "💳"],
              ].map(([label, icon]) => (
                <div className="finance-card" key={label}>
                  <span>{label}</span>
                  <b>{icon}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="section-block promotions">
            <div className="title-row">
              <h2>Promotions</h2>
              <button>More ›</button>
            </div>
            <div className="promo-row">
              <div className="payday">
                <span>GOrewards</span>
                <b>PAYDAY FIESTA</b>
                <strong>Treat yourself with rewards today!</strong>
              </div>
              <div className="red-ad" />
            </div>
            <h3>Find Out More</h3>
          </section>
        </main>
      </div>
      <BottomNav onScan={onScan} />
    </div>
  );
}

function ScanScreen({
  onBack,
  onScanComplete,
}: {
  onBack: () => void;
  onScanComplete: (variant: PaymentVariant) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraState, setCameraState] = useState<
    "idle" | "ready" | "unsupported" | "denied" | "error"
  >("idle");

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let cancelled = false;
    const videoElement = videoRef.current;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState("unsupported");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = stream;
        if (videoElement) {
          videoElement.srcObject = stream;
          await videoElement.play();
        }

        setCameraState("ready");
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        setCameraState(name === "NotAllowedError" ? "denied" : "error");
      }
    }

    startCamera();

    return () => {
      cancelled = true;

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }

      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        onScanComplete("standard");
      }

      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        onScanComplete("travel");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScanComplete]);

  function openGallery() {
    fileInputRef.current?.click();
  }

  function handleGalleryPick(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      setCameraState("ready");
    }
  }

  return (
    <div className="phone scan-phone">
      <div className="scan-top">
        <StatusBar />
        <div className="scan-title">
          <button aria-label="Back" onClick={onBack}>‹</button>
          <h1>Scan</h1>
        </div>
      </div>
      <div className="upgrade-banner">
        <span>📣</span>
        <b>We’ve upgraded. Scan any QR now!</b>
      </div>
      <div className="camera-view">
        <video
          ref={videoRef}
          className="camera-feed"
          autoPlay
          muted
          playsInline
        />
        <div className="camera-overlay" />
        {cameraState !== "ready" ? (
          <div className="camera-fallback">
            <strong>
              {cameraState === "denied"
                ? "Camera access is blocked"
                : cameraState === "unsupported"
                  ? "Camera is not supported here"
                  : "Starting camera..."}
            </strong>
            <p>
              {cameraState === "denied"
                ? "Allow camera permission in the browser to scan with the rear camera."
                : cameraState === "unsupported"
                  ? "Open this page in a browser that supports media capture."
                  : "If this takes a moment, the browser may still be asking for permission."}
            </p>
          </div>
        ) : null}
        <div className="scan-line" />
        <div className="camera-controls">
          <input
            ref={fileInputRef}
            className="gallery-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleGalleryPick}
          />
          <button onClick={openGallery}><span>▧</span> Gallery</button>
          <button aria-label="Flashlight">♕</button>
        </div>
        <div className="mode-tabs">
          <button>Scan</button>
          <button>Pay</button>
          <button>Receive</button>
        </div>
      </div>
      <div className="scan-card">
        <p>Scan menus, arrival cards and links with one app.</p>
        <div className="country-bubbles">
          <span>🇨🇳</span>
          <span>🇹🇭</span>
          <span>🇮🇩</span>
        </div>
        <a>View all supported countries</a>
      </div>
      <div className="home-indicator" />
    </div>
  );
}

function PayScreen({
  variant,
  accountBalance,
  onBack,
  onConfirm,
}: {
  variant: PaymentVariant;
  accountBalance: number;
  onBack: () => void;
  onConfirm: (totalAmount: number) => void;
}) {
  const config = paymentConfigs[variant];
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>([]);
  const recommendations = config.recommendations;

  const selectedRecommendations = recommendations.filter((deal) =>
    selectedDealIds.includes(deal.id),
  );
  const addOnTotal = selectedRecommendations.reduce((total, deal) => {
    return total + Number(deal.promoPrice.replace(/[^\d.]/g, ""));
  }, 0);
  const totalAmount = config.merchantAmount + addOnTotal;
  const balanceAfterPayment = accountBalance - totalAmount;
  const hasEnoughBalance = balanceAfterPayment >= 0;
  const formattedAddOnTotal = `RM ${addOnTotal.toFixed(2)}`;
  const formattedTotalAmount = `RM ${totalAmount.toFixed(2)}`;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && hasEnoughBalance) {
        onConfirm(totalAmount);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasEnoughBalance, onConfirm, totalAmount]);

  return (
    <div
      className="phone flex min-h-full flex-col bg-white text-[#232428]"
      style={{ fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif" }}
    >
      <header
        className="relative h-[39px] shrink-0 bg-[#0b63bf] text-white shadow-[0_1px_3px_rgba(0,0,0,0.36)]"
      >
        <button
          type="button"
          aria-label="Back to scanner"
          onClick={onBack}
          className="absolute left-0 top-0 grid h-full w-[36px] place-items-center bg-transparent text-white"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[25px] w-[25px] fill-white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
          </svg>
        </button>
        <h1 className="pl-[60px] pt-[8px] text-[18px] font-semibold leading-none tracking-[-0.2px]">
          {variant === "travel" ? "Confirm Travel Payment" : "Confirm Payment"}
        </h1>
      </header>

      <section className="flex flex-1 flex-col overflow-y-auto px-[10px]">
        <div className="pt-[26px] text-center">
          <div
            className="mx-auto grid h-[47px] w-[47px] place-items-center rounded-[8px] bg-[#0c5ea8] shadow-[0_1px_2px_rgba(0,0,0,0.28)] ring-1 ring-[#d8d8d8]"
          >
            <div className="text-center font-black italic leading-[0.78] tracking-[-0.7px] text-white">
              {variant === "travel" ? (
                <>
                  <span className="block text-[12px]">Touch</span>
                  <span className="block text-[12px]">n GO</span>
                  <span className="mt-[3px] block rounded-[2px] bg-[#f6de1d] px-[2px] py-[1px] text-[8px] not-italic leading-none tracking-[-0.1px] text-[#188345]">
                    eWallet
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-[12px]">Touch</span>
                  <span className="block text-[12px]">n GO</span>
                  <span className="mt-[3px] block rounded-[2px] bg-[#f6de1d] px-[2px] py-[1px] text-[8px] not-italic leading-none tracking-[-0.1px] text-[#188345]">
                    eWallet
                  </span>
                </>
              )}
            </div>
          </div>
          <p className="mt-[8px] text-[14px] font-semibold leading-none text-[#a2a3a7]">
            {variant === "travel" ? "+60*****4821" : "+60*****1557"}
          </p>
          <div className="mt-[11px] grid grid-cols-[1fr_auto_1fr] items-center gap-[12px]">
            <span className="h-px bg-[#ececec]" />
            <p className="text-[28px] font-semibold leading-none tracking-[0.2px]">
              <span className="font-normal">RM</span> {config.merchantAmount.toFixed(2)}
            </p>
            <span className="h-px bg-[#ececec]" />
          </div>
        </div>

        <div className="mt-[28px] space-y-[20px]">
          <div className="grid grid-cols-[126px_1fr] items-start gap-2">
            <p className="text-[14px] font-semibold leading-none text-[#a8a9ad]">Payment Details</p>
            <p className="text-right text-[14px] font-bold leading-[1.42] text-[#323337]">
              {config.paymentDetails}
              <br />
              [Ref:
              <br />
              {config.refNo}
            </p>
          </div>

          <div className="grid grid-cols-[126px_1fr] items-start gap-2">
            <p className="text-[14px] font-semibold leading-none text-[#a8a9ad]">Merchant</p>
            <p className="text-right text-[14px] font-bold leading-none text-[#323337]">
              {config.merchantName}
            </p>
          </div>
        </div>

        <div className="mt-[22px] overflow-hidden rounded-[18px] bg-white shadow-[0_8px_22px_rgba(31,42,68,0.08)] ring-1 ring-[#e8ebf1]">
          <div className="flex items-center justify-between border-b border-[#eef0f4] px-3 py-[7px]">
            <div>
              <p className="text-[13px] font-bold leading-none text-[#323337]">
                {config.addOnTitle}
              </p>
            </div>
            <span className="rounded-full bg-[#edf5ff] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#066cff]">
              {selectedDealIds.length > 0 ? `${selectedDealIds.length} selected` : config.addOnBadge}
            </span>
          </div>

          <div className="space-y-1.5 bg-[#f7f8fb] p-2">
            {recommendations.map((deal, index) => {
              const isSelected = selectedDealIds.includes(deal.id);
              const fallbackGradients = [
                "linear-gradient(135deg,#4c231c 0%,#b87454 55%,#f6d9ac 100%)",
                "linear-gradient(135deg,#d8a96a 0%,#f6d7a8 52%,#fff7dc 100%)",
                "linear-gradient(135deg,#8a5c33 0%,#d4985d 52%,#f9cfa0 100%)",
              ];

              return (
                <button
                  key={deal.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedDealIds((prev) =>
                      prev.includes(deal.id)
                        ? prev.filter((id) => id !== deal.id)
                        : [...prev, deal.id],
                    )
                  }
                  className={`flex w-full items-center gap-2.5 overflow-hidden rounded-2xl bg-white p-2 text-left transition-all duration-150 ${
                    isSelected
                      ? "ring-2 ring-[#066cff] shadow-[0_8px_18px_rgba(40,83,148,0.2)]"
                      : "ring-1 ring-[#e4e7ee]"
                  }`}
                >
                  <div
                    className="relative h-[68px] w-[80px] shrink-0 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${deal.image}), ${fallbackGradients[index]}`,
                    }}
                  >
                    <span className="absolute left-1 top-1 rounded-md bg-[#ff6a28] px-1 py-[2px] text-[8px] font-bold leading-none text-white shadow-sm">
                      -{deal.discount}
                    </span>
                    <span className="absolute bottom-1 left-1 rounded-md bg-white/95 px-1 py-[2px] text-[8px] font-bold leading-none text-[#2d66d3] backdrop-blur-sm">
                      Add-on
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.25px] text-[#8f949d]">
                      {deal.addOnContext}
                    </p>
                    <p className="line-clamp-2 text-[12px] font-semibold leading-[1.18] text-[#2a2f37]">
                      {deal.name}
                    </p>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <p className="text-[14px] font-bold leading-none text-[#1e63d6]">
                        + {deal.promoPrice}
                      </p>
                      <p className="text-[10px] leading-none text-[#a0a4ad] line-through">
                        {deal.originalPrice}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-[#066cff] bg-[#066cff] text-white"
                        : "border-[#cfd6e4] bg-white text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path
                        d="m5.8 12.2 4 4 8.4-8.4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                      />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pb-[14px]">
          <div className="mb-[10px] rounded-[18px] bg-[#f8faff] px-4 py-2.5 shadow-[0_4px_14px_rgba(31,42,68,0.07)] ring-1 ring-[#e7edf8]">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#8f949d]">
              <span>Merchant amount</span>
              <span className="text-[#323337]">RM {config.merchantAmount.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[13px] font-semibold text-[#8f949d]">
              <span>Add-ons</span>
              <span className={addOnTotal > 0 ? "text-[#066cff]" : "text-[#a4a7ae]"}>
                {addOnTotal > 0 ? `+ ${formattedAddOnTotal}` : "RM 0.00"}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-[#e7edf8] pt-2.5">
              <span className="text-[14px] font-bold text-[#323337]">Total to pay</span>
              <span className="text-[22px] font-bold leading-none text-[#066cff]">
                {formattedTotalAmount}
              </span>
            </div>
          </div>
          <div className="mb-[10px] grid grid-cols-[26px_1fr] items-center gap-[8px] px-[2px]">
            <div className="grid h-[24px] w-[18px] place-items-center rounded-b-[10px] rounded-t-[4px] bg-[#31c26b] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]">
                <path
                  d="m6.1 12.4 3.3 3.3 8.1-8.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[11px] font-semibold leading-[1.15] text-[#a4a5aa]">
              {config.safeCopy}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (hasEnoughBalance) {
                onConfirm(totalAmount);
              }
            }}
            disabled={!hasEnoughBalance}
            className="h-[39px] w-full rounded-full bg-[#066cff] text-[15px] font-bold tracking-[1.6px] text-white shadow-[0_1px_3px_rgba(0,82,190,0.32)] disabled:bg-[#aab2c0] disabled:shadow-none"
          >
            {hasEnoughBalance ? `Pay ${formattedTotalAmount}` : "Insufficient Balance"}
          </button>
        </div>
      </section>
    </div>
  );
}

function ReceiptScreen({
  variant,
  totalAmount,
  accountBalance,
  onDone,
  onExploreTravel,
  onGrabTransport,
}: {
  variant: PaymentVariant;
  totalAmount: number;
  accountBalance: number;
  onDone: () => void;
  onExploreTravel: () => void;
  onGrabTransport: () => void;
}) {
  const config = paymentConfigs[variant];
  const receiptPromo =
    variant === "travel"
      ? {
          title: "Plan your next stop",
          description: "You're trip-ready. Unlock your next travel perk now.",
          buttonLabel: "Explore travel perks",
          cardClassName: "bg-[linear-gradient(135deg,#eef7ff_0%,#d6efff_48%,#fff2cb_100%)] ring-1 ring-[#cde6ff]",
          titleClassName: "text-[#0a4f8a]",
          descriptionClassName: "text-[#355f7d]",
          buttonClassName: "bg-[linear-gradient(135deg,#ff8f2f_0%,#ffb348_100%)] text-[#20324d] shadow-[0_8px_18px_rgba(255,143,47,0.28)]",
        }
      : {
          title: "Grab now",
          description: "We spotted the moment: time to book a Grab before you move on.",
          buttonLabel: "Grab now",
          cardClassName: "bg-[#ecf8ef]",
          titleClassName: "text-[#0f5c33]",
          descriptionClassName: "text-[#456b53]",
          buttonClassName: "bg-[#00b14f] text-white shadow-[0_2px_5px_rgba(0,177,79,0.28)]",
        };

  return (
    <div
      className="phone flex min-h-full flex-col bg-[#f2f2f3] px-5 pb-6 pt-[66px] text-[#1d1e22]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}
    >
      <div className="mb-[18px] flex justify-center">
        <div className="grid h-[62px] w-[62px] place-items-center rounded-full bg-[#14d860] shadow-[0_3px_9px_rgba(20,216,96,0.28)]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[31px] w-[31px]">
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

      <p className="text-center text-[39px] font-medium leading-none tracking-[-0.5px]">
        RM {totalAmount.toFixed(2)}
      </p>
      <p className="mt-[9px] text-center text-[13px] font-normal leading-none text-[#6f7074]">Paid</p>

      <div className="mx-auto mt-[13px] w-fit rounded-[7px] bg-[#e7eef9] px-3 py-1.5 text-[14px] font-semibold text-[#2473df]">
        + 7 points
      </div>

      <div className="mt-[46px] space-y-[17px]">
        <DetailRow label="Merchant" value={config.merchantName.toUpperCase()} />
        <DetailRow label="Payment Details" value="No.8" />
        <DetailRow
          label="Transaction Type"
          value="QR TNGD"
        />
        <DetailRow label="Date/Time" value="23/04/2026 12:28:43" />
        <DetailRow
          label="eWallet Ref No."
          value="2026042310110000010000TNGOW3MY171339686080792"
          wrap
        />
        <DetailRow label="Payment Method" value="eWallet Balance" />
        <DetailRow label="Balance After Payment" value={formatCurrency(accountBalance)} />
      </div>

      <div className={`mt-[27px] grid min-h-[104px] grid-cols-[132px_1fr] gap-3 overflow-hidden rounded-[14px] px-3 py-3 ${receiptPromo.cardClassName}`}>
        <div
          className={`relative h-[80px] overflow-hidden rounded-[12px] ${
            variant === "travel"
              ? "bg-[linear-gradient(135deg,#0f6ecb_0%,#34b5ff_52%,#ffd36c_100%)] shadow-[0_14px_24px_rgba(25,108,201,0.22)]"
              : "bg-[linear-gradient(135deg,#00b14f_0%,#18c964_42%,#a5f28f_100%)]"
          }`}
        >
          {variant === "travel" ? (
            <>
              <div className="absolute left-[-12px] top-[-18px] h-20 w-20 rounded-full bg-white/18" />
              <div className="absolute right-[-8px] top-[2px] h-14 w-14 rounded-full bg-[#ffe7a4]/40" />
              <div className="absolute left-3 top-3 h-8 w-12 rounded-full bg-white/20 blur-[1px]" />
              <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-[linear-gradient(180deg,rgba(16,71,128,0)_0%,rgba(16,71,128,0.34)_100%)]" />
              <div className="absolute left-3 bottom-3 h-[2px] w-[90px] bg-white/35" />
              <div className="absolute left-6 bottom-[18px] h-[14px] w-[22px] rounded-t-full border-t-2 border-white/75" />
              <div className="absolute left-[72px] top-[18px] h-[18px] w-[18px] rotate-45 rounded-[4px] border-2 border-white/80 border-l-0 border-b-0" />
              <div className="absolute right-3 top-3 grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-white/16 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-[2px]">
                <svg viewBox="0 0 48 48" className="h-[34px] w-[34px]" aria-hidden="true">
                  <path d="M8 32c5.8-7.8 11.6-11.8 17.2-11.8 5.5 0 10.7 3.8 15.8 11.8Z" fill="#ffd45f" />
                  <path d="M11 32h26" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M15 22.5c0-6 4.2-10.3 9.2-10.3 4.9 0 9.1 4.3 9.1 10.3-5.2 0-9.1 1.6-9.1 8.4 0-6.8-4-8.4-9.2-8.4Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
                  <path d="M24.2 12.2v17.6M31 16.8l-6.8 5.8M17.5 16.8l6.7 5.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
                </svg>
              </div>
            </>
          ) : (
            <>
              <div className="absolute left-[-10px] top-[-10px] h-16 w-16 rounded-full bg-white/14" />
              <div className="absolute right-[-6px] top-[8px] h-10 w-10 rounded-full bg-[#0b7f3b]/25" />
              <div className="absolute left-3 top-4 h-10 w-10 rounded-[10px] bg-[#ffffff]/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]" />
              <div className="absolute left-5 top-6 h-4 w-6 rounded-[4px] bg-[#ffcb3b]" />
              <div className="absolute left-4 top-16 h-2.5 w-12 rotate-[-8deg] rounded-full bg-white/85" />
              <div className="absolute left-14 top-12 h-5 w-5 rounded-full bg-[#ffcb3b]" />
              <div className="absolute right-2 top-3 grid h-[54px] w-[54px] place-items-center rounded-[16px] bg-white/14 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]">
                <svg viewBox="0 0 48 48" className="h-[34px] w-[34px]" aria-hidden="true">
                  <path d="M9 30.5h30l-2.1-10.2a2.4 2.4 0 0 0-2.3-1.9H13.4a2.4 2.4 0 0 0-2.3 1.9L9 30.5Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
                  <path d="M15 18.4c.6-4.4 4.4-7.8 9-7.8s8.4 3.4 9 7.8" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M16.5 31v4.5M31.5 31v4.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="17.8" cy="36.2" r="2.2" fill="currentColor" />
                  <circle cx="30.2" cy="36.2" r="2.2" fill="currentColor" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
            </>
          )}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className={`text-[15px] font-bold leading-[1.12] ${receiptPromo.titleClassName}`}>{receiptPromo.title}</p>
          <p className={`mt-1 text-[13px] leading-[1.18] ${receiptPromo.descriptionClassName}`}>
            {receiptPromo.description}
          </p>
          <button
            type="button"
            onClick={variant === "travel" ? onExploreTravel : onGrabTransport}
            className={`mt-2.5 w-full rounded-full py-1.5 text-[13px] font-semibold ${receiptPromo.buttonClassName}`}
          >
            {receiptPromo.buttonLabel}
          </button>
        </div>
      </div>

      <button type="button" onClick={onDone} className="mt-auto w-full rounded-full bg-[#0a66e8] py-[13px] text-[17px] font-medium text-white shadow-[0_2px_4px_rgba(10,102,232,0.2)]">
        Done
      </button>
    </div>
  );
}

const transportHistory = [
  {
    title: "Pavilion Kuala Lumpur",
    address: "168, Bukit Bintang Rd, Bukit Bintang, 55100 Kuala Lumpur...",
  },
  {
    title: "Mid Valley Megamall",
    address: "The Gardens South Tower, Lingkaran Syed Putra, Mid Valley City...",
  },
  {
    title: "KL Sentral Main Entrance",
    address: "Jalan Stesen Sentral, KL Sentral, Bandar Kual...",
  },
] as const;

const rideNeeds = [
  { title: "Advance\nBooking", icon: "calendar", tone: "blue" },
  { title: "6 seater car", icon: "van", tone: "lime" },
  { title: "Group Ride", icon: "group", tone: "yellow" },
  { title: "Book for\nfamily", icon: "family", tone: "cream" },
  { title: "Rent by\nhour", icon: "driver", tone: "peach" },
  { title: "Airport", icon: "plane", tone: "sky" },
] as const;

function TransportStatusBar() {
  return (
    <div className="transport-status">
      <div>
        <span>6:56</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 4 14.3 19.2c-.2.6-1 .7-1.4.1l-2.8-4-4.3-2.9c-.5-.4-.5-1.1.1-1.3L20 4Z" fill="currentColor" />
        </svg>
      </div>
      <div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 8.3 12 3l9 5.3M6.5 10.5a7.8 7.8 0 0 1 11 0M9.2 13.5a4 4 0 0 1 5.6 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className="transport-battery">58</span>
      </div>
    </div>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="m4.5 6.8 6-2.6 7 2.8 6-2.7v17l-6 2.7-7-2.8-6 2.6Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M10.5 4.2v17M17.5 7v17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TransportPin() {
  return (
    <span className="transport-pin" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 21c4.6-5.7 6.8-9.4 6.8-12.2A6.8 6.8 0 1 0 5.2 8.8C5.2 11.6 7.4 15.3 12 21Z" fill="currentColor" />
        <circle cx="12" cy="8.8" r="2.5" fill="white" />
      </svg>
    </span>
  );
}

function GroupRideArt() {
  return (
    <div className="group-ride-art" aria-hidden="true">
      <span className="bubble one" />
      <span className="bubble two" />
      <span className="bubble three" />
      <span className="passenger a" />
      <span className="passenger b" />
      <span className="passenger c" />
      <span className="passenger d" />
      <span className="car-body" />
      <span className="wheel left" />
      <span className="wheel right" />
    </div>
  );
}

function FlightBannerArt() {
  return (
    <div className="flight-banner-art" aria-hidden="true">
      <span className="cloud big" />
      <span className="cloud small" />
      <span className="thought">✈</span>
      <span className="head" />
      <span className="hair" />
      <span className="body" />
      <span className="hand" />
    </div>
  );
}

function RideTileIcon({ icon }: { icon: (typeof rideNeeds)[number]["icon"] }) {
  return (
    <span className={`ride-tile-icon ${icon}`} aria-hidden="true">
      {icon === "calendar" ? (
        <>
          <i />
          <b />
        </>
      ) : null}
      {icon === "van" ? (
        <>
          <i />
          <b />
        </>
      ) : null}
      {icon === "group" ? <GroupRideArt /> : null}
      {icon === "family" ? (
        <>
          <i />
          <b />
          <em />
        </>
      ) : null}
      {icon === "driver" ? (
        <>
          <i />
          <b />
        </>
      ) : null}
      {icon === "plane" ? <strong>✈</strong> : null}
    </span>
  );
}

function TransportScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="phone transport-phone">
      <div className="transport-scroll">
        <header className="transport-hero">
          <TransportStatusBar />
          <div className="transport-title-row">
            <button type="button" aria-label="Back" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1>Transport</h1>
            <button type="button" className="transport-map">
              <MapIcon />
              <span>Map</span>
            </button>
          </div>
          <p>Save more when you travel<br />with friends.</p>
          <button type="button" className="group-ride-link">
            <span>Start Group Ride now</span>
            <b>→</b>
          </button>
          <GroupRideArt />
        </header>

        <section className="where-card" aria-label="Destination search">
          <div className="where-main">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21c4.6-5.7 6.8-9.4 6.8-12.2A6.8 6.8 0 1 0 5.2 8.8C5.2 11.6 7.4 15.3 12 21Z" fill="currentColor" />
              <circle cx="12" cy="8.8" r="2.5" fill="white" />
            </svg>
            <span>Where to?</span>
          </div>
          <button type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 3v4M17 3v4M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Later</span>
          </button>
        </section>

        <main className="transport-content">
          <section className="transport-history">
            {transportHistory.map((item) => (
              <button type="button" key={item.title}>
                <TransportPin />
                <span>
                  <b>{item.title}</b>
                  <em>{item.address}</em>
                </span>
              </button>
            ))}
          </section>

          <section className="flight-sync-card">
            <div>
              <h2>Worried about missing a<br />flight? We got you.</h2>
              <button type="button">Sync calendar</button>
            </div>
            <FlightBannerArt />
          </section>

          <section className="ride-needs">
            <h2>Rides for your every need</h2>
            <div>
              {rideNeeds.map((item) => (
                <button type="button" className={`ride-tile ${item.tone}`} key={item.title}>
                  <span>{item.title}</span>
                  <RideTileIcon icon={item.icon} />
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
      <div className="transport-home-indicator" />
    </div>
  );
}

const bookingItems = [
  { label: "Flight", icon: "plane" },
  { label: "Hotel", icon: "hotel" },
  { label: "Train", icon: "train" },
  { label: "Attraction", icon: "attraction" },
] as const;

const perkTiles = [
  { title: "Vouchers", copy: "Save money on travel", tone: "blue", emoji: "🎟️" },
  { title: "Currency", copy: "Check before spending", tone: "cream", emoji: "💱" },
  { title: "Itinerary", copy: "Plan your trip with AI", tone: "mint", emoji: "🧳" },
] as const;

const bookingOptions = [
  { eyebrow: "Affordable bus rides", title: "Easybook", action: "Book now", tone: "purple" },
  { eyebrow: "20 mins", title: "Fast airport transit", action: "Book now", tone: "route" },
  { eyebrow: "Save on flight tickets", title: "Cheaper flight tickets", action: "Buy ticket", tone: "orange" },
  { eyebrow: "Book hotels across Malaysia", title: "Domestic hotel bookings", action: "View options", tone: "green" },
] as const;

const exploreItems = [
  { label: "Agoda", mark: "agoda" },
  { label: "Booking", mark: "booking" },
  { label: "Klook", mark: "klook" },
  { label: "Trip.com", mark: "trip" },
  { label: "Traveloka", mark: "traveloka" },
] as const;

function TravelIcon({ icon }: { icon: (typeof bookingItems)[number]["icon"] }) {
  if (icon === "plane") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="m6 26 17-5 11-14c1.5-2 4.9-.5 4.1 1.9l-5.2 14.5 8 6.7c1.1.9.3 2.8-1.1 2.6L29.2 31l-8.6 10.4c-1 1.2-3 .3-2.8-1.2l1-10.7-9.9 1.1C6.3 31 4.7 26.8 6 26Z" fill="#ffdf52" stroke="#0870d9" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M20 29.5 32 16" fill="none" stroke="#0870d9" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "hotel") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="13" y="9" width="22" height="31" rx="2" fill="#ffe269" stroke="#0870d9" strokeWidth="2.8" />
        <path d="M17 15h5M26 15h5M17 22h5M26 22h5M17 29h5M26 29h5M12 40h24" stroke="#0870d9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 5h12" stroke="#ff7a2f" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "train") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="15" y="8" width="18" height="27" rx="4" fill="#ffdf52" stroke="#0870d9" strokeWidth="2.8" />
        <path d="M18 17h12M18 24h12M20 40l4-5 4 5M18 4h12" stroke="#0870d9" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="30" r="1.8" fill="#0870d9" />
        <circle cx="28" cy="30" r="1.8" fill="#0870d9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 21c2.8-7.1 8.1-10.7 16-10.7S37.2 13.9 40 21c-6.6-.4-11.9 2.4-16 8.2C19.9 23.4 14.6 20.6 8 21Z" fill="#ffdf52" stroke="#0870d9" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M24 10.5v29M14.8 21c1.2-5.8 4.3-9.2 9.2-10.5M33.2 21c-1.2-5.8-4.3-9.2-9.2-10.5" stroke="#0870d9" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 39c3.2 0 4.7-1.3 4.7-4" fill="none" stroke="#0870d9" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function TravelSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`travel-section ${className}`}>
      <div className="travel-section-title">
        <h2>{title}</h2>
        <span>⌃</span>
      </div>
      {children}
    </section>
  );
}

function TravelPerksScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="phone travel-phone">
      <div className="travel-topbar">
        <StatusBar battery="64" />
        <button type="button" aria-label="Back" onClick={onBack}>‹</button>
      </div>

      <div className="travel-scroll">
        <header className="travel-hero">
          <div>
            <h1>Travel</h1>
            <p>Everything you need for your trip</p>
          </div>
          <div className="travel-island" aria-hidden="true">
            <span />
            <b />
          </div>
        </header>

        <section className="voucher-card">
          <p>Claimed travel vouchers can be found in <b>My Rewards</b></p>
          <div className="voucher-steps">
            <span>Homepage</span>
            <i>›</i>
            <span>GOrewards</span>
            <i>›</i>
            <span>My Rewards</span>
          </div>
        </section>

        <TravelSection title="Book your trip" className="book-trip">
          <div className="booking-row">
            {bookingItems.map((item) => (
              <button type="button" key={item.label}>
                <span><TravelIcon icon={item.icon} /></span>
                <b>{item.label}</b>
              </button>
            ))}
          </div>

          <div className="cashback-banner">
            <div className="brand-row">
              <b>支付宝 Alipay+</b>
              <span>PromptPay</span>
              <strong>QRIS</strong>
              <em>NETS</em>
            </div>
            <h3>Enjoy <mark>40% cashback</mark><br />when you <mark>Scan & Pay</mark><br />in 50+ countries</h3>
            <button type="button">Learn more</button>
            <div className="scan-orbit">
              <span>Scan</span>
            </div>
          </div>
          <div className="travel-dot" />

          <div className="perk-row">
            {perkTiles.map((tile) => (
              <button type="button" className={`perk-tile ${tile.tone}`} key={tile.title}>
                <b>{tile.title}</b>
                <span>{tile.copy}</span>
                <i>{tile.emoji}</i>
              </button>
            ))}
          </div>
        </TravelSection>

        <TravelSection title="More booking options">
          <div className="booking-options-grid">
            {bookingOptions.map((item) => (
              <button type="button" className={`booking-option ${item.tone}`} key={item.title}>
                <div>
                  <span>{item.eyebrow}</span>
                </div>
                <p>{item.title}</p>
                <b>{item.action}</b>
              </button>
            ))}
          </div>
        </TravelSection>

        <TravelSection title="Explore more">
          <div className="explore-row">
            {exploreItems.map((item) => (
              <button type="button" key={item.label}>
                <span className={item.mark}>{item.label.slice(0, 1)}</span>
                <b>{item.label}</b>
              </button>
            ))}
          </div>
        </TravelSection>

        <TravelSection title="Fun-filled trip ideas" className="trip-ideas">
          <div className="idea-grid">
            <div />
            <div />
          </div>
        </TravelSection>
      </div>
      <div className="travel-home-indicator" />
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
      <p className="text-[14px] leading-[1.2] text-[#8b8d92]">{label}</p>
      <p className={`text-right font-medium leading-[1.2] ${wrap ? "break-all text-[13px]" : "text-[14px]"}`}>
        {prefix}
        {value}
      </p>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"home" | "scan" | "pay" | "receipt" | "travel" | "transport">("home");
  const [paymentVariant, setPaymentVariant] = useState<PaymentVariant>("standard");
  const [accountBalance, setAccountBalance] = useState<number>(INITIAL_ACCOUNT_BALANCE);
  const [receiptTotalAmount, setReceiptTotalAmount] = useState<number>(paymentConfigs.standard.merchantAmount);
  const [receiptBalanceAmount, setReceiptBalanceAmount] = useState<number>(INITIAL_ACCOUNT_BALANCE);

  return (
    <main className="app-stage">
      {mode === "home" ? (
        <HomeScreen accountBalance={accountBalance} onScan={() => setMode("scan")} />
      ) : null}
      {mode === "scan" ? (
        <ScanScreen
          onBack={() => setMode("home")}
          onScanComplete={(variant) => {
            setPaymentVariant(variant);
            setMode("pay");
          }}
        />
      ) : null}
      {mode === "pay" ? (
        <PayScreen
          variant={paymentVariant}
          accountBalance={accountBalance}
          onBack={() => setMode("scan")}
          onConfirm={(totalAmount) => {
            const nextBalance = accountBalance - totalAmount;
            if (nextBalance < 0) {
              return;
            }

            setAccountBalance(nextBalance);
            setReceiptTotalAmount(totalAmount);
            setReceiptBalanceAmount(nextBalance);
            setMode("receipt");
          }}
        />
      ) : null}
      {mode === "receipt" ? (
        <ReceiptScreen
          variant={paymentVariant}
          totalAmount={receiptTotalAmount}
          accountBalance={receiptBalanceAmount}
          onDone={() => setMode("home")}
          onExploreTravel={() => setMode("travel")}
          onGrabTransport={() => setMode("transport")}
        />
      ) : null}
      {mode === "travel" ? (
        <TravelPerksScreen onBack={() => setMode("receipt")} />
      ) : null}
      {mode === "transport" ? (
        <TransportScreen onBack={() => setMode("receipt")} />
      ) : null}
    </main>
  );
}
