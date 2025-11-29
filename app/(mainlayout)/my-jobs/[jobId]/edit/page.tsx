import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { EditJobForm } from "@/components/forms/editJob/page";
import { notFound } from "next/navigation";

async function getData(jobId: string, userId: string) {
  await Require_User();
  const data = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      benefits: true,
      employmentType: true,
      jobDescription: true,
      jobTitle: true,
      listingDuration: true,
      location: true,
      salaryFrom: true,
      salaryTo: true,
      updatedAt: true,
      createdAt: true,
      Company: {
        select: {
          about: true,
          createdAt: true,
          location: true,
          logo: true,
          name: true,
          website: true,
          xAccount: true,
        },
      },
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

type Params = Promise<{ jobId: string }>;

export default async function EditJob({ params }: { params: Params }) {
  const { jobId } = await params;
  const user = await Require_User();
  const data = await getData(jobId, user.id as string);

  return <EditJobForm jobPost={data} />;
}
