import React, { useRef, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAppContext } from "../context/AppProvider";
import ReportItem from "./ReportItem";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { filterAndSortReports } from "../utils/filterAndSortReports";

const ReportList: React.FC = () => {
	const {
		filter,
		tab,
		selectedId,
		setSelectedId,
		bugsData: {
			bugs,
			fetchMore: fetchMoreBugs,
			hasMore: hasMoreBugs,
			loading: loadingBugs,
		},
		featureRequestsData: {
			featureRequests,
			fetchMore: fetchMoreFeatures,
			hasMore: hasMoreFeatures,
			loading: loadingFeatures,
		},
	} = useAppContext();

	const filteredBugs = filterAndSortReports(bugs, filter);
	const filteredFeatures = filterAndSortReports(featureRequests, filter);

	const reports = tab === 0 ? filteredBugs : filteredFeatures;
	const loading = tab === 0 ? loadingBugs : loadingFeatures;

	const handleSelect = (id: string) => setSelectedId(id);

	// Infinite scroll logic for both bugs and feature requests
	const loaderRef = useRef<HTMLDivElement | null>(null);
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (tab === 0 && target.isIntersecting && hasMoreBugs && !loadingBugs) {
				fetchMoreBugs();
			}
			if (
				tab === 1 &&
				target.isIntersecting &&
				hasMoreFeatures &&
				!loadingFeatures
			) {
				fetchMoreFeatures();
			}
		},
		[
			fetchMoreBugs,
			hasMoreBugs,
			loadingBugs,
			fetchMoreFeatures,
			hasMoreFeatures,
			loadingFeatures,
			tab,
		]
	);
	useIntersectionObserver(loaderRef, handleObserver, {
		root: null,
		rootMargin: "0px",
		threshold: 0.1,
	});

	return (
		<Box position="relative">
			{loading && reports.length === 0 && (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					minHeight={200}
				>
					<CircularProgress size={32} />
				</Box>
			)}
			{!loading && reports.length === 0 && (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					minHeight={120}
				>
					{tab === 0 ? "No bugs added" : "No feature requests added"}
				</Box>
			)}
			{reports.map((report) => (
				<div
					key={report.id}
					onClick={() => handleSelect(report.id ?? "")}
					style={{ cursor: "pointer", marginBottom: 8 }}
				>
					<ReportItem report={report} selected={report.id === selectedId} />
				</div>
			))}
			{/* Spinner for fetching additional data (infinite scroll) */}
			{loading && reports.length > 0 && (
				<Box display="flex" justifyContent="center" py={2}>
					<CircularProgress size={24} />
				</Box>
			)}
			{/* Infinite scroll loader for bugs and feature requests (no spinner) */}
			{tab === 0 && hasMoreBugs && (
				<div ref={loaderRef} style={{ height: 40 }} />
			)}
			{tab === 1 && hasMoreFeatures && (
				<div ref={loaderRef} style={{ height: 40 }} />
			)}
		</Box>
	);
};

export default ReportList;
