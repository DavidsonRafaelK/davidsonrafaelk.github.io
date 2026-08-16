import { Flex } from "@once-ui-system/core";
import { StackButton } from "@/components/stack-button";
import { stacksData } from "@/content/stacks";

const stackByLabel = new Map(
	stacksData.flatMap((category) =>
		category.items.map(
			(item) =>
				[
					item.label,
					{ ...item, color: item.color ?? category.parentColor },
				] as const,
		),
	),
);

/**
 * Renders a project's stack with the same chips as the skills section, so a case
 * study doesn't invent a second visual language for the same idea. Labels that
 * aren't in `content/stacks.ts` still get their logo from the icon registry,
 * they just have nothing to link to.
 */
export function ProjectStackRow({ stack }: { stack: string[] }) {
	return (
		<Flex fillWidth horizontal="start" vertical="center" wrap gap={0.8}>
			{stack.map((label) => {
				const known = stackByLabel.get(label);
				return (
					<StackButton
						key={label}
						url={known?.url}
						label={label}
						color={known?.color}
						overrideMediaUrl={known?.overrideMediaUrl}
					/>
				);
			})}
		</Flex>
	);
}
