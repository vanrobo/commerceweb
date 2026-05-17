"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

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

export function RightsQuiz() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [lastGuess, setLastGuess] = useState<boolean | null>(null);

    const handleAnswer = (guessIsTrap: boolean) => {
        const currentQ = questions[currentIndex];
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
            <div className="w-full bg-[#0C120C] text-[#FDFFFF] p-8 rounded-xl border-4 border-[#FF4242] shadow-[8px_8px_0px_#FF4242] flex flex-col items-center text-center">
                <ShieldAlert className="w-16 h-16 text-[#FF4242] mb-4" />
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Diagnostic Complete</h2>
                <div className="text-xl font-bold mb-6 opacity-80">
                    You scored {score} / {questions.length}
                </div>
                
                <div className="w-full max-w-md bg-[#FDFFFF] text-[#0C120C] p-6 rounded-lg mb-8">
                    <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Vulnerability Score</div>
                    <div className="text-5xl font-black text-[#FF4242] tracking-tighter mb-2">{vulnerability}%</div>
                    <p className="text-sm font-medium">
                        {vulnerability > 50 
                            ? "You are highly vulnerable to Dark Patterns. Platforms are likely exploiting you." 
                            : "You have strong consumer awareness, but manipulative tactics are evolving."}
                    </p>
                </div>

                <a href="/analyze" className="w-full max-w-md bg-[#FF4242] text-[#FDFFFF] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d63636] transition-colors flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    You're being cheated. Run X-Ray Now
                </a>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="w-full bg-[#FDFFFF] text-[#0C120C] rounded-xl border-4 border-[#0C120C] shadow-[8px_8px_0px_#0C120C] overflow-hidden flex flex-col">
            <div className="bg-[#0C120C] text-[#FDFFFF] p-4 flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-widest">Case Study {currentIndex + 1} of {questions.length}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#FF4242]">Platform: {currentQ.platform}</div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-center items-center text-center min-h-[300px]">
                {!showAnswer ? (
                    <>
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-8">
                            "{currentQ.scenario}"
                        </h3>
                        <div className="flex w-full gap-4 max-w-md">
                            <button 
                                onClick={() => handleAnswer(false)}
                                className="flex-1 py-4 border-4 border-[#0C120C] font-black uppercase tracking-widest hover:bg-[#0C120C] hover:text-[#FDFFFF] transition-colors"
                            >
                                Legal
                            </button>
                            <button 
                                onClick={() => handleAnswer(true)}
                                className="flex-1 py-4 border-4 border-[#FF4242] text-[#FF4242] font-black uppercase tracking-widest hover:bg-[#FF4242] hover:text-[#FDFFFF] transition-colors"
                            >
                                Illegal
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        {lastGuess === currentQ.isTrap ? (
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                        ) : (
                            <AlertTriangle className="w-16 h-16 text-[#FF4242] mb-4" />
                        )}
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                            {lastGuess === currentQ.isTrap ? "CORRECT" : "INCORRECT"}
                        </h3>
                        <div className="bg-[#0C120C] text-[#FDFFFF] p-6 rounded-lg w-full max-w-lg mb-8 text-left">
                            <div className="text-[#FF4242] text-xs font-bold uppercase tracking-widest mb-2">CPA 2019 Insight</div>
                            <p className="font-mono text-sm leading-relaxed">{currentQ.insight}</p>
                        </div>
                        <button 
                            onClick={nextQuestion}
                            className="w-full max-w-md bg-[#FF4242] text-[#FDFFFF] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d63636] transition-colors flex items-center justify-center gap-2"
                        >
                            Next Case <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
