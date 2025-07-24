import type { Report } from "../lib/interfaces";

export const getStatusColor = (status: string) => {
	switch (status) {
		case "Resolved":
			return "success";
		case "In Progress":
			return "warning";
		default:
			return "default";
	}
};

export const getPriorityColor = (priority: string) => {
	switch (priority) {
		case "High":
			return "error";
		case "Medium":
			return "warning";
		default:
			return "default";
	}
};

export function getReportUpdateAction(oldReport: Report, newReport: Report) {
	const changes = [];
	if (oldReport.status !== newReport.status)
		changes.push(`status: ${oldReport.status} → ${newReport.status}`);
	if (oldReport.priority !== newReport.priority)
		changes.push(`priority: ${oldReport.priority} → ${newReport.priority}`);
	if (oldReport.title !== newReport.title) changes.push("title updated");
	if (oldReport.description !== newReport.description)
		changes.push("description updated");
	return changes.length ? changes.join(", ") : "no changes";
}

export function getDateObj(date: unknown): Date | null {
	if (!date) return null;
	if (typeof date === "string") {
		const d = new Date(date);
		return isNaN(d.getTime()) ? null : d;
	}
	if (
		typeof date === "object" &&
		date !== null &&
		"toDate" in date &&
		typeof (date as { toDate?: unknown }).toDate === "function"
	) {
		return (date as { toDate: () => Date }).toDate();
	}
	if (date instanceof Date) return date;
	return null;
}

export function hasToDate(obj: unknown): obj is { toDate: () => Date } {
	return (
		typeof obj === "object" &&
		obj !== null &&
		typeof (obj as { toDate?: unknown }).toDate === "function"
	);
}

export function getDateString(date: unknown): string {
	if (!date) return "";
	if (typeof date === "string") return date;
	if (hasToDate(date)) return date.toDate().toISOString();
	if (date instanceof Date) return date.toISOString();
	return "";
}
