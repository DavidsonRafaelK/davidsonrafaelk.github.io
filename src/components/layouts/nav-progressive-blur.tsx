import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";

// Fades page content as it scrolls past the bottom of the viewport.
export function NavProgressiveBlur() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-28">
      <ProgressiveBlur
        position="bottom"
        backgroundColor="#fafafa"
        height="100%"
        className="dark:hidden"
      />
      <ProgressiveBlur
        position="bottom"
        backgroundColor="#000000"
        height="100%"
        className="hidden dark:block"
      />
    </div>
  );
}
