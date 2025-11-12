import { cn } from "@/lib/utils";

// Lightweight Skeleton component for React + Vite (no Next.js required)
// Usage: <Skeleton className="h-4 w-40" /> or compose multiple blocks for complex placeholders.
function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
}

export { Skeleton };
