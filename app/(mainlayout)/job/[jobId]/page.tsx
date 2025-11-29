import { SaveJobPost, unSaveJobPost } from "@/app/utils/action";
import arcjet, { detectBot, tokenBucket } from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countryList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/ListOfBenefits";
import { SaveJobButton } from "@/components/general/GeneralSubmitButton";
import { JsonToHtml } from "@/components/general/jsonToHtml";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      })
    );
  }
}

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob, isapplied] = await Promise.all([
    await prisma.jobPost.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        jobDescription: true,
        jobTitle: true,
        employmentType: true,
        location: true,
        createdAt: true,
        benefits: true,
        listingDuration: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),

    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            UserId_jobPostId: {
              jobPostId: jobId,
              UserId: userId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,

    userId
      ? await prisma.applicationDetails.findUnique({
          where: {
            userId_jobPostId: {
              userId: userId,
              jobPostId: jobId,
            },
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }
  return { jobData, savedJob, isapplied };
}

type Params = Promise<{ jobId: string }>;

export default async function jobIdPage({ params }: { params: Params }) {
  const session = await auth();

  const { jobId } = await params;

  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const {
    jobData: data,
    savedJob,
    isapplied,
  } = await getJob(jobId, session?.user?.id);

  const flag = getFlagEmoji(data.location);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
      <div className="space-y-8 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.jobTitle}</h1>

            <div className="flex items-center gap-2 mt-3">
              <p className="font-medium">{data.employmentType}</p>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full">
                {flag && <span className="mr-1">{flag}</span>}
                {data.location}
              </Badge>
            </div>
          </div>

          {session?.user ? (
            <form
              action={
                savedJob
                  ? unSaveJobPost.bind(null, savedJob.id)
                  : SaveJobPost.bind(null, jobId)
              }
            >
              <SaveJobButton saveJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href={"/login"}
              className={buttonVariants({ variant: "outline" })}
            >
              <Heart className="size-4" />
              Save Job
            </Link>
          )}
        </div>
        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>
        <section>
          <h3 className="mb-3 font-semibold">
            Benefits{" "}
            <span className="text-sm text-muted-foreground font-normal">
              (green is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                  variant={isOffered ? "default" : "outline"}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <div className="space-y-6 w-full">
        <Card className="p-6 w-full">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold cursor-pointer">Apply Now</h3>
              <p className="text-sm mt-1 text-muted-foreground">
                Please let {data.Company.name} know that you fund this job on
                HireNest. This helps us grow !
              </p>
            </div>
            {isapplied ? (
              <h1 className="text-center bg-yellow-100 text-yellow-800 font-semibold p-3 rounded-md border border-yellow-300">
                You have already applied for this job
              </h1>
            ) : (
              <Link href={`/job/${jobId}/applicant`}>
                <Button className="w-full">Apply Now</Button>
              </Link>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold">About the job</h3>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Apply Before</span>
            <span className="text-sm">
              {new Date(
                data.createdAt.getTime() +
                  data.listingDuration * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Posted On</span>
            <span className="text-sm">
              {data.createdAt.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Employment Type
            </span>
            <span className="text-sm">{data.employmentType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="text-sm">
              {flag && <span className="mr-1">{flag}</span>}
              {data.location}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data.Company.logo}
                alt={data.Company.name}
                width={48}
                height={48}
                className="rounded-full size-12"
              />
              <div className="flex flex-col gap-3">
                <span className="font-semibold">{data.Company.name}</span>
                <span className="text-sm text-muted-foreground line-clamp-3">
                  {data.Company.about}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
