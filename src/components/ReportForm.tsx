import React from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { TReportSchema } from "../lib/schema/reportSchema";
import { PRIORTIES, STATUSES } from "../lib/constants";

interface ReportFormProps {
	onSubmit: (data: TReportSchema) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useFormContext<TReportSchema>();

	return (
		<Box
			component="form"
			pt={2}
			sx={{ display: "flex", flexDirection: "column", gap: 2 }}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Title"
						required
						fullWidth
						error={!!errors.title}
						helperText={errors.title?.message}
					/>
				)}
			/>
			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Description"
						required
						fullWidth
						multiline
						rows={4}
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
				)}
			/>
			<Controller
				name="priority"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Priority"
						required
						fullWidth
						error={!!errors.priority}
						helperText={errors.priority?.message}
					>
						{PRIORTIES.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
			<Controller
				name="status"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Status"
						required
						fullWidth
						error={!!errors.status}
						helperText={errors.status?.message}
					>
						{STATUSES.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
			<Button type="submit" variant="contained">
				Submit
			</Button>
		</Box>
	);
};

export default ReportForm;
