import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/account.css";

function Account() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setUser({ username: "Error", email: "" });
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };
    if (!user) {
        return <div className="account-container"><p>Loading...</p></div>;
    }

    return (
        <div className="account-container">
            <h2 className="account-title">Account</h2>
            <div className="sub-title" onClick={() => navigate("/dashboard/profile")}>
                <div>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                </div>
                <span className="edit">Edit</span>
            </div>
            <div className="sub-title" onClick={() => navigate("/dashboard/scan")}>
                Scan Code
            </div>
            <div className="sub-title">Splitwise Pro</div>

            <h4 className="section-title">Preferences</h4>
            <div className="sub-title">Email Settings</div>
            <div className="sub-title">Device and Push Notification Settings</div>
            <div className="sub-title">Security</div>

            <h4 className="section-title">Feedback</h4>
            <div className="sub-title">Rate BillSplit</div>
            <div className="sub-title">Contact Support</div>
            <div className="logout" onClick={handleLogout}>Logout</div>
        </div>
    );
}
export default Account