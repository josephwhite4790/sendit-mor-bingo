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
            MOR Bingo<span
