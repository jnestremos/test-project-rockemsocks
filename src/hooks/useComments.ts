import { useEffect, useState, useCallback } from "react";
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	orderBy,
	where,
	Timestamp,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import type { Comment } from "../lib/interfaces";

export function useComments(parentId: string) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!parentId) return;
		const q = query(
			collection(db, "comments"),
			where("parentId", "==", parentId),
			orderBy("createdAt", "asc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const commentsData: Comment[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id || "",
						parentId: data.parentId,
						parentCommentId: data.parentCommentId,
						text: data.text,
						author: data.author,
						createdAt: data.createdAt?.toDate().toISOString() || "",
					};
				});
				setComments(commentsData);
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			}
		);
		return () => unsubscribe();
	}, [parentId]);

	const addComment = useCallback(
		async (comment: Omit<Comment, "id" | "createdAt">) => {
			try {
				await addDoc(collection(db, "comments"), {
					...comment,
					createdAt: Timestamp.now(),
				});
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Unknown error occurred");
			}
		},
		[]
	);

	const deleteComment = useCallback(async (id: string) => {
		try {
			const commentRef = doc(db, "comments", id);
			await deleteDoc(commentRef);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err.message);
			else setError("Unknown error occurred");
		}
	}, []);

	return { comments, loading, error, addComment, deleteComment };
}
