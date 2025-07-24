import type { Priority, Status } from "./types";

export interface Report {
	id?: string;
	title: string;
	description: string;
	priority: Priority;
	status: Status;
	date_created?: string;
}

export interface AuditLogEntry {
	id?: string;
	parentId: string; // bug or feature id
	description: string;
	user?: string;
	date_created?: string;
}

export interface Comment {
	id?: string;
	parentId: string; // bug or feature id
	parentCommentId?: string; // for threading
	text: string;
	author?: string;
	createdAt?: string;
}
