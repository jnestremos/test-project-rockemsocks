import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useAppContext } from "../context/AppProvider";

const FilterSortBar: React.FC = () => {
	const { filter, setFilter } = useAppContext();
	const { status, priority, sort } = filter;

	const handleStatusChange = (e: SelectChangeEvent) => {
		setFilter({ ...filter, status: e.target.value });
	};

	const handlePriorityChange = (e: SelectChangeEvent) => {
		setFilter({ ...filter, priority: e.target.value });
	};

	const handleSortChange = (e: SelectChangeEvent) => {
		setFilter({ status, priority, sort: e.target.value });
	};

	return (
		<Box display="flex" gap={2} mb={2}>
			<FormControl fullWidth size="small">
				<InputLabel>Status</InputLabel>
				<Select
					value={status}
					label="Status"
					fullWidth
					size="small"
					onChange={handleStatusChange}
				>
					<MenuItem value="">All</MenuItem>
					<MenuItem value="Open">Open</MenuItem>
					<MenuItem value="In Progress">In Progress</MenuItem>
					<MenuItem value="Resolved">Resolved</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth size="small">
				<InputLabel>Priority</InputLabel>
				<Select
					value={priority}
					label="Priority"
					fullWidth
					size="small"
					onChange={handlePriorityChange}
				>
					<MenuItem value="">All</MenuItem>
					<MenuItem value="High">High</MenuItem>
					<MenuItem value="Medium">Medium</MenuItem>
					<MenuItem value="Low">Low</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth size="small">
				<InputLabel>Sort</InputLabel>
				<Select
					value={sort}
					label="Sort"
					fullWidth
					size="small"
					onChange={handleSortChange}
				>
					<MenuItem value="newest">Newest</MenuItem>
					<MenuItem value="oldest">Oldest</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};

export default FilterSortBar;
