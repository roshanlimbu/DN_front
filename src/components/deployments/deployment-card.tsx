import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeploymentStatusBadge } from "./deployment-status-badge";
import { Calendar } from "lucide-react";
import type { Deployment } from "@/types";

interface DeploymentCardProps {
  deployment: Deployment;
}

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  return (
    <Link href={`/dashboard/deployments/${deployment.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Deployment #{deployment.id}
          </CardTitle>
          <DeploymentStatusBadge status={deployment.status} />
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
        </CardContent>
      </Card>
    </Link>
  );
}
