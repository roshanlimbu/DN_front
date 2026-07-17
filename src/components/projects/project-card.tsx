import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { DeploymentStatusBadge } from "@/components/deployments/deployment-status-badge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const lastDeployment = project.deployments?.[0];

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          {lastDeployment && <DeploymentStatusBadge status={lastDeployment.status} />}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <span className="truncate">{project.repoUrl}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Branch: {project.branch}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
