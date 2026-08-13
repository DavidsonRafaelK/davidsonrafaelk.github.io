// Reads the LHCI manifest.json produced by treosh/lighthouse-ci-action
// (resultsPath output) and writes a markdown report to /tmp/lighthouse-body.md
// if any category score falls below MIN_SCORE. Exits 0 either way — the
// workflow decides whether to file/update an issue based on the file's presence.

import {
	appendFileSync,
	existsSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

function setOutput(name, value) {
	if (process.env.GITHUB_OUTPUT) {
		appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
	}
}

const resultsPath = process.env.RESULTS_PATH;
const minScore = Number(process.env.MIN_SCORE ?? "80") / 100;
const siteUrl = process.env.SITE_URL ?? "";

const manifestPath = join(resultsPath ?? "", "manifest.json");
if (!resultsPath || !existsSync(manifestPath)) {
	console.log("No Lighthouse manifest found, skipping.");
	process.exit(0);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const run = manifest.find((r) => r.isRepresentativeRun) ?? manifest[0];
if (!run) {
	console.log("No Lighthouse run data, skipping.");
	process.exit(0);
}

const failing = Object.entries(run.summary).filter(
	([, score]) => score < minScore,
);

if (failing.length === 0) {
	console.log("All categories >= threshold:", run.summary);
	process.exit(0);
}

const lines = Object.entries(run.summary)
	.map(([cat, score]) => `- ${cat}: ${Math.round(score * 100)}`)
	.join("\n");

writeFileSync(
	"/tmp/lighthouse-body.md",
	`Lighthouse scores for ${siteUrl} dropped below ${minScore * 100}:\n\n${lines}\n\nReport: ${run.url ?? "see workflow artifact"}\n`,
);
setOutput("regressed", "true");
