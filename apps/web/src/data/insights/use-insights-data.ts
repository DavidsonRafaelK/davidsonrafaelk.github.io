"use client";

import { useEffect, useState } from "react";
import { fetchInsights } from "./fetch-insights";
import type { InsightsDay } from "./types";

export function useInsightsData() {
	const [data, setData] = useState<InsightsDay[]>([]);
	const [status, setStatus] = useState<"loading" | "ready">("loading");

	useEffect(() => {
		let active = true;

		fetchInsights()
			.then((items) => {
				if (!active) return;
				setData(items);
				setStatus("ready");
			})
			.catch(() => {
				if (!active) return;
				setData([]);
				setStatus("ready");
			});

		return () => {
			active = false;
		};
	}, []);

	return { data, status };
}
