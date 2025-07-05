import React, { useEffect, useState } from "react";
import "../styles/activity.css";

function Activity() {
    const [activities, setActivities] = useState([]);
    const fetchActivities = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/activity", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            setActivities(data.activities || []);
        } catch (err) {
            console.error("Error fetching activity:", err);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);
    const handleDelete = async (id) => {
        const confirm = window.confirm("Delete this activity?");
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:5000/api/activity/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error deleting activity");
            }
            setActivities((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error("Error deleting activity:", err);
        }
    };

    const getMessage = (act) => {
        const groupName = act.group?.name || act.groupName || "Unnamed Group";
        const person = act.user?.username || "Someone";
        const currentUsername = localStorage.getItem("username");
        const name = person === currentUsername ? "You" : person;

        switch (act.type) {
            case "expense_added":
                return `${name} added ₹${act.amount} in ${groupName}`;
            case "expense_deleted":
                return `${name} deleted an expense in ${groupName}`;
            case "group_deleted":
                return `${name} deleted the group ${groupName}`;
            case "group_created":
                return `${name} created the group ${groupName}`;
            default:
                return `${name} did something`;
        }
    };
    return (
        <div className="activity">
            <h2>Recent Activity</h2>
            {activities.length === 0 && <p>No activity yet.</p>}
            {activities.length > 0 && (
                <ul className="activities">
                    {activities.map((activity) => {
                        const isMyActivity = activity.user?.username === localStorage.getItem("username");

                        return (
                            <li key={activity._id}>
                                <div>{getMessage(activity)}</div>
                                {isMyActivity && (
                                    <button onClick={() => handleDelete(activity._id)}>✘</button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );

}
export default Activity