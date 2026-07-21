import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeploymentStatusBadge } from "./deployment-status-badge";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Calendar } from "lucide-react";
import type { Deployment } from "@/types";
import { useState } from "react";
import { api } from "@/lib/api";

interface DeploymentCardProps {
  deployment: Deployment;
  onDeleted?: (id: number) => void;
}

export function DeploymentCard({ deployment, onDeleted }: DeploymentCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/deployments/${deployment.id}`);
      onDeleted?.(deployment.id);
    } catch (err) {
      console.error("Failed to queue deployment deletion", err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  }
  return (
    <Link href={`/dashboard/deployments/${deployment.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Deployment #{deployment.id}
          </CardTitle>
          <div className="flex items-center gap-2">
            <DeploymentStatusBadge status={deployment.status} />
            <Button
              variant={confirmDelete ? "destructive" : "ghost"}
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={handleDelete}
              disabled={deleting}
              title={confirmDelete ? "Click again to confirm delete" : "Delete deployment"}
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
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(deployment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {deployment.domain && (
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {deployment.domain}
            </p>
          )}
          {confirmDelete && (
            <p className="mt-2 text-xs text-destructive font-medium animate-pulse">
              Click the trash icon again to queue deletion
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
