import AppContent from "./components/AppContent";
import { AppProvider, AuthProvider } from "./context/AppProvider";
import { Box, Button, Typography } from "@mui/material";
import LogoutButton from "./components/LogoutButton";
import React from "react";
import { useAuthContext } from "./context/AppProvider";

const LoginButton: React.FC = () => {
	const { user } = useAuthContext();
	if (user) return null;
	return (
		<Button
			href="/auth/login"
			variant="contained"
			sx={{ position: "absolute", top: 16, right: 16 }}
		>
			Login
		</Button>
	);
};

const UserInfo: React.FC = () => {
	const { user } = useAuthContext();
	if (!user) return null;
	return (
		<Box
			sx={{
				position: "absolute",
				top: 16,
				right: 16,
				display: "flex",
				alignItems: "center",
				gap: 2,
			}}
		>
			<Typography variant="body2">{user.displayName || user.email}</Typography>
			<LogoutButton />
		</Box>
	);
};

function App() {
	return (
		<AuthProvider>
			<AppProvider>
				<Box sx={{ position: "relative", minHeight: "100vh" }}>
					<LoginButton />
					<UserInfo />
					<AppContent />
				</Box>
			</AppProvider>
		</AuthProvider>
	);
}

export default App;
