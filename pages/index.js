import React, { useState, useEffect, useRef, useCallback } from "react";
import { Download, Shuffle, RotateCcw, Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { PHRASES } from "../data/phrases";

// FREE SPACE copy — change here if you want different humor.
const FREE_SPACE_LINE_1 = "FREE";
const FREE_SPACE_LINE_2 = '"Not our fault"';

// FOOTER copy — update here.
const FOOTER_TEXT = "Built for Medical Directors who have heard it all.";

// Sendit brand palette
const BRAND = {
  nero: "#171717",
  nordic: "#113033",
  lagoon: "#026B75",
  eastern: "#0493A1",
  smoke: "#F2F2F2",
  white: "#FFFFFF",
};

// ---------------------------------------------------------------------------
// Card generation — Fisher-Yates shuffle, no dupes, FREE in the middle.
// ---------------------------------------------------------------------------
function generateCard() {
  const pool = [...PHRASES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picks = pool.slice(0, 24);
  const card = [];
  let idx = 0;
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      card.push({ text: null, isFree: true });
    } else {
      card.push({ text: picks[idx++], isFree: false });
    }
  }
  return card;
}

export default function SenditMORBingo() {
  const [card, setCard] = useState(() => generateCard());
  const [marked, setMarked] = useState(() => {
    const s = new Set();
    s.add(12); // free space pre-marked
    return s;
  });
  const [conferenceMode, setConferenceMode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Load html-to-image from CDN once
  useEffect(() => {
    if (window.htmlToImage) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const newCard = useCallback(() => {
    setCard(generateCard());
    const s = new Set();
    s.add(12);
    setMarked(s);
  }, []);

  const resetMarks = useCallback(() => {
    const s = new Set();
    s.add(12);
    setMarked(s);
  }, []);

  const toggleSquare = (i) => {
    if (i === 12) return;
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const exportPNG = async (copyMode = false) => {
    if (!window.htmlToImage || !cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await window.htmlToImage.toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: BRAND.nero,
        cacheBust: true,
      });
      if (copyMode) {
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } else {
        const link = document.createElement("a");
        link.download = `sendit-mor-bingo-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full font-sans antialiased"
      style={{
        backgroundColor: BRAND.nero,
        backgroundImage: `radial-gradient(circle at 15% 0%, ${BRAND.nordic} 0%, transparent 55%), radial-gradient(circle at 85% 100%, rgba(4,147,161,0.18) 0%, transparent 50%)`,
        color: BRAND.smoke,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header — update logo treatment here */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: BRAND.eastern, boxShadow: `0 0 12px ${BRAND.eastern}` }}
            />
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: BRAND.eastern }}
            >
              Sendit
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-3">
            MOR Bingo<span style={{ color: BRAND.eastern }}>.</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-1.5" style={{ color: BRAND.smoke }}>
            Because you know they're going to say it.
          </p>
          <p className="text-sm sm:text-base" style={{ color: "#8a9a9c" }}>
            Generate a bingo card for your next operations meeting.
          </p>
        </header>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={newCard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: BRAND.eastern,
              color: BRAND.nero,
              boxShadow: `0 4px 20px -4px ${BRAND.eastern}80`,
            }}
          >
            <Shuffle size={16} strokeWidth={2.5} />
            New Card
          </button>
          <button
            onClick={() => exportPNG(false)}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: "transparent",
              color: BRAND.smoke,
              border: `1.5px solid ${BRAND.lagoon}`,
            }}
          >
            <Download size={16} strokeWidth={2.5} />
            Download PNG
          </button>
          <button
            onClick={() => exportPNG(true)}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: "transparent",
              color: BRAND.smoke,
              border: `1.5px solid ${BRAND.lagoon}`,
            }}
          >
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
            {copied ? "Copied" : "Copy Image"}
          </button>
          <button
            onClick={resetMarks}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "transparent",
              color: "#8a9a9c",
              border: `1.5px solid #2a3a3c`,
            }}
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            Reset
          </button>
          <button
            onClick={() => setConferenceMode((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ml-auto"
            style={{
              backgroundColor: "transparent",
              color: "#8a9a9c",
              border: `1.5px solid #2a3a3c`,
            }}
          >
            {conferenceMode ? <Minimize2 size={16} strokeWidth={2.5} /> : <Maximize2 size={16} strokeWidth={2.5} />}
            {conferenceMode ? "Exit" : "Conference"}
          </button>
        </div>

        {/* Bingo card */}
        <div
          ref={cardRef}
          className={`relative rounded-2xl ${conferenceMode ? "p-4 sm:p-6" : "p-5 sm:p-7"}`}
          style={{
            backgroundColor: BRAND.nordic,
            border: `1px solid #1f4346`,
            boxShadow: `0 20px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-baseline gap-2">
              <span
                className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: BRAND.eastern }}
              >
                Sendit
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase" style={{ color: "#5a6a6c" }}>
                / MOR Bingo
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#5a6a6c" }}>
              ED OPS · v1
            </span>
          </div>

          {/* 5x5 grid */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {card.map((square, i) => {
              const isMarked = marked.has(i);
              const isFree = square.isFree;
              return (
                <button
                  key={i}
                  onClick={() => toggleSquare(i)}
                  className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-center transition-all duration-200 ${
                    conferenceMode ? "p-1 sm:p-2" : "p-1 sm:p-1.5"
                  } ${!isFree && "active:scale-95 cursor-pointer"}`}
                  style={{
                    backgroundColor: isFree
                      ? BRAND.eastern
                      : isMarked
                      ? BRAND.lagoon
                      : "#0a1f21",
                    border: isFree
                      ? `1px solid ${BRAND.eastern}`
                      : isMarked
                      ? `1px solid ${BRAND.eastern}`
                      : `1px solid #1a3033`,
                    boxShadow: isMarked && !isFree ? `inset 0 0 0 1px ${BRAND.eastern}40` : "none",
                  }}
                >
                  {isFree ? (
                    <div className="flex flex-col items-center justify-center leading-tight">
                      <span
                        className={`font-black ${conferenceMode ? "text-sm sm:text-lg" : "text-sm sm:text-base"}`}
                        style={{ color: BRAND.nero }}
                      >
                        {FREE_SPACE_LINE_1}
                      </span>
                      <span
                        className={`font-semibold italic mt-0.5 ${conferenceMode ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[11px]"}`}
                        style={{ color: BRAND.nero }}
                      >
                        {FREE_SPACE_LINE_2}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`font-semibold leading-[1.1] break-words hyphens-auto ${
                        conferenceMode
                          ? "text-xs sm:text-base"
                          : "text-[11px] sm:text-sm"
                      }`}
                      style={{
                        color: isMarked ? BRAND.white : BRAND.smoke,
                        textDecoration: isMarked ? "line-through" : "none",
                        textDecorationThickness: "1.5px",
                      }}
                    >
                      {square.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Card footer mark */}
          <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 border-t" style={{ borderColor: "#1f4346" }}>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase" style={{ color: "#5a6a6c" }}>
              Tap to mark · Tap again to clear
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono" style={{ color: BRAND.eastern }}>
              senditgigs.com
            </span>
          </div>
        </div>

        {/* Footer — update copy here */}
        <footer className="mt-8 text-center">
          <p className="text-xs sm:text-sm" style={{ color: "#5a6a6c" }}>
            {FOOTER_TEXT}
          </p>
        </footer>
      </div>
    </div>
  );
}
