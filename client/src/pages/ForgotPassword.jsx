import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/start.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:5000/api/users/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // ✅ extract token from resetLink
            const token = data.resetLink.split("/").pop();

            // ✅ redirect user to reset password page
            navigate(`/reset-password/${token}`);

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="start-container">
            <h1 className="title">Forgot Password</h1>
            <p className="subtitle">
                Enter your registered email to reset your password
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" className="start-btn" disabled={loading}>
                    {loading ? "Redirecting..." : "Continue"}
                </button>
            </form>

            <p
                style={{
                    marginTop: "15px",
                    color: "#00e681",
                    cursor: "pointer",
                    textDecoration: "underline",
                }}
                onClick={() => navigate("/")}
            >
                Back to Login
            </p>
        </div>
    );
}
