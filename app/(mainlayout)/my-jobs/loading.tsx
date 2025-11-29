import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingMyJobs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Table Skeleton */}
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 py-2 border-b">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-10 justify-self-end" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 py-3 border-b items-center"
            >
              {/* Logo */}
              <Skeleton className="h-10 w-10 rounded-md" />

              {/* Company Name */}
              <Skeleton className="h-4 w-28" />

              {/* Job Title */}
              <Skeleton className="h-4 w-36" />

              {/* Status */}
              <Skeleton className="h-4 w-20" />

              {/* Created Date */}
              <Skeleton className="h-4 w-28" />

              {/* Actions */}
              <Skeleton className="h-8 w-8 rounded-md justify-self-end" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
