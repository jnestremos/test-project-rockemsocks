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

type BugFilter = {
	status: string;
	priority: string;
	sort: string;
};

export function useBugs(_filter: BugFilter) {
	const {
		data: bugs,
		loading,
		error,
		fetchMore,
		hasMore,
		reset,
	} = usePaginatedFirestoreCollection<Report>({
		collectionName: "bug-reports",
		pageSize: PAGE_SIZE,
	});

	const createBug = useCallback(
		async (bug: Omit<Report, "id" | "date_created">) => {
			return await addDoc(collection(db, "bug-reports"), {
				...bug,
				date_created: Timestamp.now(),
			});
		},
		[]
	);

	const updateBug = useCallback(
		async (id: string, updates: Partial<Report>) => {
			const bugRef = doc(db, "bug-reports", id);
			await updateDoc(bugRef, updates);
		},
		[]
	);

	const deleteBug = useCallback(async (id: string) => {
		const bugRef = doc(db, "bug-reports", id);
		await deleteDoc(bugRef);
	}, []);

	return {
		bugs,
		loading,
		error,
		fetchMore,
		hasMore,
		reset,
		createBug,
		updateBug,
		deleteBug,
	};
}
