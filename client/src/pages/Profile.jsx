import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/auth/profile", {
                withCredentials: true,
            });
            setUser(res.data.user);
        } catch (err) {
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
            // Even if logout fails on backend, redirect to login
            navigate("/login");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Profile Page</h2>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
