import React from "react";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">BillSplit</h2>
            <nav>
                <ul>
                    <li><Link to="/dashboard/groups">Groups</Link></li>
                    <li><Link to="/dashboard/friends">Friends</Link></li>
                    <li><Link to="/dashboard/activity">Activity</Link></li>
                    <li><Link to="/dashboard/account">Account</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
