"use client";

import React, { useState, useEffect, useRef } from "react";
import { useScannerStore } from "@/lib/store";
import { ArrowLeft, Scale, Send, ShieldAlert, Loader2, Copy, CheckCircle2, MessageSquare, Search, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { RightsQuiz } from "@/components/rights-quiz";
import { AgentChat } from "@/components/agent-chat";

type Mode = "bridge" | "consult" | "scanner";

export default function LegalPage() {
    const { findings, totalMarkup, previewUrl, clearScanData } = useScannerStore();
    
    // Mount state for hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine default mode based on whether data was handed off
    const [mode, setMode] = useState<Mode>("consult");

    // Read optional mode query parameter on client mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const initialMode = params.get("mode") as Mode | null;
            if (initialMode && ["bridge", "consult", "scanner"].includes(initialMode)) {
                setMode(initialMode);
            }
        }
    }, []);

    // Mode A: Bridge State
    const [isGenerating, setIsGenerating] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mode C: Scanner State
    const [scannerInput, setScannerInput] = useState("");
    const [scannerResult, setScannerResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(false);

    // MODE B state has been moved into the AgentChat component.
    // The chatEndRef and related handlers are now handled internally.

    // --- MODE A: REDRESSAL BRIDGE EFFECT ---
    useEffect(() => {
        if (mode === "bridge" && findings && findings.length > 0 && !notice && !isGenerating && !error) {
            const generateNotice = async () => {
                setIsGenerating(true);
                setError(null);
                try {
                    const res = await fetch("/api/generate-notice", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ findings, totalMarkup }),
                    });
                    if (!res.ok) throw new Error("Failed to generate notice");
                    const data = await res.json();
                    setNotice(data.notice);
                } catch (err: any) {
                    setError(err.message || "An error occurred.");
                } finally {
                    setIsGenerating(false);
                }
            };
            generateNotice();
        }
    }, [mode, findings, notice, isGenerating, error, totalMarkup]);

    // --- MODE C: TRAP SCANNER ---
    const handleScanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannerInput.trim()) return;
        setIsScanning(true);
        setScannerResult(null);

        try {
            const res = await fetch("/api/scan-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: scannerInput }),
            });
            const data = await res.json();
            setScannerResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    if (!mounted) {
        return null; // Hydration fix
    }

    return (
        <main className="min-h-screen bg-[#0C120C] p-4 md:p-10 font-sans flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8 border-b border-[#FDFFFF]/10 pb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#FDFFFF]/60 hover:text-[#FDFFFF] transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> Back Home
                </Link>
                <div className="flex items-center gap-3 text-[#FF4242] font-black tracking-tighter text-2xl uppercase">
                    <ShieldAlert className="w-8 h-8" /> Sentinel Command Center
                </div>
            </div>

            {/* Mode Selector */}
            <div className="w-full max-w-6xl flex flex-wrap gap-4 mb-8">
                <div className="relative group flex-1 min-w-[200px]">
                    <button 
                        onClick={() => setMode("consult")} 
                        className={`w-full py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${mode === "consult" ? "bg-[#FF4242] text-[#FDFFFF]" : "bg-[#1a1f1a] text-[#FDFFFF]/60 hover:bg-[#2a2f2a]"}`}
                    >
                        <MessageSquare className="w-4 h-4" /> Legal Consult
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-[#0C120C] text-[#FDFFFF] text-xs font-bold p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border border-[#FDFFFF]/20 text-center">
                        Chat in real-time with an elite AI Consumer Rights Attorney on India's Consumer Protection Act (CPA), 2019.
                    </div>
                </div>

                <div className="relative group flex-1 min-w-[200px]">
                    <button 
                        onClick={() => setMode("scanner")} 
                        className={`w-full py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${mode === "scanner" ? "bg-[#FF4242] text-[#FDFFFF]" : "bg-[#1a1f1a] text-[#FDFFFF]/60 hover:bg-[#2a2f2a]"}`}
                    >
                        <Search className="w-4 h-4" /> Trap Scanner
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-[#0C120C] text-[#FDFFFF] text-xs font-bold p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border border-[#FDFFFF]/20 text-center">
                        Real-time checkout trap analyzer powered by high-precision OCR models.
                    </div>
                </div>

                <div className="relative group flex-1 min-w-[200px]">
                    <button 
                        onClick={() => setMode("bridge")} 
                        disabled={!findings || findings.length === 0} 
                        className={`w-full py-4 px-6 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${mode === "bridge" ? "bg-[#FF4242] text-[#FDFFFF]" : "bg-[#1a1f1a] text-[#FDFFFF]/60 hover:bg-[#2a2f2a] disabled:opacity-30 disabled:cursor-not-allowed"}`}
                    >
                        <Scale className="w-4 h-4" /> Notice Draft
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-[#0C120C] text-[#FDFFFF] text-xs font-bold p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border border-[#FDFFFF]/20 text-center">
                        {findings && findings.length > 0 ? "Generate an airtight Legal Redressal Notice based on your scanned evidence." : "Scan a receipt first using the Trap Scanner to unlock AI Notice drafting."}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl">
                {/* --- MODE A: BRIDGE --- */}
                {mode === "bridge" && findings && findings.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-[#FDFFFF] p-6 rounded-xl border-l-[6px] border-[#FF4242] shadow-2xl">
                                <h2 className="text-xl font-black text-[#0C120C] uppercase tracking-tight mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-[#FF4242]" /> Case Data
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="text-[10px] text-[#0C120C]/50 uppercase tracking-widest font-bold mb-1">Total Markup Detected</div>
                                        <div className="text-3xl font-black text-[#FF4242]">₹{totalMarkup.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[#0C120C]/50 uppercase tracking-widest font-bold mb-1">Violations Logged</div>
                                        <div className="text-xl font-bold text-[#0C120C]">{findings.length} Items</div>
                                    </div>
                                </div>
                                {previewUrl && (
                                    <div className="mb-6 border-2 border-[#0C120C] rounded-lg overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-full bg-[#0C120C] text-[#FDFFFF] text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Evidence Attached</div>
                                        <img src={previewUrl} alt="Evidence" className="w-full h-auto opacity-80 mix-blend-multiply pt-6 bg-zinc-100" />
                                    </div>
                                )}
                                
                                <Link href="/analyze" onClick={() => clearScanData()} className="w-full bg-[#0C120C] text-[#FDFFFF] h-14 text-sm font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-xl hover:bg-[#1a251a] transition-colors mt-auto">
                                    Start New Scan
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-8 w-full bg-[#FDFFFF] min-h-[600px] rounded-xl border-4 border-[#0C120C] shadow-[8px_8px_0px_#0C120C] flex flex-col overflow-hidden">
                            <div className="bg-[#0C120C] text-[#FDFFFF] p-4 flex justify-between items-center">
                                <div className="text-xs font-bold uppercase tracking-widest">Legal Draft Output</div>
                                {notice && (
                                    <button onClick={() => { navigator.clipboard.writeText(notice); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="text-xs font-bold uppercase tracking-widest bg-[#FDFFFF]/10 hover:bg-[#FDFFFF]/20 px-3 py-1.5 rounded transition-colors flex items-center gap-2">
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 p-8 bg-[#fdfdfd] relative overflow-y-auto text-[#0C120C]">
                                {isGenerating && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0C120C]">
                                        <Loader2 className="w-10 h-10 mb-4 animate-spin text-[#FF4242]" />
                                        <div className="text-sm font-black uppercase tracking-widest animate-pulse">Consulting CPA 2019...</div>
                                    </div>
                                )}
                                {error && <div className="p-4 bg-red-50 text-red-600 font-bold">{error}</div>}
                                {notice && !isGenerating && (
                                    <div className="prose prose-sm md:prose-base max-w-none prose-h1:text-xl prose-h1:font-black prose-h1:uppercase prose-h1:text-[#0C120C] prose-h2:text-lg prose-h2:font-bold prose-h2:text-[#0C120C] prose-p:text-[#0C120C] prose-strong:text-[#0C120C] prose-li:text-[#0C120C] marker:text-[#0C120C]">
                                        <ReactMarkdown>{notice}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            {notice && !isGenerating && (
                                <div className="bg-[#0C120C] p-4 flex items-center justify-between">
                                    <div className="text-[10px] text-[#FDFFFF]/60 font-bold uppercase tracking-widest">Inference by Groq Llama-3.3-70B</div>
                                    <a href={`mailto:?subject=Legal Notice: Unfair Trade Practice under CPA 2019&body=Please find the legal notice copied below:%0D%0A%0D%0A${encodeURIComponent(notice.substring(0, 1500))}${notice.length > 1500 ? '... [Truncated due to email limits. Paste full text from clipboard.]' : ''}`} className="bg-[#FF4242] text-[#FDFFFF] px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#d63636] transition-colors flex items-center gap-2">
                                        <Send className="w-4 h-4" /> Send Email
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- MODE B: CONSULT --- */}
                {mode === "consult" && (
                    <div className="w-full bg-[#0C120C] rounded-xl border-4 border-[#0C120C] shadow-[8px_8px_0px_#0C120C] flex flex-col overflow-hidden min-h-[700px]">
                        <AgentChat />
                    </div>
                )}

                {/* --- MODE C: SCANNER --- */}
                {mode === "scanner" && (
                    <div className="w-full flex flex-col items-center gap-8">
                        <div className="w-full max-w-2xl text-center">
                            <h2 className="text-3xl font-black text-[#FDFFFF] uppercase tracking-tighter mb-4">Is This A Trap?</h2>
                            <p className="text-[#FDFFFF]/60 font-mono text-sm">Paste a promotional SMS, Email, or landing page copy below. The Sentinel will analyze it for manipulative Dark Patterns.</p>
                        </div>
                        <form onSubmit={handleScanSubmit} className="w-full max-w-3xl flex flex-col gap-4">
                            <textarea value={scannerInput} onChange={(e) => setScannerInput(e.target.value)} rows={6} placeholder="e.g. 'Hurry! Only 1 room left at this price!' or 'Sign up now for a FREE trial (requires credit card)...'" className="w-full bg-[#FDFFFF] text-[#0C120C] p-6 rounded-xl border-4 border-[#0C120C] shadow-[8px_8px_0px_#0C120C] font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[#FF4242]/20" />
                            <button type="submit" disabled={isScanning || !scannerInput.trim()} className="w-full bg-[#FF4242] text-[#FDFFFF] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d63636] disabled:opacity-50 transition-colors shadow-[4px_4px_0px_#0C120C]">
                                {isScanning ? "Scanning..." : "Analyze Text"}
                            </button>
                        </form>
                        {scannerResult && (
                            <div className={`w-full max-w-3xl p-8 rounded-xl border-4 shadow-[8px_8px_0px_#0C120C] bg-[#FDFFFF] text-[#0C120C] ${scannerResult.isTrap ? 'border-[#FF4242]' : 'border-green-500'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    {scannerResult.isTrap ? <ShieldAlert className="w-10 h-10 text-[#FF4242]" /> : <CheckCircle2 className="w-10 h-10 text-green-500" />}
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{scannerResult.title}</h3>
                                </div>
                                <p className="font-mono text-sm font-bold text-[#0C120C]/80 bg-zinc-100 p-4 rounded-lg border border-zinc-200">
                                    {scannerResult.reason}
                                </p>
                                <div className="mt-4 inline-flex px-3 py-1 rounded bg-[#0C120C] text-[#FDFFFF] text-[10px] font-black uppercase tracking-widest">
                                    Severity: {scannerResult.severity}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}
