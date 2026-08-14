"use client";

import { useState } from "react";

export function RandomLine({ lines }: { lines: readonly string[] }) {
	const [line] = useState(
		() => lines[Math.floor(Math.random() * lines.length)],
	);
	return <>{line}</>;
}
