"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AppProvider";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user, loading } = useAuthContext();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && !user) {
			navigate("/auth/login", { replace: true });
		}
	}, [user, loading, navigate]);

	if (loading || (!user && typeof window !== "undefined")) {
		return (
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				minHeight="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
