import { useEffect } from "react";
import type { RefObject } from "react";

export function useIntersectionObserver(
	ref: RefObject<Element | null>,
	callback: (entries: IntersectionObserverEntry[]) => void,
	options?: IntersectionObserverInit
) {
	useEffect(() => {
		if (!ref.current) return;
		const observer = new window.IntersectionObserver(callback, options);
		observer.observe(ref.current);
		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref.current, callback, options]);
}
