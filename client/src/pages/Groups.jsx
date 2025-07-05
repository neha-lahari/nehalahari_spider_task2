// Groups.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/groups.css";

function Groups() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const username = localStorage.getItem("username") || "User";
    const myId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/groups/my", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (Array.isArray(data.groups)) {
                    setGroups(data.groups);
                } else {
                    setGroups([]);
                }
            } catch (err) {
                console.error("Error fetching groups:", err);
                setGroups([]);
            }
        };

        fetchGroups();
    }, []);
    const handleDelete = async (groupId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert("Group deleted");
                setGroups((prev) => prev.filter((g) => g._id !== groupId));
            } else {
                alert(data.message || "Delete failed");
            }
        } catch (err) {
            alert("Something went wrong: " + err.message);
        }
    };



    return (
        <div className="groups-page">
            <div className="header">
                <h2 className="welcome-msg">Welcome, {username}</h2>
                <button className="create-group-btn" onClick={() => navigate("/dashboard/groups/create")}>
                    Create New Group +
                </button>
            </div>
            <h2 className="heading">Your Groups</h2>
            {
                groups?.length > 0 ? (
                    groups.map((group) => (
                        <div className="group-item" key={group._id}>
                            <span className="group-name">{group.name}</span>
                            <div className="btns">
                                <button
                                    className="view-btn"
                                    onClick={() => navigate(`/group/${group._id}`)}>
                                    View</button>

                                {group.createdBy === myId && (
                                    <button className="delete-btn" onClick={() => handleDelete(group._id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

                    ))
                ) : (
                    <p>You have no groups yet.</p>
                )
            }
        </div >
    );
}
export default Groups