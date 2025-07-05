import React from "react";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Outlet /> 
            </div>
        </div>
    );
}

export default Dashboard;
