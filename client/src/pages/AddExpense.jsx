import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/addExpense.css";

export default function AddExpense() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [paidBy, setPaidBy] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                const members = data.group?.members;
                if (members) {
                    setMembers(members);
                }
            } catch (err) {
                console.error("Error fetching group members:", err);
            }
        };
        fetchMembers();
    }, [groupId]);

    const handleSubmit = async () => {
        if (!amount || !category || !paidBy) {
            alert("Please fill all fields");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/expenses/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    groupId,
                    amount: Number(amount), category, paidBy,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error adding expense");
                return;
            }

            alert("Expense added!");
            navigate(`/group/${groupId}`);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="add-expense-page">
            <h2>Add Expense</h2>
            <label>Category</label>
            <input
                type="text" value={category}
                onChange={(e) => setCategory(e.target.value)} />

            <label>Amount</label>
            <input
                type="number" value={amount}
                onChange={(e) => setAmount(e.target.value)} />

            <label>Who Paid?</label>
            <div className="list">
                {members.map((m) => (
                    <div key={m._id} className="item">
                        <input
                            type="radio" name="paidBy"
                            value={m._id}
                            checked={paidBy === m._id}
                            onChange={() => setPaidBy(m._id)} />
                        {m.username}
                    </div>
                ))}
            </div>
            <div className="btns">
                <button onClick={handleSubmit}>Add</button>
                <button onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
}
