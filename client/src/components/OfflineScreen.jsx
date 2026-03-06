import React from "react";

function OfflineScreen() {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex flex-col justify-center items-center overflow-hidden relative">

            {/* Soft Red Glow */}
            <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>

            {/* Content */}
            <div className="relative flex flex-col items-center gap-6 text-center">

                {/* Calm Icon (no ❌) */}
                <div className="w-16 h-16 rounded-full border border-red-400/40 flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent">
                    You're Offline
                </h1>

                {/* Subtitle */}
                <p className="text-red-300/60 text-sm max-w-sm">
                    It looks like your internet connection was interrupted.
                    We'll reconnect automatically once you're back online.
                </p>

                {/* Soft Indicator */}
                <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-300/50 text-xs tracking-widest">
                        WAITING FOR CONNECTION
                    </span>
                </div>

                {/* Retry Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 rounded-xl transition-all duration-300 hover:scale-105"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default OfflineScreen;