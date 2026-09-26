"use client";

import { type SVGProps, useRef } from "react";
import { useNearViewport } from "@/components/use-near-viewport";

/**
 * An SVG `<use>` whose external `href` is only set once it nears the
 * viewport, so a below-the-fold sprite is not fetched during page load.
 */
export function DeferredUse({ href, ...props }: SVGProps<SVGUseElement>) {
	const ref = useRef<SVGUseElement>(null);
	const near = useNearViewport(ref, "600px");
	return <use ref={ref} href={near ? href : undefined} {...props} />;
}
