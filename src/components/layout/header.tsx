"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Link href="/dashboard" className="font-bold text-lg md:hidden">
        DeployNest
      </Link>
      <div className="flex-1" />
    </header>
  );
}
