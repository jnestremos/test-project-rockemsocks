import { useEffect, useState, useCallback, useRef } from "react";
import type {
	QueryDocumentSnapshot,
	QuerySnapshot,
	DocumentData,
	Query,
} from "firebase/firestore";
import {
	collection,
	onSnapshot,
	query as fbQuery,
	orderBy,
	limit as fbLimit,
	startAfter,
	getDocs,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export function usePaginatedFirestoreCollection<T = unknown>({
	collectionName,
	buildQuery,
	pageSize = 5,
}: {
	collectionName: string;
	buildQuery?: (
		q: Query<DocumentData, DocumentData>
	) => Query<DocumentData, DocumentData>;
	pageSize?: number;
}) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
	const unsubscribeRef = useRef<() => void>(() => {});

	// Initial load with real-time updates
	useEffect(() => {
		setLoading(true);
		let q: Query<DocumentData, DocumentData> = fbQuery(
			collection(db, collectionName),
			orderBy("date_created", "desc"),
			fbLimit(pageSize)
		);
		if (buildQuery) q = buildQuery(q);
		const unsubscribe = onSnapshot(
			q,
			(snapshot: QuerySnapshot<DocumentData>) => {
				const docsData = snapshot.docs.map(
					(doc: QueryDocumentSnapshot<DocumentData>) =>
						({ id: doc.id, ...doc.data() } as T)
				);
				setData(docsData);
				lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] || null;
				setHasMore(snapshot.docs.length === pageSize);
				setLoading(false);
			},
			(err: { message: string }) => {
				setError(err.message);
				setLoading(false);
			}
		);
		unsubscribeRef.current = unsubscribe;
		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionName, buildQuery, pageSize]);

	// Fetch more for infinite scroll (no real-time updates for next pages)
	const fetchMore = useCallback(async () => {
		if (!lastDocRef.current || !hasMore) return;
		setLoading(true);
		try {
			let q: Query<DocumentData, DocumentData> = fbQuery(
				collection(db, collectionName),
				orderBy("date_created", "desc"),
				startAfter(lastDocRef.current!),
				fbLimit(pageSize)
			);
			if (buildQuery) q = buildQuery(q);
			const snapshot = await getDocs(q);
			const newData: T[] = snapshot.docs.map(
				(doc: QueryDocumentSnapshot<DocumentData>) =>
					({ id: doc.id, ...doc.data() } as T)
			);
			setData((prev) => [...prev, ...newData]);
			lastDocRef.current =
				snapshot.docs[snapshot.docs.length - 1] || lastDocRef.current;
			setHasMore(snapshot.docs.length === pageSize);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Unknown error occurred");
		} finally {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collectionName, buildQuery, hasMore, pageSize]);

	const reset = useCallback(() => {
		setData([]);
		setHasMore(true);
		lastDocRef.current = null;
		if (unsubscribeRef.current) unsubscribeRef.current();
	}, []);

	return {
		data,
		loading,
		error,
		fetchMore,
		hasMore,
		reset,
	};
}
