import * as yup from "yup";
import type { Priority, Status } from "../types";
import { PRIORTIES, STATUSES } from "../constants";

export const reportSchema = yup.object({
	title: yup.string().required("Title is required"),
	description: yup.string().required("Description is required"),
	priority: yup
		.mixed<Priority>()
		.oneOf(PRIORTIES)
		.required("Priority is required"),
	status: yup.mixed<Status>().oneOf(STATUSES).required("Status is required"),
});

export type TReportSchema = yup.InferType<typeof reportSchema>;
