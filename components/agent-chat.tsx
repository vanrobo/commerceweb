"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SendIcon, LoaderIcon, Sparkles, MonitorIcon, Command, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export function AgentChat({ 
    userName = "Citizen", 
    title = "Sentinel Active", 
    subtitle = "State your grievance under CPA 2019." 
}: { 
    userName?: string, 
    title?: string, 
    subtitle?: string 
}) {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
        { role: 'assistant', content: "Sentinel is active. Grounded in Consumer Protection Act (CPA) 2019. How can I assist you with your consumer rights today?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = `60px`;
        const newHeight = Math.max(60, Math.min(textarea.scrollHeight, 200));
        textarea.style.height = `${newHeight}px`;
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        const prompt = value.trim();
        if (!prompt) return;
        
        setValue("");
        adjustHeight();
        
        const newMessages = [...messages, { role: 'user' as const, content: prompt }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const res = await fetch("/api/consult", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { role: 'assistant', content: "Error: Communication with Sentinel failed." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#0C120C] text-[#FDFFFF] relative overflow-hidden font-sans">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4242]/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10">
                <div className="w-full text-center flex flex-col items-center mb-12 mt-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#FDFFFF] pb-2">
                        {title}
                    </h1>
                    <div className="text-[#FDFFFF]/60 font-medium tracking-widest uppercase text-sm">{subtitle}</div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#FDFFFF]/20 to-transparent w-3/4 mt-6" />
                </div>

                {messages.slice(1).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={cn(
                            "max-w-[85%] p-5 rounded-2xl",
                            msg.role === 'user' 
                                ? "bg-[#1a1f1a] text-[#FDFFFF] rounded-br-sm border border-[#FDFFFF]/10" 
                                : "bg-[#FDFFFF] text-[#0C120C] rounded-bl-sm border-2 border-[#FDFFFF]/20 shadow-[4px_4px_0px_#FF4242]"
                        )}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">
                                {msg.role === 'user' ? userName : "AI Sentinel"}
                            </div>
                            <div className={cn(
                                "prose prose-sm max-w-none",
                                msg.role === 'user' ? "text-[#FDFFFF]" : "text-[#0C120C] prose-p:text-[#0C120C] prose-strong:text-[#0C120C] prose-li:text-[#0C120C]"
                            )}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#FDFFFF] text-[#0C120C] border-2 border-[#FDFFFF]/20 rounded-2xl rounded-bl-sm p-4 shadow-[4px_4px_0px_#FF4242] flex items-center gap-3">
                            <LoaderIcon className="w-5 h-5 animate-spin text-[#FF4242]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Consulting CPA 2019...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} className="h-4" />
            </div>

            <div className="p-4 md:p-6 z-10 shrink-0 bg-gradient-to-t from-[#0C120C] via-[#0C120C] to-transparent">
                <div className="w-full relative rounded-2xl bg-[#1a1f1a] border border-[#FDFFFF]/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div className="p-2 relative flex items-end gap-2">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your legal query here..."
                            className="flex-1 px-4 py-3 resize-none bg-transparent border-none text-[#FDFFFF] focus:outline-none placeholder:text-[#FDFFFF]/30 min-h-[50px] font-medium"
                            style={{ overflow: "hidden" }}
                        />
                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={isTyping || !value.trim()}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[48px] min-h-[48px] mb-1",
                                value.trim()
                                    ? "bg-[#FF4242] text-[#FDFFFF] hover:bg-[#d63636]"
                                    : "bg-[#FDFFFF]/5 text-[#FDFFFF]/30 cursor-not-allowed"
                            )}
                        >
                            {isTyping ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="text-center mt-3 text-[10px] font-bold uppercase tracking-widest text-[#FDFFFF]/30">
                    Inference by Groq Llama-3.3-70B • Do not share sensitive personal information.
                </div>
            </div>
        </div>
    );
}
