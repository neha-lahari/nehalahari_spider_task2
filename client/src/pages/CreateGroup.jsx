import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/createGroup.css";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [groupType, setGroupType] = useState("");
    const [friendsList, setFriendsList] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/friends/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setFriendsList(data.friends || []);
            } catch (err) {
                console.error("Error loading friends:", err);
            }
        };
        fetchFriends();
    }, [token]);

    const toggleFriend = (username) => {
        setSelectedFriends((prev) => {
            const isAlreadySel = prev.includes(username);
            if (isAlreadySel) {
                const updatedList = prev.filter(name => name !== username);
                return updatedList;
            } else {
                const updatedList = [...prev, username];
                return updatedList;
            }
        });
    };

    const handleSubmit = async () => {
        if (!groupName.trim()) {
            return alert("Please enter a group name");
        }
        if (selectedFriends.length === 0) {
            return alert("Please select at least one friend");
        }
        if (!groupType) {
            return alert("Please select a group type");
        }
        try {
            const res = await fetch("http://localhost:5000/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedFriends,
                    type: groupType,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.notFriends !== undefined) {
                    alert(`${data.message}: ${data.notFriends.join(", ")}`);
                } else {
                    alert(data.message || "Failed to create group");
                }
                return;
            }
            alert("Group created successfully!");
            navigate("/dashboard/groups");
        } catch (err) {
            alert("Something went wrong: " + err.message);
        }
    };

    return (
        <div className="create-group-page">
            <div className="btns">
                <button onClick={() => navigate(-1)} className="back-btn">✘</button>
                <h2>Create a Group</h2>
                <button onClick={handleSubmit} className="done-btn">✔</button>
            </div>
            <div className="form">
                <div>Group Name</div>
                <input
                    type="text" value={groupName}
                    onChange={(e) => setGroupName(e.target.value)} />

                <div>Select Friends</div>
                <div className="checkbox-list">
                    {friendsList.map(friend => (
                        <label key={friend._id} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedFriends.includes(friend.username)}
                                onChange={() => toggleFriend(friend.username)} />
                            {friend.username}
                        </label>
                    ))}
                </div>

                <div>Type</div>
                <div className="options">
                    {["Travel", "Home", "Couple", "Other"].map((type) => {
                        let btnClass = "btn";
                        if (groupType === type) {
                            btnClass += " active";
                        }
                        return (
                            <button
                                key={type}
                                className={btnClass}
                                onClick={() => setGroupType(type)}>
                                {type}
                            </button>
                        );
                    })}
                </div>
                <p className="hint">
                    Splitwise will remind friends to join, add expenses, and settle up.
                </p>
            </div>
        </div>
    );
}
