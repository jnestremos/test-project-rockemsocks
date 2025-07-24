import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { useAppContext } from "../context/AppProvider";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reportSchema } from "../lib/schema/reportSchema";
import type { TReportSchema } from "../lib/schema/reportSchema";
import type { Report } from "../lib/interfaces";
import { PRIORTIES, STATUSES } from "../lib/constants";
import { useAuditLog } from "../hooks/useAuditLog";
import { getReportUpdateAction } from "../utils";
import ReportForm from "./ReportForm";

const ReportFormDialog: React.FC = () => {
	const {
		formOpen,
		setFormOpen,
		editingBug,
		editingFeature,
		tab,
		setEditingBug,
		setEditingFeature,
		bugsData: { updateBug, createBug },
		featureRequestsData: { updateFeatureRequest, createFeatureRequest },
	} = useAppContext();
	const { addLogEntry: addBugLogEntry } = useAuditLog(editingBug?.id ?? "");
	const { addLogEntry: addFeatureLogEntry } = useAuditLog(
		editingFeature?.id ?? ""
	);

	const defaultValues = {
		title: "",
		description: "",
		priority: PRIORTIES[0],
		status: STATUSES[0],
	};

	const form = useForm<TReportSchema>({
		defaultValues,
		resolver: yupResolver(reportSchema),
	});

	useEffect(() => {
		if (editingBug) {
			form.reset(editingBug);
		} else if (editingFeature) {
			form.reset(editingFeature);
		} else {
			form.reset(defaultValues);
		}
	}, [editingBug, editingFeature]);

	const handleBugFormSubmit = async (report: TReportSchema) => {
		if (editingBug) {
			updateBug(editingBug.id!, report);
			addBugLogEntry({
				parentId: editingBug.id!,
				description: `Bug updated: ${getReportUpdateAction(
					editingBug,
					report
				)}`,
				user: "System",
			});
			setEditingBug(null);
		} else {
			const docRef = await createBug(report);
			if (docRef && docRef.id) {
				addBugLogEntry({
					parentId: docRef.id,
					description: "Bug created",
					user: "System",
				});
			}
		}
		setFormOpen(false);
		form.reset();
	};

	const handleFeatureFormSubmit = async (report: Report) => {
		if (editingFeature) {
			updateFeatureRequest(editingFeature.id!, report);
			addFeatureLogEntry({
				parentId: editingFeature.id!,
				description: `Feature request updated: ${getReportUpdateAction(
					editingFeature,
					report
				)}`,
				user: "System",
			});
			setEditingFeature(null);
		} else {
			const docRef = await createFeatureRequest(report);
			if (docRef && docRef.id) {
				addFeatureLogEntry({
					parentId: docRef.id,
					description: "Feature request created",
					user: "System",
				});
			}
		}
		setFormOpen(false);
		form.reset();
	};

	return (
		<Dialog open={formOpen} onClose={setFormOpen} maxWidth="sm" fullWidth>
			<DialogTitle>
				{editingBug || editingFeature
					? `Edit ${tab === 0 ? "Bug" : "Feature Request"}`
					: tab === 0
					? "Create Bug"
					: "Create Feature Request"}
			</DialogTitle>
			<DialogContent>
				<FormProvider {...form}>
					<ReportForm
						onSubmit={tab === 0 ? handleBugFormSubmit : handleFeatureFormSubmit}
					/>
				</FormProvider>
				<Button onClick={() => setFormOpen(false)} sx={{ mt: 2 }}>
					Cancel
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ReportFormDialog;
