"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LogViewerProps {
  logs: string[];
  streaming?: boolean;
}

export function LogViewer({ logs, streaming = false }: LogViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAutoScroll(isAtBottom);
  }

  return (
    <div className="rounded-lg border bg-black text-green-400 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-xs text-muted-foreground">Build Logs</span>
        {streaming && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Streaming
          </span>
        )}
      </div>
      <div
        className="h-80 overflow-y-auto p-4 space-y-1"
        onScroll={handleScroll}
      >
        {logs.length === 0 && (
          <p className="text-muted-foreground">Waiting for logs...</p>
        )}
        {logs.map((line, i) => (
          <div
            key={i}
            className={cn(
              line.startsWith("[DONE]") && "text-green-400 font-semibold",
              line.startsWith("[ERROR]") && "text-red-400",
              "whitespace-pre-wrap break-all"
            )}
          >
            <span className="opacity-50 mr-2">{String(i + 1).padStart(3, "0")}</span>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
