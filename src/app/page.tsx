import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-bold text-lg sm:text-xl">
            DeployNest
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: "sm" })}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          DeployNest — Self-hosted deployment platform
        </div>
      </footer>
    </>
  );
}
