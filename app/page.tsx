"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const favourites = [
  { icon: "🏃‍♂️", label: "Goal City" },
  { icon: "●", label: "Apple Zone", apple: true },
  { icon: "ASNB", label: "ASNB", logo: true },
  { icon: "▣", label: "MY Prepaid", prepaid: true },
  { icon: "▤", label: "My Business", outlined: true },
  { icon: "🚙", label: "Parking" },
  { icon: "🪐", label: "Travel+" },
  { icon: "•••", label: "More", circle: true },
];

const recommended = [
  { icon: "▯", label: "CardMatch", cardmatch: true },
  { icon: "25", label: "Payday" },
  { icon: "🏖️", label: "Travel" },
  { icon: "Taobao", label: "Taobao", badge: true },
];

function StatusBar({ battery = "44" }: { battery?: string }) {
  return (
    <div className="status-bar">
      <span>3:39</span>
      <span className="location-arrow">▲</span>
      <div className="status-icons">
        <span>✈</span>
        <span>⌁</span>
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
        <span className="glass">⌕</span>
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
        {item.icon}
      </div>
      <div className="feature-label">{item.label}</div>
    </div>
  );
}

function BottomNav({ onScan }: { onScan: () => void }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-item active">
        <span>⌂</span>
        <b>Home</b>
      </div>
      <div className="nav-item">
        <span>🛒</span>
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
        <span>$</span>
        <b>GOfinance</b>
      </div>
      <div className="nav-item">
        <span>⌖</span>
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
          <span className="shield">♢</span>
          <strong>RM 19.92</strong>
          <span className="eye">◉</span>
        </div>
        <div className="asset-link">View asset details ›</div>
        <div className="hero-actions">
          <button>+&nbsp; Add money</button>
          <button>Transactions ›</button>
        </div>
      </div>
      <div className="quick-panel" aria-label="Quick actions">
        {["Apply", "Cash flow", "Transfer", "Cards"].map((label, index) => (
          <div className="quick-action" key={label}>
            <span>{["▣", "◔", "✈", "▭"][index]}</span>
            <b>{label}</b>
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
              <span>🌱</span>
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
                <span>⛽</span>
              </div>
            </div>
            <div className="mini-card rewards">
              <span>🎁</span>
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
