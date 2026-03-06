import React from "react";

function SplashScreen() {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex flex-col justify-center items-center overflow-hidden relative">

            {/* Soft Glow Background */}
            <div className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>

            {/* Content */}
            <div className="relative flex flex-col items-center gap-6">

                {/* Elegant App Name */}
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 via-green-300 to-green-400 bg-clip-text text-transparent tracking-wide animate-pulse">
                    BillSplit
                </h1>

                {/* Subtitle */}
                <p className="text-green-300/60 text-sm tracking-widest">
                    Preparing your dashboard...
                </p>

                {/* Smooth Loading Dots */}
                <div className="flex gap-2 mt-6">
                    {[0, 0.2, 0.4].map((delay, index) => (
                        <div
                            key={index}
                            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}s` }}
                        ></div>
                    ))}
                </div>

                {/* Thin Progress Bar */}
                <div className="mt-8 w-56 h-1 bg-green-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-300 animate-[slide_2s_ease-in-out_infinite]"></div>
                </div>
            </div>

            {/* Animation */}
            <style>
                {`
                @keyframes slide {
                    0%, 100% { width: 0%; }
                    50% { width: 100%; }
                }
                `}
            </style>
        </div>
    );
}

export default SplashScreen;