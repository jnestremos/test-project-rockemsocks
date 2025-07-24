import React from "react";
import {
	Card,
	CardContent,
	Typography,
	IconButton,
	Box,
	Chip,
	Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Report } from "../lib/interfaces";
import { format } from "date-fns";
import { useAppContext } from "../context/AppProvider";
import { useAuditLog } from "../hooks/useAuditLog";
import { getPriorityColor, getStatusColor, getDateObj } from "../utils";

interface ReportItemProps {
	report: Report;
	selected?: boolean;
}

const ReportItem: React.FC<ReportItemProps> = ({ report, selected }) => {
	const {
		setEditingBug,
		setEditingFeature,
		setFormOpen,
		tab,
		bugsData: { deleteBug },
		featureRequestsData: { deleteFeatureRequest },
	} = useAppContext();
	const { addLogEntry: addBugLogEntry } = useAuditLog(report.id ?? "");
	const { addLogEntry: addFeatureLogEntry } = useAuditLog(report.id ?? "");

	const handleBugEdit = (report: Report) => {
		setEditingBug(report);
		setFormOpen(true);
	};

	const handleBugDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this bug?")) {
			deleteBug(id);
			addBugLogEntry({
				parentId: id,
				description: "Bug deleted",
				user: "System",
			});
		}
	};

	const handleFeatureEdit = (report: Report) => {
		setEditingFeature(report);
		setFormOpen(true);
	};

	const handleFeatureDelete = (id: string) => {
		if (
			window.confirm("Are you sure you want to delete this feature request?")
		) {
			deleteFeatureRequest(id);
			addFeatureLogEntry({
				parentId: id,
				description: "Feature request deleted",
				user: "System",
			});
		}
	};
	return (
		<Card
			sx={{
				mb: 2,
				border: selected ? "2px solid #1976d2" : "2px solid transparent",
				background: selected ? "#e3f2fd" : undefined,
				borderRadius: 2,
				transition: "background 0.2s, border 0.2s",
			}}
		>
			<CardContent>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Box>
						<Typography variant="h6">{report.title}</Typography>
						<Stack direction="row" spacing={1} mt={1} mb={1}>
							<Chip
								label={report.status}
								color={getStatusColor(report.status)}
								size="small"
							/>
							<Chip
								label={report.priority}
								color={getPriorityColor(report.priority)}
								size="small"
							/>
						</Stack>
						<Typography variant="caption">
							Created:{" "}
							{report.date_created &&
								(() => {
									const dateObj = getDateObj(report.date_created);
									return dateObj ? format(dateObj, "yyyy-MM-dd HH:mm") : "";
								})()}
						</Typography>
					</Box>
					<Box>
						<IconButton
							onClick={() =>
								tab === 0 ? handleBugEdit(report) : handleFeatureEdit(report)
							}
						>
							<EditIcon />
						</IconButton>
						<IconButton
							onClick={() =>
								tab === 0
									? handleBugDelete(report.id ?? "")
									: handleFeatureDelete(report.id ?? "")
							}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default ReportItem;
