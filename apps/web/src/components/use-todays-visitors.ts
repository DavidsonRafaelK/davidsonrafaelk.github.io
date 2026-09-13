"use client";

import { useEffect, useState } from "react";
import { fetchInsights } from "@/data/insights";

export function useInsightsTotal(): number {
	const [total, setTotal] = useState(0);

	useEffect(() => {
		let active = true;

		fetchInsights()
			.then((items) => {
				const today = items[items.length - 1];
				if (today && active) setTotal(today.visitors);
			})
			.catch(() => {});

		return () => {
			active = false;
		};
	}, []);

	return total;
}
