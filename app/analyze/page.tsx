import { XRayEngine } from "@/components/x-ray-engine";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
    return (
        <main className="min-h-screen bg-[#0C120C] p-4 md:p-10 font-sans">
            {/* Navigation Header */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#FDFFFF]/60 hover:text-[#FDFFFF] transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="text-[#FF4242] font-black tracking-tighter text-xl uppercase">
                    Scanner Active
                </div>
            </div>

            {/* Render the Engine Component */}
            <XRayEngine />
        </main>
    );
}