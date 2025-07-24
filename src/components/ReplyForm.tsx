import type { TCommentFormSchema } from "../lib/schema/commentSchema";
import { Box, Button, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface ReplyFormProps {
	onSubmit: (data: { text: string }) => Promise<void>;
	setReplyTo: (replyTo: string | null) => void;
}

const ReplyForm = ({ onSubmit, setReplyTo }: ReplyFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useFormContext<TCommentFormSchema>();
	return (
		<Box
			mt={1}
			display="flex"
			gap={1}
			component="form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="text"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						size="small"
						label="Reply"
						error={!!errors.text}
						helperText={errors.text?.message}
						fullWidth
					/>
				)}
			/>
			<Button
				type="submit"
				variant="contained"
				size="small"
				disabled={!!errors.text}
			>
				Post
			</Button>
			<Button
				size="small"
				onClick={() => {
					setReplyTo(null);
					reset();
				}}
			>
				Cancel
			</Button>
		</Box>
	);
};

export default ReplyForm;
