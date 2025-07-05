import React, { useState, useEffect } from "react";
import "../styles/Friends.css";

export default function Friends() {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/friends/status", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setFriends(data.friends || []);
                setIncomingRequests(data.incomingRequests || []);
            } catch (error) {
                console.error("Failed to load friends/status:", error);
            }
        };

        fetchFriendData();
    }, [token]);

    const handleSearch = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/friends/search?query=${search}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };
    const handleAddFriend = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/friends/request/${userId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Friend request sent!");
        } catch (error) {
            console.error("Add friend failed:", error);
        }
    };
    const handleUnfriend = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/friends/unfriend/${userId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriends(prev => prev.filter(friend => friend._id !== userId));
            alert("Unfriended!!!!");
        } catch (error) {
            console.error("Unfriend failed:", error);
        }
    };

    const handleAccept = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/friends/accept/${userId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const acceptedUser = incomingRequests.find(user => user._id === userId);

            setIncomingRequests(prev => prev.filter(user => user._id !== userId));
            if (!friends.some(friend => friend._id === userId)) {
                setFriends(prev => [...prev, acceptedUser]);//creates a new friends list
            }
        } catch (error) {
            console.error("Accept failed:", error);
        }
    };
    const handleReject = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/friends/reject/${userId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            setIncomingRequests(prev => prev.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Reject failed:", error);
        }
    };

    return (
        <div className="friends-page">
            <h2 className="heading">Friends</h2>
            <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or email"
                className="friends-search" />
            <button onClick={handleSearch} className="search-btn">Search</button>

            <div className="section">
                <h3>Search Results</h3>
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div key={user._id} className="friend-result">
                            <p>{user.username} ({user.email})</p>
                            {friends.some(friend => friend._id === user._id) ? (
                                <button
                                    onClick={() => handleUnfriend(user._id)}
                                    className="friend-action-btn unfriend-btn" >
                                    Unfriend
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAddFriend(user._id)}
                                    className="friend-action-btn add-btn"
                                >
                                    Add Friend
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>

            <div className="section">
                <h3>Incoming Friend Requests</h3>
                {incomingRequests.length > 0 ? (
                    incomingRequests.map((user) => (
                        <div key={user._id} className="friend-result">
                            <p>{user.username} ({user.email})</p>
                            <button onClick={() => handleAccept(user._id)} className="friend-action-btn accept-btn">
                                Accept
                            </button>
                            <button onClick={() => handleReject(user._id)} className="friend-action-btn reject-btn">Reject</button>
                        </div>
                    ))
                ) : (
                    <p>No incoming requests</p>
                )}
            </div>

            <div className="section">
                <h3>Your Friends</h3>
                {friends.length > 0 ? (
                    friends.map((user) => (
                        <div key={user._id} className="friend-result">
                            <p>{user.username} ({user.email})</p>
                            <button onClick={() => handleUnfriend(user._id)} className="friend-action-btn unfriend-btn">Unfriend</button>
                        </div>
                    ))
                ) : (
                    <p>No friends yet</p>
                )}
            </div>
        </div>
    );
}
