import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/start.css";
import fingerprint from "../assets/fingerprint.png";

function Register() {
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            //save new token and username
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("userId", data.user._id);
            navigate("/dashboard/groups");
        } catch (err) {
            setErrorMsg(err.message);
            setTimeout(() => setErrorMsg(""), 6000);
        }
    };

    return (
        <div className="start-container">
            {errorMsg && (
                <div className="popup-error">
                    <p>{errorMsg}</p>
                </div>
            )}
            <img src={fingerprint} alt="Fingerprint" className="fingerprint" />
            <h1 className="title">SplitWise</h1>
            <p className="subtitle">Manage your expenses with ease</p>
            <form onSubmit={handleRegister} className="form">
                <input
                    type="text" placeholder="Enter Username" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                <input
                    type="email" placeholder="Enter Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <input
                    type="password" placeholder="Enter Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <button type="submit" className="start-btn">
                    Register
                </button>
            </form>
        </div>
    );
}
export default Register