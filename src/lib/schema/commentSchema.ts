import * as yup from "yup";

export const commentSchema = yup.object({
	text: yup.string().required("Comment is required"),
	parentId: yup.string().required(),
	parentCommentId: yup.string().optional().default(""),
	author: yup.string().optional().default(""),
});

export type TCommentFormSchema = yup.InferType<typeof commentSchema>;
