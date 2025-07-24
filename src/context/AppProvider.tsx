"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Report } from "../lib/interfaces";
import { useBugs } from "../hooks/useBugs";
import type { DocumentData, DocumentReference } from "firebase/firestore";
import { useFeatureRequests } from "../hooks/useFeatureRequests";
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	type User,
} from "firebase/auth";

interface AppContextType {
	tab: number;
	setTab: (tab: number) => void;
	editingBug: Report | null;
	setEditingBug: React.Dispatch<React.SetStateAction<Report | null>>;
	filter: { status: string; priority: string; sort: string };
	setFilter: React.Dispatch<
		React.SetStateAction<{ status: string; priority: string; sort: string }>
	>;
	editingFeature: Report | null;
	setEditingFeature: React.Dispatch<React.SetStateAction<Report | null>>;
	formOpen: boolean;
	setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedId: string | undefined;
	setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
	bugsData: {
		bugs: Report[];
		loading: boolean;
		error: string | null;
		createBug: (
			bug: Omit<Report, "id" | "date_created">
		) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
		updateBug: (id: string, updates: Partial<Report>) => Promise<void>;
		deleteBug: (id: string) => Promise<void>;
		fetchMore: () => Promise<void>;
		hasMore: boolean;
		reset: () => void;
	};
	featureRequestsData: {
		featureRequests: Report[];
		loading: boolean;
		error: string | null;
		createFeatureRequest: (
			featureRequest: Omit<Report, "id" | "date_created">
		) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
		updateFeatureRequest: (
			id: string,
			updates: Partial<Report>
		) => Promise<void>;
		deleteFeatureRequest: (id: string) => Promise<void>;
		fetchMore: () => Promise<void>;
		hasMore: boolean;
		reset: () => void;
	};
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [tab, setTab] = useState(0);

	const [filter, setFilter] = useState({
		status: "",
		priority: "",
		sort: "newest",
	});
	const bugsData = useBugs(filter);
	const featureRequestsData = useFeatureRequests();

	const [editingBug, setEditingBug] = useState<Report | null>(null);
	const [editingFeature, setEditingFeature] = useState<Report | null>(null);
	const [formOpen, setFormOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

	useEffect(() => {
		setSelectedId(undefined);
	}, [tab]);

	return (
		<AppContext.Provider
			value={{
				tab,
				setTab,
				editingBug,
				setEditingBug,
				filter,
				setFilter,
				editingFeature,
				setEditingFeature,
				formOpen,
				setFormOpen,
				selectedId,
				setSelectedId,
				bugsData: {
					...bugsData,
				},
				featureRequestsData: {
					...featureRequestsData,
				},
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export function useAppContext() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useAppContext must be used within AppProvider");
	return ctx;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, [auth]);

	const login = async (email: string, password: string) => {
		setLoading(true);
		await signInWithEmailAndPassword(auth, email, password);
		setLoading(false);
	};

	const logout = async () => {
		setLoading(true);
		await signOut(auth);
		setLoading(false);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuthContext() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
	return ctx;
}
