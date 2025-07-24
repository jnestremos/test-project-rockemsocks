import React from "react";
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	CircularProgress,
	Alert,
	Box,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import { useAuditLog } from "../hooks/useAuditLog";

interface AuditLogProps {
	parentId: string;
}

const AuditLog: React.FC<AuditLogProps> = ({ parentId }) => {
	const { log, loading, error } = useAuditLog(parentId);

	return (
		<Box mb={2}>
			<Typography variant="subtitle1" gutterBottom>
				History
			</Typography>
			{loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
			{error && (
				<Alert severity="error" sx={{ mt: 1 }}>
					{error}
				</Alert>
			)}
			<List dense>
				{log.map((entry) => (
					<ListItem key={entry.id} alignItems="flex-start">
						<ListItemIcon>
							<HistoryIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText
							primary={entry.description}
							secondary={
								<span style={{ display: "flex", alignItems: "center", gap: 8 }}>
									<PersonIcon fontSize="inherit" style={{ fontSize: 16 }} />
									<Typography
										component="span"
										variant="caption"
										color="text.secondary"
									>
										{entry.user || "System"}
									</Typography>
									<Typography
										component="span"
										variant="caption"
										color="text.secondary"
									>
										{entry.date_created &&
											new Date(entry.date_created).toLocaleString()}
									</Typography>
								</span>
							}
						/>
					</ListItem>
				))}
				{log.length === 0 && !loading && (
					<ListItem>
						<ListItemText
							primary={
								<Typography variant="body2" color="text.secondary">
									No history yet.
								</Typography>
							}
						/>
					</ListItem>
				)}
			</List>
		</Box>
	);
};

export default AuditLog;
