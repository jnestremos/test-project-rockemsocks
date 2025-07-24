import { PRIORTIES, STATUSES } from "./constants";

export type Priority = (typeof PRIORTIES)[number];

export type Status = (typeof STATUSES)[number];
