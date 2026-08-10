// Scratch file for testing the claude-pr-review.yml GitHub Action.
// Safe to delete after the test PR is closed.
import { exec } from "node:child_process";

export function runLookup(hostname: string) {
  // Intentional command injection bug — used to verify the review bot flags it.
  exec(`nslookup ${hostname}`, (err, stdout) => {
    console.log(stdout);
  });
}

const AWS_SECRET_ACCESS_KEY = "AKIAABCDEFGHIJKLMNOP";
