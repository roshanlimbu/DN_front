import { GitBranch, Container, Globe } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Git-Based Deployments",
    description:
      "Connect any Git repository, choose your branch, and deploy with a single click. Automatic builds from your source code.",
  },
  {
    icon: Container,
    title: "Docker Containerization",
    description:
      "Every deployment runs in an isolated Docker container. Consistent environments, dependency management, and easy scaling.",
  },
  {
    icon: Globe,
    title: "Subdomain Routing",
    description:
      "Each deployment gets its own subdomain automatically. Caddy reverse proxy handles routing with automatic SSL.",
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-t">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-16">
          How DeployNest works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6 space-y-4"
            >
              <div className="p-3 rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
