import { useEffect, useState, useCallback } from "react";
import {
	collection,
	addDoc,
	onSnapshot,
	query,
	orderBy,
	where,
	Timestamp,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import type { AuditLogEntry } from "../lib/interfaces";

export function useAuditLog(parentId?: string) {
	const [log, setLog] = useState<AuditLogEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!parentId) return;
		const q = query(
			collection(db, "history"),
			where("parentId", "==", parentId),
			orderBy("date_created", "desc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const logData: AuditLogEntry[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id || "",
						parentId: data.parentId,
						description: data.description,
						user: data.user,
						date_created: data.date_created?.toDate().toISOString() || "",
					};
				});
				setLog(logData);
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			}
		);
		return () => unsubscribe();
	}, [parentId]);

	const addLogEntry = useCallback(
		async (entry: Omit<AuditLogEntry, "id" | "date_created">) => {
			try {
				await addDoc(collection(db, "history"), {
					...entry,
					date_created: Timestamp.now(),
				});
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Unknown error occurred");
			}
		},
		[]
	);

	return { log, loading, error, addLogEntry };
}
