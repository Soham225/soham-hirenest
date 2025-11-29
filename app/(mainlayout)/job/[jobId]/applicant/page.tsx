import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { ApplicantForm } from "@/components/general/ApplicantDetails";
import { redirect } from "next/navigation";

type Params = Promise<{ jobId: string }>;

export default async function ApplicantFormPage({
  params,
}: {
  params: Params;
}) {
  const user = await Require_User();
  const { jobId } = await params;

  const alreadyapplied = await prisma.applicationDetails.findUnique({
    where: {
      userId_jobPostId: {
        userId: user.id as string,
        jobPostId: jobId,
      },
    },
  });

  if (alreadyapplied) {
    return redirect(`/job/${jobId}`);
  }

  return <ApplicantForm jobId={jobId} />;
}
