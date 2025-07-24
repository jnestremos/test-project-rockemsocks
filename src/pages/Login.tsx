import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	TextField,
	Typography,
	CircularProgress,
	Alert,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/");
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			minHeight="100vh"
			position="relative"
		>
			<Button
				variant="outlined"
				sx={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}
				onClick={() => navigate("/")}
				tabIndex={-1}
			>
				Home
			</Button>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					width: 320,
					p: 4,
					border: 1,
					borderColor: "divider",
					borderRadius: 2,
					boxShadow: 2,
					bgcolor: "background.paper",
				}}
			>
				<Typography variant="h5" mb={2} align="center">
					Login
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<TextField
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					margin="normal"
					required
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mt: 2 }}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} /> : "Login"}
				</Button>
			</Box>
		</Box>
	);
};

export default LoginPage;
