import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fingerprint from "../assets/fingerprint.png";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userId", data.user._id);

            navigate("/dashboard/groups");
        } catch (err) {
            setErrorMsg(err.message);
            setTimeout(() => setErrorMsg(""), 6000);
        }
    };

    // =========================
    // GOOGLE REGISTER POPUP
    // =========================
    const handleGoogleRegister = () => {
        const googleWindow = window.open(
            "http://localhost:5000/api/auth/google/register",
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
                localStorage.setItem("userId", event.data.user.id);
                navigate("/dashboard/groups");
            }

            window.removeEventListener("message", handleMessage);
            googleWindow.close();
        };

        window.addEventListener("message", handleMessage);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900 overflow-hidden">
            {/* Geometric Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Top left geometric shapes */}
                <svg className="absolute top-0 left-0 w-96 h-96 opacity-30" viewBox="0 0 400 400">
                    <polygon points="0,0 200,0 100,173" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <polygon points="150,50 300,50 225,200" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                    <polygon points="50,100 150,100 100,220" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.4" />
                </svg>

                {/* Top right geometric shapes */}
                <svg className="absolute top-20 right-0 w-80 h-80 opacity-25" viewBox="0 0 400 400">
                    <polygon points="400,0 200,200 400,200" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <polygon points="350,50 300,150 400,150" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                    <line x1="200" y1="0" x2="200" y2="200" stroke="#0d9488" strokeWidth="1" opacity="0.5" />
                </svg>

                {/* Bottom right geometric shapes */}
                <svg className="absolute bottom-0 right-20 w-96 h-96 opacity-30" viewBox="0 0 400 400">
                    <polygon points="200,200 400,200 300,400" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <polygon points="250,250 400,250 325,380" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                    <polygon points="200,300 350,300 275,400" fill="none" stroke="#0d9488" strokeWidth="1" opacity="0.4" />
                </svg>

                {/* Bottom left geometric shapes */}
                <svg className="absolute bottom-10 left-0 w-80 h-80 opacity-25" viewBox="0 0 400 400">
                    <polygon points="0,200 200,200 100,400" fill="none" stroke="#14b8a6" strokeWidth="2" />
                    <polygon points="0,250 150,250 75,400" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                    <line x1="0" y1="200" x2="200" y2="200" stroke="#0d9488" strokeWidth="1" opacity="0.5" />
                </svg>

                {/* Animated floating dots */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`dot-${i}`}
                        className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                    />
                ))}

                {/* Animated connecting lines */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`line-${i}`}
                        className="absolute bg-gradient-to-r from-teal-400 to-transparent opacity-30"
                        style={{
                            width: `${100 + Math.random() * 200}px`,
                            height: "1px",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animation: `pulse ${5 + Math.random() * 5}s ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Register Form */}
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
                    Manage your expenses with ease
                </p>

                <form onSubmit={handleRegister} className="flex flex-col w-full gap-4">
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 rounded-lg border border-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200 bg-black/20 text-green-100 backdrop-blur-sm"
                        required
                    />
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
                        Register
                    </button>
                </form>

                <button
                    className="mt-2 bg-green-700/30 hover:bg-green-600/50 text-white py-2 rounded-xl font-semibold w-full shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={handleGoogleRegister}
                >
                    Register with Google
                </button>

                <p
                    className="text-green-200/70 mt-4 cursor-pointer underline text-sm hover:text-green-400 transition-all duration-200"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? Login
                </p>
            </div>

            {/* Tailwind custom animation keyframes */}
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

          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
            </style>
        </div>
    );
}
