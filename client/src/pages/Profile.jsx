import React, { useEffect, useState } from "react";
import "../styles/profile.css";

function Profile() {
    const [user, setUser] = useState({
        username: "",
        email: "",
    });
    const [newValues, setnewValues] = useState({
        username: "",
        email: "",
    });
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setUser(data);
                setnewValues({ username: data.username, email: data.email });
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(newValues),
            });
            const updated = await res.json();
            setUser(updated);
            alert("Profile updated!");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-info">
                    <p>Logged in as: {user.username}</p>
                    <input
                        type="text"
                        value={newValues.username}
                        onChange={(e) => setnewValues({ ...newValues, username: e.target.value })}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={newValues.email}
                        onChange={(e) => setnewValues({ ...newValues, email: e.target.value })}
                        placeholder="Email"
                    />
                    <button className="save-btn" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}
export default Profile