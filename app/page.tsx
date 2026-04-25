"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

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

function WalletHero() {
  return (
    <section className="wallet-shell">
      <div className="wallet-hero">
        <StatusBar battery="45" />
        <TopSearch />
        <div className="balance-row">
          <span className="shield"><Icon name="shield" className="icon-svg" /></span>
          <strong>RM 19.92</strong>
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

function HomeScreen({ onScan }: { onScan: () => void }) {
  return (
    <div className="phone home-phone">
      <div className="home-scroll">
        <WalletHero />
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

function ScanScreen({ onBack }: { onBack: () => void }) {
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

export default function Home() {
  const [mode, setMode] = useState<"home" | "scan">("home");

  return (
    <main className="app-stage">
      {mode === "home" ? (
        <HomeScreen onScan={() => setMode("scan")} />
      ) : (
        <ScanScreen onBack={() => setMode("home")} />
      )}
    </main>
  );
}
