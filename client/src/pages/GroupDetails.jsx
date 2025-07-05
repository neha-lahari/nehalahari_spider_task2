import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/groupDetails.css";
import GroupPieChart from "../pages/PieChart";

function GroupDetails() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setGroup(data.group);
            } catch (err) {
                console.error(" Fetch error:", err);
            }
        };

        fetchGroup();
    }, [groupId]);


    if (!group) return <p>Loading...</p>;
    const handleRemove = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/groups/${group._id}/removeMember`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ memberId }),
            });

            const data = await res.json();
            if (!res.ok) return alert(data.message || "Failed to remove");

            setGroup(data.group);
        } catch (err) {
            alert("Something went wrong: " + err.message);
        }
    };

    return (
        <div className="group-page">
            <div className="header">
                <h2>{group.name}</h2>
                <div className="add-expense-btn">
                    <button onClick={() => navigate(`/group/${group._id}/add-expense`)}>Add Expense</button>
                </div>
            </div>

            <h3>Members</h3>
            <div className="group-members">
                {group.members.map((member) => (
                    <div key={member._id} className="member-box">
                        <span>{member.username}</span>
                        {group.createdBy._id === userId && member._id !== userId && (
                            <span
                                className="remove"
                                onClick={() => handleRemove(member._id)}>
                                〤</span>
                        )}
                    </div>
                ))}
            </div>

            <h3>Category-wise Expenses</h3>
            <GroupPieChart groupId={groupId} />

            <div className="btns">
                <button className="settle-btn">Settle Up</button>
                <button className="chart-btn">Charts</button>
            </div>


        </div>
    );
}

export default GroupDetails