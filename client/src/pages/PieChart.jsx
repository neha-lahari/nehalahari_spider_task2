import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import "../styles/piechart.css"
const COLORS = [
    "#00e681", "#007a4d", "#1affbc", "#33ff99",
    "#009966", "#00ffaa", "#009933", "#33cc99"
];

function GroupPieChart() {
    const { groupId } = useParams();
    const [categoryData, setCategoryData] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);

    const fetchCategoryData = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/group/${groupId}/balances`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();

            if (data.categoryExpenses) {
                const chartData = [];
                for (const category in data.categoryExpenses) {
                    chartData.push({
                        name: category,
                        value: data.categoryExpenses[category],
                    });
                }
                setCategoryData(chartData);
            }
            // "Who owes whom"
            setBalances(data.balances || []);
        } catch (err) {
            console.error("Error fetching chart data:", err);
        }
    }, [groupId]);

    const fetchExpenses = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/group/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            setExpenses(data.expenses || []);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    }, [groupId]);

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Delete this expense?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error deleting expense");
                return;
            }

            alert("Expense deleted");
            fetchCategoryData();
            fetchExpenses();
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };

    useEffect(() => {
        fetchCategoryData();
        fetchExpenses();
    }, [groupId, fetchCategoryData, fetchExpenses]);

    return (
        <div className="piechart-container">
            <h3 className="title">Expenses by Category</h3>

            {categoryData.length === 0 ? (
                <p>No expenses to show.</p>
            ) : (
                <>
                    <div className="piecharts">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ color: "#00e681", fontSize: "0.9rem" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="expense-list">
                        {expenses.map((ex) => (
                            <div key={ex._id} className="expense-item">
                                <span>{ex.category} - ₹{ex.amount}</span>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteExpense(ex._id)}
                                    title="Delete" >
                                    ✘
                                </button>
                            </div>
                        ))}
                    </div>

                    {balances.length > 0 && (
                        <div className="balances">
                            <h4 className="balance-title">Who owes whom</h4>
                            {balances.map((b, i) => (
                                <div key={i} className="answer">
                                    {b.from} owes {b.to} ₹{b.amount}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default GroupPieChart