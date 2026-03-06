import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fingerprint from "../assets/fingerprint.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.clear();
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userId", data.user._id);

            navigate("/dashboard/groups");
        } catch (err) {
            setErrorMsg(err.message);
            setTimeout(() => setErrorMsg(""), 6000);
        }
    };

    const handleGoogleLogin = () => {
        const googleWindow = window.open(
            "http://localhost:5000/api/auth/google/login",
            "_blank",
            "width=500,height=600"
        );

        const handleMessage = (event) => {
            if (event.origin !== "http://localhost:5000") return;

            if (event.data.error) {
                setErrorMsg(event.data.error);
            } else if (event.data.token) {
                localStorage.setItem("token", event.data.token);
                localStorage.setItem("username", event.data.user.username);
                localStorage.setItem("userId", event.data.user._id);
                navigate("/dashboard/groups");
            }

            window.removeEventListener("message", handleMessage);
            googleWindow.close();
        };

        window.addEventListener("message", handleMessage);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900 overflow-hidden">

            {/* Background Geometric Elements (SAME AS REGISTER) */}
            <div className="absolute inset-0 overflow-hidden">

                <svg className="absolute top-0 left-0 w-96 h-96 opacity-30" viewBox="0 0 400 400">
                    <polygon points="0,0 200,0 100,173" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <polygon points="150,50 300,50 225,200" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                </svg>

                <svg className="absolute bottom-0 right-20 w-96 h-96 opacity-30" viewBox="0 0 400 400">
                    <polygon points="200,200 400,200 300,400" fill="none" stroke="#14b8a6" strokeWidth="2" />
                </svg>

                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-green-500/50">

                {errorMsg && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg animate-pulse w-full text-center">
                        {errorMsg}
                    </div>
                )}

                <img src={fingerprint} alt="Fingerprint" className="w-20 animate-bounce" />

                <h1 className="text-green-400 text-3xl font-extrabold drop-shadow-lg animate-pulse">
                    SplitWise
                </h1>

                <p className="text-green-300 text-center mb-4">
                    Welcome back! Login to continue
                </p>

                <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded-lg border border-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200 bg-black/20 text-green-100 backdrop-blur-sm"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 rounded-lg border border-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200 bg-black/20 text-green-100 backdrop-blur-sm"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                        Login
                    </button>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    className="mt-2 bg-green-700/30 hover:bg-green-600/50 text-white py-2 rounded-xl font-semibold w-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                    Login with Google
                </button>

                <p
                    className="text-green-200/70 mt-4 cursor-pointer underline text-sm hover:text-green-400 transition-all duration-200"
                    onClick={() => navigate("/register")}
                >
                    Don't have an account? Register
                </p>
            </div>

            <style>
                {`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) translateX(15px);
                        opacity: 0.8;
                    }
                }
                `}
            </style>
        </div>
    );
}