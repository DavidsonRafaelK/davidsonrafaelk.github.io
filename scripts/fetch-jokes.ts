// Fetches fresh dad jokes / programmer jokes from public APIs and appends
// any new, non-duplicate entries to the content files. Run weekly via
// .github/workflows/jokes-fetcher.yml — safe to run manually with `bun run scripts/fetch-jokes.ts`.

const MAX_NEW_PER_RUN = 8;

function toStyle(text: string): string {
	return text.trim().replace(/\s+/g, " ").toLowerCase();
}

async function fetchDadJokes(): Promise<string[]> {
	const probe = await fetch("https://icanhazdadjoke.com/search?limit=30", {
		headers: { Accept: "application/json" },
	}).then((r) => r.json() as Promise<{ total_pages: number }>);

	const page = 1 + Math.floor(Math.random() * probe.total_pages);
	const res = await fetch(
		`https://icanhazdadjoke.com/search?limit=30&page=${page}`,
		{ headers: { Accept: "application/json" } },
	);
	const data = (await res.json()) as { results: { joke: string }[] };
	return data.results.map((r) => toStyle(r.joke));
}

async function fetchProgrammerJokes(): Promise<string[]> {
	const res = await fetch(
		"https://v2.jokeapi.dev/joke/Programming?type=single&amount=30&blacklistFlags=nsfw,religious,political,racist,sexist,explicit",
	);
	const data = (await res.json()) as {
		jokes?: { joke: string; safe: boolean }[];
	};
	return (data.jokes ?? []).filter((j) => j.safe).map((j) => toStyle(j.joke));
}

async function updateFile(path: string, exportName: string, fetched: string[]) {
	const absUrl = new URL(path, `file://${process.cwd()}/`).href;
	const mod = (await import(`${absUrl}?t=${Date.now()}`)) as Record<
		string,
		string[]
	>;
	const existing: string[] = mod[exportName] ?? [];
	const existingSet = new Set(existing.map((j) => j.toLowerCase()));

	const fresh: string[] = [];
	for (const joke of fetched) {
		if (fresh.length >= MAX_NEW_PER_RUN) break;
		if (existingSet.has(joke.toLowerCase())) continue;
		existingSet.add(joke.toLowerCase());
		fresh.push(joke);
	}

	if (fresh.length === 0) {
		console.log(`${path}: no new jokes`);
		return;
	}

	const all = [...existing, ...fresh];
	const body = all.map((j) => `\t${JSON.stringify(j)},`).join("\n");
	const content = `export const ${exportName}: string[] = [\n${body}\n];\n`;
	await Bun.write(path, content);
	console.log(`${path}: added ${fresh.length} new joke(s)`);
}

async function main() {
	const [dadJokes, programmerJokes] = await Promise.all([
		fetchDadJokes(),
		fetchProgrammerJokes(),
	]);

	await updateFile("apps/web/src/content/dad-jokes.ts", "dadJokes", dadJokes);
	await updateFile(
		"apps/web/src/content/programmer-jokes.ts",
		"programmerJokes",
		programmerJokes,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
