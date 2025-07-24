import type { Comment } from "../lib/interfaces";
import type { TCommentFormSchema } from "../lib/schema/commentSchema";
import { Box, Button, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface CommentFormProps {
	onSubmit: (comment: Omit<Comment, "id" | "createdAt">) => Promise<void>;
}

const CommentForm = ({ onSubmit }: CommentFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useFormContext<TCommentFormSchema>();
	return (
		<Box
			component="form"
			display="flex"
			gap={1}
			mt={2}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="text"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Add a comment"
						error={!!errors.text}
						helperText={errors.text?.message}
						fullWidth
						size="small"
					/>
				)}
			/>
			<Button type="submit" variant="contained" disabled={!!errors.text}>
				Post
			</Button>
		</Box>
	);
};

export default CommentForm;
