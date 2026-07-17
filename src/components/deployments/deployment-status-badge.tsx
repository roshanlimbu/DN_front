import { cn } from "@/lib/utils";
import type { DeploymentStatus } from "@/types";

const statusStyles: Record<DeploymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface DeploymentStatusBadgeProps {
  status: DeploymentStatus;
}

export function DeploymentStatusBadge({ status }: DeploymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
