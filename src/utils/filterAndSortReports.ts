import type { Report } from "../lib/interfaces";
import { getDateString } from ".";

export type ReportFilter = {
	status: string;
	priority: string;
	sort: string;
};

export function filterAndSortReports<T extends Report>(
	reports: T[],
	filter: ReportFilter
): T[] {
	return reports
		.filter(
			(item) =>
				(filter.status ? item.status === filter.status : true) &&
				(filter.priority ? item.priority === filter.priority : true)
		)
		.sort((a, b) => {
			const aDate = getDateString(a.date_created);
			const bDate = getDateString(b.date_created);
			if (filter.sort === "newest") {
				return bDate.localeCompare(aDate);
			} else {
				return aDate.localeCompare(bDate);
			}
		});
}
