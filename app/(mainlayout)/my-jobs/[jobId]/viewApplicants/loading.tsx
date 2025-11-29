import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoadingApplicants() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[300px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-8 gap-4">
            {[
              "First Name",
              "Last Name",
              "About",
              "Resume",
              "Alma Matter",
              "Email",
              "Contact",
              "Action",
            ].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>

          {/* Table Body Skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4 items-center">
              {Array.from({ length: 8 }).map((_, j) => (
                <Skeleton key={j} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
