import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoadingJobPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
      {/* LEFT SIDE (Main Content) */}
      <div className="space-y-8 lg:col-span-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-9 w-[300px] mb-2" />
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Job Description */}
        <section className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${
                i % 3 === 0 ? "w-3/4" : i % 4 === 0 ? "w-5/6" : "w-full"
              }`}
            />
          ))}
        </section>

        {/* Benefits Section */}
        <section>
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-[140px] rounded-full" />
            ))}
          </div>
        </section>
      </div>

      {/* RIGHT SIDE (Sidebar) */}
      <div className="space-y-6 w-full">
        {/* Apply Now Card */}
        <Card className="p-6 w-full">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-[140px] mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>

        {/* About Job - Details */}
        <Card className="p-6 w-full">
          <Skeleton className="h-6 w-[180px] mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between mb-2">
              <Skeleton className="h-4 w-[130px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          ))}
        </Card>

        {/* Company Card */}
        <Card className="p-6 w-full">
          <div className="flex items-center gap-3">
            <Skeleton className="rounded-full size-12" />
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
