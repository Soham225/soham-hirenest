import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoadingApplicantDetails() {
  return (
    <div className="space-y-6">
      <Card>
        {/* Header Skeleton */}
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px]" />
          </CardDescription>
        </CardHeader>

        <Separator className="my-4" />

        <CardContent className="space-y-6">
          {/* Grid Skeleton for Names, Alma Matter, Contact, Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-row gap-4 items-center">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[150px]" />
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* About Section Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-[180px]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          <Separator className="my-4" />

          {/* Resume iframe Skeleton */}
          <Skeleton className="h-[600px] w-full" />
        </CardContent>
      </Card>

      {/* Back Button Skeleton */}
      <div className="mt-4 mb-3">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
