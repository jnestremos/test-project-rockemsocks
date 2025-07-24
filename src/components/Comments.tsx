"use client";

import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	CircularProgress,
	Alert,
	IconButton,
} from "@mui/material";
import { useComments } from "../hooks/useComments";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { commentSchema } from "../lib/schema/commentSchema";
import type { TCommentFormSchema } from "../lib/schema/commentSchema";
import type { Comment } from "../lib/interfaces";
import CommentForm from "./CommentForm";
import ReplyForm from "./ReplyForm";
import { useAuthContext } from "../context/AppProvider";

interface CommentsProps {
	bugId: string;
}

const Comments: React.FC<CommentsProps> = ({ bugId }) => {
	const { comments, loading, error, addComment, deleteComment } =
		useComments(bugId);
	const [replyTo, setReplyTo] = useState<string | null>(null);
	const { user } = useAuthContext();

	// New comment form
	const commentForm = useForm<TCommentFormSchema>({
		defaultValues: { text: "", parentId: bugId },
		resolver: yupResolver(commentSchema),
	});

	// Reply form
	const replyForm = useForm<TCommentFormSchema>({
		defaultValues: { text: "", parentId: bugId },
		resolver: yupResolver(commentSchema),
	});

	const handleAddReply = async (data: { text: string }) => {
		if (!replyTo) return;
		await addComment({
			text: data.text,
			parentId: bugId,
			parentCommentId: replyTo,
			author: user?.displayName || user?.email || "Anonymous",
		});
		replyForm.reset();
		setReplyTo(null);
	};

	const handleAddComment = async (
		comment: Omit<Comment, "id" | "createdAt">
	) => {
		await addComment({
			...comment,
			author: user?.displayName || user?.email || "Anonymous",
		});
		commentForm.reset();
	};

	// Helper to build threaded structure
	const BuildThread: React.FC<{ parentId: string | null }> = ({ parentId }) =>
		comments
			.filter((c) =>
				parentId ? c.parentCommentId === parentId : !c.parentCommentId
			)
			.map((comment) => (
				<Box
					key={comment.id}
					mt={2}
					mb={2}
					ml={comment.parentCommentId ? 4 : 0}
				>
					<Typography variant="subtitle2">{comment.author}</Typography>
					<Typography variant="caption" color="text.secondary">
						{comment.createdAt
							? new Date(comment.createdAt).toLocaleString()
							: ""}
					</Typography>
					<IconButton size="small" onClick={() => deleteComment(comment.id!)}>
						<DeleteIcon fontSize="small" />
					</IconButton>
					<Button
						size="small"
						onClick={() => {
							setReplyTo(comment.id ?? "");
							replyForm.setValue("parentId", bugId);
							replyForm.setValue("parentCommentId", comment.id ?? "");
						}}
					>
						Reply
					</Button>
					<Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
						{comment.text}
					</Typography>
					{/* Render replies recursively */}
					<BuildThread parentId={comment.id ?? null} />
					{/* Reply form */}
					{replyTo === comment.id && (
						<FormProvider {...replyForm}>
							<ReplyForm onSubmit={handleAddReply} setReplyTo={setReplyTo} />
						</FormProvider>
					)}
				</Box>
			));

	return (
		<Box mt={2}>
			<Typography variant="subtitle1">Comments</Typography>
			{loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
			{error && (
				<Alert severity="error" sx={{ mt: 1 }}>
					{error}
				</Alert>
			)}
			{/* New comment form */}
			<FormProvider {...commentForm}>
				<CommentForm onSubmit={handleAddComment} />
			</FormProvider>
			{/* Threaded comments */}
			<Box mt={2}>
				<BuildThread parentId={null} />
			</Box>
		</Box>
	);
};

export default Comments;
