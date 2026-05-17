"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { MorphingCardStack } from "@/components/morphing-card-stack";

type Question = {
    id: string;
    scenario: string;
    isTrap: boolean;
    insight: string;
    platform: string;
};

const questions: Question[] = [
    {
        id: "q1",
        scenario: "Checkout screen automatically adds a ₹5 'Support Farmers' donation without your consent.",
        isTrap: true,
        insight: "Illegal: Section 2(47) prohibits 'Sneak-into-Basket' tactics. Donations must be explicitly opt-in.",
        platform: "Zepto"
    },
    {
        id: "q2",
        scenario: "A food delivery app charges a 'Handling Fee' that is only revealed at the final payment screen.",
        isTrap: true,
        insight: "Illegal: Classic Drip Pricing. All mandatory fees must be disclosed upfront under CPA 2019.",
        platform: "Zomato"
    },
    {
        id: "q3",
        scenario: "E-commerce store shows 'Only 2 items left in stock!' but you inspect the code and it's hardcoded.",
        isTrap: true,
        insight: "Illegal: Artificial Urgency. Creating a false sense of scarcity violates Dark Pattern guidelines.",
        platform: "Generic Shop"
    },
    {
        id: "q4",
        scenario: "A flight booking site pre-selects travel insurance for ₹499 during the booking flow.",
        isTrap: true,
        insight: "Illegal: Sneak-into-Basket. Pre-ticked checkboxes for paid add-ons are strictly banned.",
        platform: "MakeMyTrip"
    }
];

export default function QuizPage() {
    const [score, setScore] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [lastGuess, setLastGuess] = useState<boolean | null>(null);

    const currentQ = questions[currentIndex];

    // Format for MorphingCardStack
    const stackCards = questions.map((q, idx) => ({
        id: q.id,
        title: `Case Study ${idx + 1}: ${q.platform}`,
        description: q.scenario,
        color: idx === currentIndex ? '#0C120C' : '#1a1f1a', // Highlight current card
    }));

    const handleAnswer = (guessIsTrap: boolean) => {
        const correct = guessIsTrap === currentQ.isTrap;
        if (correct) setScore(score + 1);
        setLastGuess(guessIsTrap);
        setShowAnswer(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setLastGuess(null);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        const vulnerability = ((questions.length - score) / questions.length) * 100;
        return (
            <main className="min-h-screen bg-[#0C120C] flex flex-col items-center p-4 md:p-10 font-sans">
                <div className="w-full max-w-2xl bg-[#0C120C] text-[#FDFFFF] p-8 rounded-xl border-4 border-[#FF4242] shadow-[8px_8px_0px_#FF4242] flex flex-col items-center text-center mt-20">
                    <ShieldAlert className="w-16 h-16 text-[#FF4242] mb-4" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Diagnostic Complete</h2>
                    <div className="text-xl font-bold mb-6 opacity-80">
                        You scored {score} / {questions.length}
                    </div>
                    
                    <div className="w-full bg-[#FDFFFF] text-[#0C120C] p-6 rounded-lg mb-8">
                        <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Vulnerability Score</div>
                        <div className="text-5xl font-black text-[#FF4242] tracking-tighter mb-2">{vulnerability}%</div>
                        <p className="text-sm font-medium">
                            {vulnerability > 50 
                                ? "You are highly vulnerable to Dark Patterns. Platforms are likely exploiting you." 
                                : "You have strong consumer awareness, but manipulative tactics are evolving."}
                        </p>
                    </div>

                    <Link href="/analyze" className="w-full bg-[#FF4242] text-[#FDFFFF] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d63636] transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        You're being cheated. Run X-Ray Now
                    </Link>
                </div>
            </main>
        );
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
                    <BrainCircuit className="w-8 h-8" /> Rights IQ
                </div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Visual Card Stack */}
                <div className="opacity-80 lg:opacity-100">
                    <MorphingCardStack 
                        cards={stackCards.slice(currentIndex)} 
                        defaultLayout="stack" 
                    />
                </div>

                {/* Interactive Quiz Interface */}
                <div className="w-full bg-[#111611] text-[#FDFFFF] rounded-3xl border border-[#FDFFFF]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col min-h-[480px] relative backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-[#0C120C] border-b border-[#FDFFFF]/10 p-5 flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#FDFFFF]/50">Case Study {currentIndex + 1} of {questions.length}</div>
                        <div className="text-xs font-black uppercase tracking-widest text-[#FF4242] bg-[#FF4242]/10 px-3 py-1.5 rounded-full border border-[#FF4242]/20">Platform: {currentQ.platform}</div>
                    </div>

                    <div className="p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center">
                        {!showAnswer ? (
                            <>
                                <span className="text-[10px] font-black text-[#FF4242] uppercase tracking-widest mb-4">PLATFORM ACTION TARGETED</span>
                                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-relaxed mb-10 max-w-lg text-[#FDFFFF] drop-shadow-sm font-sans italic">
                                    "{currentQ.scenario}"
                                </h3>
                                <div className="flex w-full gap-4 max-w-md">
                                    <button 
                                        onClick={() => handleAnswer(false)}
                                        className="flex-1 py-4 border-2 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-[#0C120C] hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Legal
                                    </button>
                                    <button 
                                        onClick={() => handleAnswer(true)}
                                        className="flex-1 py-4 border-2 border-rose-500/30 text-rose-500 bg-rose-500/5 font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-[#FDFFFF] hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Illegal
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                                {lastGuess === currentQ.isTrap ? (
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                                        <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                                    </div>
                                )}
                                <h3 className={`text-3xl font-black uppercase tracking-tighter mb-2 ${lastGuess === currentQ.isTrap ? "text-emerald-500" : "text-rose-500"}`}>
                                    {lastGuess === currentQ.isTrap ? "VERDICT: CORRECT" : "VERDICT: INCORRECT"}
                                </h3>
                                <div className="bg-[#0C120C] border border-[#FDFFFF]/10 p-6 rounded-2xl w-full mb-8 text-left shadow-2xl">
                                    <div className="text-[#FF4242] text-[10px] font-black uppercase tracking-widest mb-2">CPA 2019 / CCPA Guideline Insight</div>
                                    <p className="text-[#FDFFFF]/90 text-sm leading-relaxed font-semibold">{currentQ.insight}</p>
                                </div>
                                <button 
                                    onClick={nextQuestion}
                                    className="w-full bg-[#FF4242] text-[#FDFFFF] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d63636] hover:shadow-[0_10px_20px_rgba(255,66,66,0.3)] transition-all active:scale-[0.98] duration-300 flex items-center justify-center gap-2"
                                >
                                    Next Case <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
