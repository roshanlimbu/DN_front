export type DeploymentStatus =
  | "pending"
  | "running"
  | "success"
  | "failed";

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

export interface Project {
  id: number;
  name: string;
  repoUrl: string;
  branch: string;
  appType: "laravel" | "dockerfile";
  userId: number;
  createdAt?: string;
  deployments?: Deployment[];
  environmentVariables?: EnvironmentVariable[];
}

export interface Deployment {
  id: number;
  projectId: number;
  projectName: string;
  status: DeploymentStatus;
  containerId: string | null;
  port: number | null;
  domain: string | null;
  logs: string | null;
  createdAt: string;
}

export interface DeploymentLog {
  id: number;
  deploymentId: number;
  message: string;
  createdAt: string;
}

export interface EnvironmentVariable {
  id: string;
  projectId: string;
  key: string;
  value: string;
}

export interface CreateProjectInput {
  name: string;
  repoUrl: string;
  branch: string;
  appType: "laravel" | "dockerfile";
  environmentVariables?: { key: string; value: string }[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}
