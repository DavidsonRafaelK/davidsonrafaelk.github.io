import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  { ssr: false },
);

export function GithubActivity({ username }: { username: string }) {
  return (
    <div className="mt-12 w-full overflow-x-auto">
      <GitHubCalendar username={username} colorScheme="light" fontSize={12} />
    </div>
  );
}
