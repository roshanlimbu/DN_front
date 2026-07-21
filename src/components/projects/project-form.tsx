"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Database } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Project, DatabaseEngine } from "@/types";

interface EnvVar {
  key: string;
  value: string;
}

type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [dbEnabled, setDbEnabled] = useState(Boolean(project?.database));
  const [dbEngine, setDbEngine] = useState<DatabaseEngine>(
    project?.database?.engine ?? "mysql"
  );
  const isEditing = Boolean(project);

  function addEnvVar() {
    setEnvVars([...envVars, { key: "", value: "" }]);
  }

  function removeEnvVar(index: number) {
    setEnvVars(envVars.filter((_, i) => i !== index));
  }

  function updateEnvVar(
    index: number,
    field: keyof EnvVar,
    value: string
  ) {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: value };
    setEnvVars(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      repoUrl: form.get("repoUrl"),
      branch: form.get("branch"),
      appType: form.get("appType"),
      environmentVariables: envVars.filter((env) => env.key.trim()),
      database: dbEnabled
        ? { enabled: true, engine: dbEngine }
        : undefined,
    };

    try {
      if (project) {
        const data = await api.put<{ project: Project }>(
          `/projects/${project.id}`,
          payload,
        );
        toast.success("Project updated successfully");
        router.push(`/dashboard/projects/${data.project.id}`);
        router.refresh();
      } else {
        const data = await api.post<{ project: Project }>("/projects", payload);
        toast.success("Project created successfully");
        router.push(`/dashboard/projects/${data.project.id}`);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save project";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="my-awesome-app"
            defaultValue={project?.name ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appType">Application Type</Label>
          <Select name="appType" defaultValue={project?.appType ?? "laravel"}>
            <SelectTrigger id="appType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laravel">Laravel</SelectItem>
              <SelectItem value="dockerfile">Dockerfile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            name="repoUrl"
            placeholder="https://github.com/user/repo.git"
            defaultValue={project?.repoUrl ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            name="branch"
            placeholder="main"
            defaultValue={project?.branch ?? "main"}
            required
          />
        </div>
      </div>

      {/* Database Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <Label>Database</Label>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dbEnabled}
            onClick={() => setDbEnabled(!dbEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              dbEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                dbEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {dbEnabled && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="dbEngine">Database Engine</Label>
              <Select
                value={dbEngine}
                onValueChange={(value) => setDbEngine(value as DatabaseEngine)}
              >
                <SelectTrigger id="dbEngine" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL 8</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL 16</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              A database will be automatically provisioned with your deployment.
              Connection credentials will be injected as environment variables
              (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD).
            </p>
          </div>
        )}
      </div>

      {/* Environment Variables Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Environment Variables</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEnvVar}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Variable
          </Button>
        </div>
        {envVars.map((env, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`env-key-${index}`} className="sr-only">
                Key
              </Label>
              <Input
                id={`env-key-${index}`}
                placeholder="KEY"
                value={env.key}
                onChange={(e) => updateEnvVar(index, "key", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={`env-value-${index}`} className="sr-only">
                Value
              </Label>
              <Input
                id={`env-value-${index}`}
                placeholder="value"
                value={env.value}
                onChange={(e) => updateEnvVar(index, "value", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeEnvVar(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {envVars.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No environment variables configured.
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  );
}
