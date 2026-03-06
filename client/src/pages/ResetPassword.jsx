import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/start.css";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:5000/api/users/reset-password/${token}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newPassword }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Password reset successful. Please login.");
            navigate("/");

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="start-container">
            <h1 className="title">Set New Password</h1>
            <p className="subtitle">Enter your new password below</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleReset} className="form">
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className="start-btn" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
