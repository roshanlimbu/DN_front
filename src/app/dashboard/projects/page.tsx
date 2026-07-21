"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Plus, FolderGit2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Project } from "@/types";
import { ProjectCard } from "@/components/projects/project-card";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const data = await api.get<{ projects: Project[] }>("/projects");
        if (!cancelled) setProjects(data.projects);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load projects";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your connected Git repositories.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className={cn(buttonVariants(), "gap-2 w-full sm:w-auto justify-center")}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center border rounded-lg bg-muted/10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center border rounded-lg bg-muted/10 text-sm text-destructive">
          {error}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
          <FolderGit2 className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            No projects yet.
          </p>
          <Link
            href="/dashboard/projects/new"
            className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
          >
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
}
