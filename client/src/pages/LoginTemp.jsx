import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/start.css";
import fingerprint from "../assets/fingerprint.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();//This stops the browser’s default behavior of reloading the page when a form is submitted.
        setErrorMsg("");//This clears any previous error message before starting a new login attempt.
        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            localStorage.clear();
            // Store new data
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userId", data.user._id);
            navigate("/dashboard/groups");
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    return (
        <div className="start-container">
            {errorMsg && (//if error msg is not empty show this msg
                <div className="popup-error">
                    <p>{errorMsg}</p>
                </div>
            )}
            <img src={fingerprint} alt="Fingerprint" className="fingerprint" />
            <h1 className="title">SplitWise</h1>
            <p className="subtitle">Manage your expenses with ease</p>

            <form onSubmit={handleLogin} className="form">
                <input
                    type="email" placeholder="Enter Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <input
                    type="password" placeholder="Enter Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="start-btn">
                    Login
                </button>
            </form>
            <p className="hint">
                Don’t have an account?{" "}
                <span
                    style={{ color: "#00e681", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/register")}>
                    Register
                </span>
            </p>
        </div>
    );
}
