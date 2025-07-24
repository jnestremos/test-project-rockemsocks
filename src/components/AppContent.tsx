"use client";
import { useAppContext } from "../context/AppProvider";
import {
	Box,
	Button,
	Chip,
	Container,
	Grid,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import FilterSortBar from "./FilterSortBar";
import ReportList from "./ReportList";
import ReportFormDialog from "./ReportFormDialog";
import { getPriorityColor, getStatusColor, getDateObj } from "../utils";
import { format } from "date-fns";
import AuditLog from "./AuditLog";
import Comments from "./Comments";

const AppContent = () => {
	const {
		tab,
		setTab,
		setSelectedId,
		setFormOpen,
		setEditingBug,
		setEditingFeature,
		bugsData: { bugs },
		featureRequestsData: { featureRequests },
		selectedId,
	} = useAppContext();

	const handleAddReport = () => {
		if (tab === 0) setEditingBug(null);
		else setEditingFeature(null);
		setFormOpen(true);
	};

	const selectedItem =
		tab === 0
			? bugs.find((bug) => bug.id === selectedId)
			: featureRequests.find((feature) => feature.id === selectedId);

	return (
		<Container maxWidth="lg" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Bug Tracker
			</Typography>
			<Tabs
				value={tab}
				onChange={(_, v) => {
					setTab(v);
					setSelectedId(undefined);
				}}
				sx={{ mb: 2 }}
			>
				<Tab label="Bugs" />
				<Tab label="Feature Requests" />
			</Tabs>
			<Grid container spacing={3}>
				<Grid size={5}>
					<FilterSortBar />
					<Button variant="contained" sx={{ mb: 2 }} onClick={handleAddReport}>
						{tab === 0 ? "Add Bug" : "Add Feature Request"}
					</Button>
					<ReportList />
					<ReportFormDialog />
				</Grid>
				<Grid size={7}>
					{selectedItem ? (
						<Box p={2} border={1} borderColor="divider" borderRadius={2}>
							<Typography variant="h5" gutterBottom>
								{selectedItem.title}
							</Typography>
							<Stack direction="row" spacing={1} mb={1}>
								<Chip
									label={selectedItem.status}
									color={getStatusColor(selectedItem.status)}
									size="small"
								/>
								<Chip
									label={selectedItem.priority}
									color={getPriorityColor(selectedItem.priority)}
									size="small"
								/>
							</Stack>
							<Typography variant="body1" sx={{ mb: 2 }}>
								{selectedItem.description}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Created:{" "}
								{selectedItem.date_created &&
									(() => {
										const dateObj = getDateObj(selectedItem.date_created);
										return dateObj ? format(dateObj, "yyyy-MM-dd HH:mm") : "";
									})()}
							</Typography>
							<Box mt={3}>
								<AuditLog parentId={selectedItem.id ?? ""} />
								<Comments key={selectedItem.id} bugId={selectedItem.id ?? ""} />
							</Box>
						</Box>
					) : (
						<Typography variant="body1" color="text.secondary">
							Select an item to view details.
						</Typography>
					)}
				</Grid>
			</Grid>
		</Container>
	);
};

export default AppContent;
