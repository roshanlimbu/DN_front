"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ExternalLink, Loader2, Square, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeploymentStatusBadge } from "@/components/deployments/deployment-status-badge";
import { LogViewer } from "@/components/deployments/log-viewer";
import { api } from "@/lib/api";
import type { Deployment, DeploymentLog } from "@/types";

const ACTIVE_STATUSES = new Set(["pending", "running"]);

export default function DeploymentDetailPage() {
  const params = useParams<{ id: string }>();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeployment = useCallback(async (): Promise<[Deployment | null, DeploymentLog[]]> => {
    if (!params?.id || params.id === "undefined") return [null, []];
    const [deploymentData, logData] = await Promise.all([
      api.get<{ deployment: Deployment }>(`/deployments/${params.id}`),
      api.get<{ logs: DeploymentLog[] }>(`/deployments/${params.id}/logs`),
    ]);
    return [deploymentData.deployment, logData.logs];
  }, [params?.id]);

  useEffect(() => {
    let cancelled = false;

    if (!params?.id || params.id === "undefined") return;

    fetchDeployment()
      .then(([nextDeployment, nextLogs]) => {
        if (!cancelled && nextDeployment) {
          setDeployment(nextDeployment);
          setLogs(nextLogs);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load deployment");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchDeployment, params?.id]);

  const deploymentStatus = deployment?.status;
  useEffect(() => {
    if (!deploymentStatus || !ACTIVE_STATUSES.has(deploymentStatus)) return;

    const interval = window.setInterval(() => {
      fetchDeployment()
        .then(([nextDeployment, nextLogs]) => {
          if (nextDeployment) setDeployment(nextDeployment);
          if (nextLogs) setLogs(nextLogs);
        })
        .catch(() => undefined);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [deploymentStatus, fetchDeployment]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/projects" className={buttonVariants({ variant: "ghost" })}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="rounded-lg border p-6 text-sm text-destructive">
          {error ?? "Deployment not found"}
        </div>
      </div>
    );
  }

  const router = useRouter();
  const [stopping, setStopping] = useState(false);

  async function handleStop() {
    if (!deployment || stopping) return;
    const confirmed = window.confirm(`Stop and remove Deployment #${deployment.id}?`);
    if (!confirmed) return;

    setStopping(true);
    try {
      await api.delete(`/deployments/${deployment.id}`);
      router.push(`/dashboard/projects/${deployment.projectId}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to stop deployment");
      setStopping(false);
    }
  }

  const appUrl = deployment.domain;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/projects/${deployment.projectId}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Deployment #{deployment.id}
              </h1>
              <DeploymentStatusBadge status={deployment.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Project: {deployment.projectName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {appUrl ? (
            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open App
            </a>
          ) : (
            <Button variant="outline" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open App
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleStop}
            disabled={stopping}
          >
            {stopping ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Square className="mr-2 h-4 w-4 fill-current" />
            )}
            {stopping ? "Stopping" : "Stop Deployment"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Container ID</CardTitle></CardHeader>
          <CardContent className="break-all font-mono text-sm">
            {deployment.containerId ?? "Not assigned"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Port</CardTitle></CardHeader>
          <CardContent className="font-mono text-sm">
            {deployment.port ?? "Not assigned"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Created</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {new Date(deployment.createdAt).toLocaleString()}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Build Logs</CardTitle></CardHeader>
        <CardContent>
          <LogViewer
            logs={(logs ?? []).map((log) => log.message)}
            streaming={ACTIVE_STATUSES.has(deployment.status)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
