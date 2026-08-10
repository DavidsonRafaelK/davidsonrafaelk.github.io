import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// Signature/sign-off footer: name outline that reveals a gradient fill on cursor hover.
export function SiteFooter() {
  return (
    <footer className="flex h-[40rem] w-full items-center justify-center bg-zinc-50 dark:bg-black">
      <TextHoverEffect text="Davidson" automatic={true} />
    </footer>
  );
}
