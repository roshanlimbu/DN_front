"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectForm } from "@/components/projects/project-form";
import { api } from "@/lib/api";
import type { Project } from "@/types";

export default function ProjectSettingsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        const data = await api.get<{ project: Project }>(`/projects/${params.id}`);
        if (!cancelled) setProject(data.project);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load project";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleDelete() {
    if (!project) return;

    const confirmed = window.confirm(
      `Delete ${project.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete<{ message: string }>(`/projects/${project.id}`);
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/projects"
          className={buttonVariants({ variant: "ghost" })}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="rounded-lg border p-6 text-sm text-destructive">
          {error ?? "Project not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your project configuration.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete a project, there is no going back. All deployments
            and data will be permanently removed.
          </p>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
