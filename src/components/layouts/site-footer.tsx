import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// Signature/sign-off footer: name outline that reveals a gradient fill on cursor hover.
export function SiteFooter() {
  return (
    <footer className="flex h-[14rem] w-full items-center justify-center bg-zinc-50 sm:h-[20rem] md:h-[28rem] lg:h-[40rem] dark:bg-black">
      <TextHoverEffect text="Davidson" automatic={true} />
    </footer>
  );
}
