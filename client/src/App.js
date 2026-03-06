import React, { useState, useEffect } from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginTemp";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Group from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import Friends from "./pages/Friends";
import Account from "./pages/Account";
import Activity from "./pages/Activity";
import GroupDetails from "./pages/GroupDetails";
import AddExpense from "./pages/AddExpense";
import Profile from "./pages/Profile";
import ScanQR from "./pages/scanner";
import OAuthSuccess from "./pages/OAuthSuccess";

import SplashScreen from "./components/SplashScreen";
import OfflineScreen from "./components/OfflineScreen";
import AddMembersToGroup from "./pages/AddMembersToGroup";

import "./index.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Splash timer (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Internet listeners
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // 🔴 Show Offline UI
  if (!isOnline) {
    return <OfflineScreen />;
  }

  // 🟢 Show Splash Screen
  if (loading) {
    return <SplashScreen />;
  }

  // 🚀 Main Application
  return (
    <Router>
      <Routes>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="groups" replace />} />
          <Route path="groups" element={<Group />} />
          <Route path="groups/create" element={<CreateGroup />} />
          <Route path="friends" element={<Friends />} />
          <Route path="activity" element={<Activity />} />
          <Route path="account" element={<Account />} />
          <Route path="profile" element={<Profile />} />
          <Route path="scan" element={<ScanQR />} />
        </Route>

        {/* Group Details */}
        <Route path="/group/:groupId" element={<GroupDetails />} />
        <Route path="/group/:groupId/add-members" element={<AddMembersToGroup />} />
        <Route path="/group/:groupId/add-expense" element={<AddExpense />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;