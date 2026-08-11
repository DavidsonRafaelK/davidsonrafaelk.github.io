"use client";
import posthog from "posthog-js";
import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarButton,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26";

export function NavBar() {
  // Each `link` must match a section `id` in page.tsx, or the anchor scroll does nothing.
  const navItems = [
    {
      name: "About Me",
      link: "#about-me",
    },
    {
      name: "Skills & Stacks",
      link: "#skills-and-stacks",
    },
    {
      name: "Works",
      link: "#work-and-education",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <span className="font-bold tracking-tight">Davidson Rafael</span>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <ThemeToggleButton variant="rectangle" start="bottom-up" />
            <NavbarButton
              onClick={() => posthog.capture("portfolio_call_requested")}
              variant="primary"
            >
              Book a call
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <span className="font-bold tracking-tight">Davidson Rafael</span>
            <div className="flex items-center gap-2">
              <ThemeToggleButton variant="rectangle" start="bottom-up" />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item) => (
              <a
                key={item.link}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => {
                  posthog.capture("portfolio_call_requested");
                  setIsMobileMenuOpen(false);
                }}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
