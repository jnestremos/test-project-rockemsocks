import { useCallback } from "react";
import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	Timestamp,
} from "firebase/firestore";
import { usePaginatedFirestoreCollection } from "./usePaginatedFirestoreCollection";
import type { Report } from "../lib/interfaces";
import { db } from "../utils/firebaseConfig";

const PAGE_SIZE = 5;

export function useFeatureRequests() {
	const {
		data: featureRequests,
		loading,
		error,
		fetchMore,
		hasMore,
		reset,
	} = usePaginatedFirestoreCollection<Report>({
		collectionName: "feature-requests",
		pageSize: PAGE_SIZE,
	});

	const createFeatureRequest = useCallback(
		async (feature: Omit<Report, "id" | "date_created">) => {
			return await addDoc(collection(db, "feature-requests"), {
				...feature,
				date_created: Timestamp.now(),
			});
		},
		[]
	);

	const updateFeatureRequest = useCallback(
		async (id: string, updates: Partial<Report>) => {
			const featureRef = doc(db, "feature-requests", id);
			await updateDoc(featureRef, updates);
		},
		[]
	);

	const deleteFeatureRequest = useCallback(async (id: string) => {
		const featureRef = doc(db, "feature-requests", id);
		await deleteDoc(featureRef);
	}, []);

	return {
		featureRequests,
		loading,
		error,
		fetchMore,
		hasMore,
		reset,
		createFeatureRequest,
		updateFeatureRequest,
		deleteFeatureRequest,
	};
}
