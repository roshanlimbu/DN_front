import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="max-w-5xl mx-auto flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="font-bold text-lg sm:text-xl">
            DeployNest
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
