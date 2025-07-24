"use client";
import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const LogoutButton: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async () => {
		setLoading(true);
		await getAuth().signOut(); // Immediately update client-side auth state
		setLoading(false);
		navigate("/auth/login");
	};

	return (
		<Button onClick={handleLogout} color="inherit" disabled={loading}>
			{loading ? <CircularProgress size={20} /> : "Logout"}
		</Button>
	);
};

export default LogoutButton;
