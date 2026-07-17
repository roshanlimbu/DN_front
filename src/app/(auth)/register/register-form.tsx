"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { User } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const data = await api.post<{ token: string; user: User }>("/auth/register", {
        username: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
