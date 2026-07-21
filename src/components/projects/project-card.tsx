"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Trash2, Loader2 } from "lucide-react";
import { DeploymentStatusBadge } from "@/components/deployments/deployment-status-badge";
import type { Project } from "@/types";
import { api } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
  onDeleted?: (id: number) => void;
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const lastDeployment = project.deployments?.[0];
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      onDeleted?.(project.id);
    } catch (err) {
      console.error("Failed to delete project", err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="transition-colors hover:bg-muted/50 relative group">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className="flex items-center gap-2">
            {lastDeployment && <DeploymentStatusBadge status={lastDeployment.status} />}
            <Button
              id={`delete-project-${project.id}`}
              variant={confirmDelete ? "destructive" : "ghost"}
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={handleDelete}
              disabled={deleting}
              title={confirmDelete ? "Click again to confirm delete" : "Delete project"}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <span className="truncate">{project.repoUrl}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Branch: {project.branch}
          </p>
          {confirmDelete && (
            <p className="mt-2 text-xs text-destructive font-medium animate-pulse">
              Click the trash icon again to confirm deletion
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
