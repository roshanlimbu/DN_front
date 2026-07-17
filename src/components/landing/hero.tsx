import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Deploy apps from{" "}
            <span className="text-primary">Git to Docker</span> in one click
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Self-hosted deployment platform that automates building, containerizing,
            and running your web applications on your own VPS.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "gap-2 w-full sm:w-auto justify-center")}
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto justify-center")}
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
