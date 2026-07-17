"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Settings, Rocket, GitBranch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { Deployment, Project } from "@/types";
import { DeploymentCard } from "@/components/deployments/deployment-card";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        const [projectData, deploymentData] = await Promise.all([
          api.get<{ project: Project }>(`/projects/${params.id}`),
          api.get<{ deployments: Deployment[] }>(`/projects/${params.id}/deployments`),
        ]);
        if (!cancelled) {
          setProject(projectData.project);
          setDeployments(deploymentData.deployments);
        }
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

  async function handleDeploy() {
    if (!project || deploying) return;

    setDeploying(true);
    try {
      const data = await api.post<{ deployment: Deployment }>(
        `/projects/${project.id}/deployments`,
        {},
      );
      toast.success("Deployment queued");
      router.push(`/dashboard/deployments/${data.deployment.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to queue deployment");
      setDeploying(false);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>{project.branch}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDeploy} disabled={deploying}>
            {deploying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            {deploying ? "Queuing" : "Deploy"}
          </Button>
          <Link
            href={`/dashboard/projects/${project.id}/settings`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Repository</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="break-all">{project.repoUrl}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>No variables configured.</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Deployments</h2>
        {deployments.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {deployments.map((deployment) => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border bg-muted/10">
            <p className="text-sm text-muted-foreground">No deployments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
