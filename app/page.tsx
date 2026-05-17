"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  AlertCircle,
  Scale,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  Database,
  Info
} from "lucide-react";
import Link from "next/link";

// --- UTILS ---
gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

// --- INTERACTIVE STOCK MARKET TRACKER MODULE ---
const generateMockData = (basePrice: number, volatility: number, points = 50) => {
  let currentPrice = basePrice;
  const data = [];
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    data.push(currentPrice);
  }
  return data;
};

const StockMarketTracker = () => {
  const [activePlatform, setActivePlatform] = useState<"Zomato" | "Zepto">("Zomato");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoverData, setHoverData] = useState<{ x: number; y: number; value: number; index: number } | null>(null);

  const platforms = {
    Zomato: {
      name: "ZOMATO CART MARKUP (ACME)",
      basePrice: 440364.20,
      volatility: 500,
      percentage: "0.48%"
    },
    Zepto: {
      name: "ZEPTO RAIN SURGE (ACME)",
      basePrice: 890212.50,
      volatility: 1200,
      percentage: "1.12%"
    }
  };

  const currentSettings = platforms[activePlatform];
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    setChartData(generateMockData(currentSettings.basePrice, currentSettings.volatility));
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = newData[newData.length - 1];
        newData.push(lastVal + (Math.random() - 0.5) * currentSettings.volatility);
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activePlatform, currentSettings.basePrice, currentSettings.volatility]);

  const svgRef = useRef<SVGSVGElement>(null);
  const chartHeight = 200;
  const chartWidth = 500;

  const { min, max, points } = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 100, points: "" };
    const minVal = Math.min(...chartData);
    const maxVal = Math.max(...chartData);
    const padding = (maxVal - minVal) * 0.1;
    const paddedMin = minVal - padding;
    const paddedMax = maxVal + padding;
    const pts = chartData.map((val, i) => {
      const x = (i / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((val - paddedMin) / (paddedMax - paddedMin)) * chartHeight;
      return `${x},${y}`;
    }).join(" L ");
    return { min: paddedMin, max: paddedMax, points: `M ${pts}` };
  }, [chartData]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartData.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const scaleX = chartWidth / rect.width;
    const svgX = xPos * scaleX;
    const segmentWidth = chartWidth / (chartData.length - 1);
    const index = Math.round(svgX / segmentWidth);
    const safeIndex = Math.max(0, Math.min(index, chartData.length - 1));
    const val = chartData[safeIndex];
    const y = chartHeight - ((val - min) / (max - min)) * chartHeight;
    const x = (safeIndex / (chartData.length - 1)) * chartWidth;
    setHoverData({ x, y, value: val, index: safeIndex });
  };

  return (
    <div className="w-full bg-[#FDFFFF] border-2 border-[#0C120C]/10 rounded-[24px] p-6 shadow-2xl shadow-black/5 font-sans relative overflow-visible">
      <div className="flex justify-between items-center mb-6 relative">
        <div className="flex items-center gap-3 text-[#0C120C]">
          <BarChart3 className="w-6 h-6 stroke-[2]" />
          <span className="font-bold text-lg tracking-tight">Stock Market Tracker</span>
          <div className="relative group cursor-pointer">
            <Info className="w-4 h-4 text-[#0C120C]/40 hover:text-[#0C120C] transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-[#0C120C] text-[#FDFFFF] text-xs font-bold p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-[#FDFFFF]/20">
              Tracks live algorithmic Drip Pricing markups across major platforms based on crowdsourced data.
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#0C120C] text-[#FDFFFF] px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm hover:bg-[#0C120C]/80 transition-colors border border-[#0C120C]"
          >
            {activePlatform} Fees <ChevronDown className={cx("w-4 h-4 text-[#FDFFFF]/60 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#0C120C] border border-[#FDFFFF]/20 rounded-xl shadow-2xl overflow-hidden z-50">
              <button
                onClick={() => { setActivePlatform("Zomato"); setIsDropdownOpen(false); }}
                className="w-full text-left px-4 py-3 text-[#FDFFFF] hover:bg-[#FDFFFF]/10 text-sm font-medium transition-colors"
              >
                Zomato Cart Markup
              </button>
              <button
                onClick={() => { setActivePlatform("Zepto"); setIsDropdownOpen(false); }}
                className="w-full text-left px-4 py-3 text-[#FDFFFF] hover:bg-[#FDFFFF]/10 text-sm font-medium border-t border-[#FDFFFF]/10 transition-colors"
              >
                Zepto Rain Surge
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex bg-[#0C120C] rounded-xl p-1.5 mb-8 shadow-inner">
        {['1D', '1W', '1M'].map(tab => (
          <button key={tab} className="flex-1 text-[#FDFFFF]/60 text-sm py-1.5 font-bold hover:text-[#FDFFFF] transition-colors">
            {tab}
          </button>
        ))}
        <button className="flex-1 bg-[#FF4242] text-[#FDFFFF] rounded-lg text-sm py-1.5 font-bold shadow-md shadow-[#FF4242]/20">
          3M
        </button>
        <button className="flex-1 text-[#FDFFFF]/60 text-sm py-1.5 font-bold hover:text-[#FDFFFF] transition-colors">
          1Y
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[2.75rem] leading-none font-black tracking-tighter text-[#0C120C]">
            ₹{(chartData[chartData.length - 1] || currentSettings.basePrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="bg-[#52B788]/20 text-[#42956E] px-2.5 py-1 rounded-md flex items-center gap-1 text-sm font-bold border border-[#52B788]/20">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" /> {currentSettings.percentage}
          </span>
        </div>
        <div className="text-sm font-bold text-[#0C120C]/60 uppercase tracking-wide">
          {currentSettings.name}
        </div>
      </div>

      <div className="relative h-[200px] w-full mb-10 group cursor-crosshair">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-t border-[#0C120C]/10 w-full h-0"></div>
          ))}
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full absolute inset-0 z-10 overflow-visible"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverData(null)}
        >
          <path d={points} fill="none" stroke="#FF4242" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {hoverData && (
            <g>
              <line x1={hoverData.x} y1={0} x2={hoverData.x} y2={chartHeight} stroke="#3B82F6" strokeWidth="1.5" className="opacity-70" />
              <circle cx={hoverData.x} cy={hoverData.y} r="4" fill="#FDFFFF" stroke="#FF4242" strokeWidth="2.5" />
            </g>
          )}
        </svg>
        {hoverData && (
          <div
            className="absolute z-20 bg-[#0C120C] text-[#FDFFFF] text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${(hoverData.x / chartWidth) * 100}%`, top: `${(hoverData.y / chartHeight) * 100}%`, marginTop: '15px' }}
          >
            Price {(hoverData.value).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
          </div>
        )}
      </div>

      <div className="bg-[#0C120C] rounded-xl p-4 flex justify-around relative border border-[#0C120C] overflow-hidden shadow-lg">
        <div className="text-center z-10 flex gap-2 items-baseline">
          <span className="text-[#FDFFFF]/60 text-sm font-medium">Highest</span>
          <span className="text-[#FDFFFF] font-bold text-lg tracking-tight">
            {chartData.length ? Math.max(...chartData).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "0.000"}
          </span>
        </div>
        <div className="w-[1px] bg-[#FDFFFF]/10 my-1"></div>
        <div className="text-center z-10 flex gap-2 items-baseline">
          <span className="text-[#FDFFFF]/60 text-sm font-medium">Lowest</span>
          <span className="text-[#FDFFFF] font-bold text-lg tracking-tight">
            {chartData.length ? Math.min(...chartData).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "0.000"}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- FLOW ART COMPONENTS ---
export const FlowSection: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <section
    data-flow-section
    className={cx("relative min-h-screen w-full overflow-hidden border-b border-[#0C120C]/10", className)}
  >
    <div
      data-flow-inner
      className={cx("flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]", "will-change-transform")}
      style={{ transformOrigin: "bottom left" }}
    >
      {children}
    </div>
  </section>
);

const FlowArt: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const sections = Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"));
    if (sections.length === 0) return;
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, i) => {
      gsap.set(section, { zIndex: i + 1 });
      const inner = section.querySelector<HTMLElement>(".flow-art-container");
      if (!inner) return;

      if (i > 0) {
        gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" });
        const tween = gsap.to(inner, {
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 25%",
            scrub: true,
          },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }

      if (i < sections.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "bottom bottom",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
          }),
        );
      }
    });
    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.kill());
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className={cx("w-full overflow-x-hidden font-sans", className)}>
      {children}
    </main>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function LandingPage() {
  return (
    <div className="relative w-full bg-[#0C120C]">
      <FlowArt>
        {/* SECTION 1: THE ILLUSION (#0C120C Black) */}
        <FlowSection className="bg-[#0C120C] text-[#FDFFFF]">
          <div className="flex justify-between items-start w-full">
            <div className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#FDFFFF]/60">
              01 — The Illusion
            </div>
          </div>
          <div className="mt-auto mb-auto">
            <h1 className="text-[15vw] leading-[0.8] font-black tracking-tighter uppercase mb-6 text-[#FDFFFF]">
              Stop<br />The Drip.
            </h1>
            <p className="max-w-2xl text-lg md:text-2xl text-[#FDFFFF]/70 font-medium leading-relaxed">
              What you see is rarely what you pay. Platforms use algorithmic
              "Drip Pricing" to artificially inflate your cart at checkout.
              Expose the pattern.
            </p>
          </div>
          <div className="flex justify-between items-end pb-8">
            <div className="text-[#FDFFFF]/40 text-sm font-medium tracking-widest uppercase">
              Consumer Defense Suite • 2026
            </div>
            <AlertCircle className="w-12 h-12 text-[#FF4242]" />
          </div>
        </FlowSection>

        {/* SECTION 2: THE DATA ENGINE (#FDFFFF Pure White) */}
        <FlowSection className="bg-[#FDFFFF] text-[#0C120C]">
          <div className="flex justify-between items-start w-full">
            <div className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#0C120C]/40">
              02 — Market Intelligence
            </div>
          </div>
          <div className="mt-auto mb-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1">
              <h1 className="text-[10vw] leading-[0.85] font-black tracking-tighter uppercase mb-8 text-[#0C120C]">
                Track<br />The Markup.
              </h1>
              <p className="text-lg md:text-xl text-[#0C120C]/70 font-medium leading-relaxed mb-8 max-w-lg">
                We monitor hidden e-commerce fees the same way Wall Street
                monitors stocks. Use our X-Ray engine to reverse-engineer surge
                pricing and platform fees in real-time.
              </p>
              <Link href="/analyze" className="group inline-flex items-center gap-4 bg-[#FF4242] text-[#FDFFFF] px-8 py-5 rounded-full text-lg font-bold hover:bg-[#d63636] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20">
                Launch X-Ray Engine
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div id="tracker" className="flex-1 w-full max-w-xl pointer-events-auto">
              <StockMarketTracker />
            </div>
          </div>
          <div className="flex justify-between items-end pb-8">
            <div className="text-[#0C120C]/40 text-sm font-bold tracking-widest uppercase">
              Powered by Live Data Aggregation
            </div>
            <TrendingUp className="w-12 h-12 text-[#FF4242]" />
          </div>
        </FlowSection>

        {/* SECTION 3: THE DEFENSE (#FF4242 Alert Red) */}
        <FlowSection className="bg-[#FF4242] text-[#FDFFFF]">
          <div className="flex justify-between items-start w-full">
            <div className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#FDFFFF]/60">
              03 — The Defense
            </div>
          </div>
          <div className="mt-auto mb-auto">
            <h1 className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase mb-8">
              Fight<br />Back.
            </h1>
            <div className="max-w-3xl">
              <p className="text-lg md:text-2xl text-[#FDFFFF]/90 font-medium leading-relaxed mb-10">
                Chat with our AI Legal Sentinel. Grounded directly in the
                Consumer Protection Act (CPA) 2019. It doesn't just talk—it
                generates actionable legal redressal notices based on your
                uploaded receipts.
              </p>
              <Link href="/legal" className="inline-flex items-center gap-3 bg-[#0C120C] text-[#FDFFFF] px-10 py-5 rounded-full text-xl font-bold hover:bg-[#0C120C]/90 transition-colors border-2 border-[#FDFFFF]">
                Chat with AI Sentinel
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-end pb-8">
            <div className="text-[#FDFFFF]/60 text-sm font-bold tracking-widest uppercase">
              Inference by Groq • Llama-3.1-8B
            </div>
            <Scale className="w-12 h-12 text-[#0C120C]" />
          </div>
        </FlowSection>

        {/* SECTION 4: THE RIGHTS IQ (#1A1D20 Premium Dark Slate) */}
        <FlowSection className="bg-[#1A1D20] text-[#FDFFFF]">
          <div className="flex justify-between items-start w-full">
            <div className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#FDFFFF]/60">
              04 — Legal Awareness
            </div>
          </div>
          <div className="mt-auto mb-auto">
            <h1 className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase mb-8">
              Rights<br />IQ.
            </h1>
            <div className="max-w-3xl">
              <p className="text-lg md:text-2xl text-[#FDFFFF]/90 font-medium leading-relaxed mb-10">
                Are you being legally cheated? Test your knowledge of India's Consumer Protection Act (CPA) 2019 using our interactive, scenario-based Rights IQ Diagnostic.
              </p>
              <Link href="/quiz" className="inline-flex items-center gap-3 bg-[#FF4242] text-[#FDFFFF] px-10 py-5 rounded-full text-xl font-bold hover:bg-[#d63636] transition-colors hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20">
                Take Rights IQ Quiz
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-end pb-8">
            <div className="text-[#FDFFFF]/60 text-sm font-bold tracking-widest uppercase">
              Interactive Scenario Diagnostics
            </div>
            <TrendingUp className="w-12 h-12 text-[#FF4242]" />
          </div>
        </FlowSection>
      </FlowArt>
    </div>
  );
}