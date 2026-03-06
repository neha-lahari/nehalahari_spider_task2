import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const linkStyle =
        "px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium";

    return (
        <div className="h-screen w-64 bg-slate-900 border-r border-green-900/30 flex flex-col p-6">

            {/* Logo */}
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 via-green-300 to-green-400 bg-clip-text text-transparent tracking-wide mb-10">
                BillSplit
            </h2>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/dashboard/groups"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "text-slate-400 hover:text-green-300 hover:bg-green-500/10"
                        }`
                    }
                >
                    Groups
                </NavLink>

                <NavLink
                    to="/dashboard/friends"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "text-slate-400 hover:text-green-300 hover:bg-green-500/10"
                        }`
                    }
                >
                    Friends
                </NavLink>

                <NavLink
                    to="/dashboard/activity"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "text-slate-400 hover:text-green-300 hover:bg-green-500/10"
                        }`
                    }
                >
                    Activity
                </NavLink>

                <NavLink
                    to="/dashboard/account"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "text-slate-400 hover:text-green-300 hover:bg-green-500/10"
                        }`
                    }
                >
                    Account
                </NavLink>
            </nav>

            {/* Bottom subtle accent */}
            <div className="mt-auto pt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
                <p className="text-xs text-slate-500 mt-4">
                    Split smarter. Pay easier.
                </p>
            </div>
        </div>
    );
}

export default Sidebar;