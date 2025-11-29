import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type Params = Promise<{ jobId: string; applicantId: string }>;

export default async function hello({ params }: { params: Params }) {
  await Require_User();
  const { jobId, applicantId } = await params;

  const applicantData = await prisma.applicationDetails.findUnique({
    where: {
      id: applicantId,
      jobPostId: jobId,
    },
    select: {
      about: true,
      almaMatter: true,
      contact: true,
      email: true,
      firstName: true,
      lastName: true,
      resume: true,
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-primary">
            Applicant Information
          </CardTitle>
          <CardDescription className="font-semibold text-muted-foreground">
            The details of the applicant are given below
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <span className="text-primary font-semibold md:text-xl">
                First Name:{" "}
              </span>
              <h1 className="font-semibold md:text-xl">
                {applicantData?.firstName}
              </h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-primary font-semibold md:text-xl">
                Last Name:{" "}
              </span>
              <h1 className="font-semibold md:text-xl">
                {applicantData?.lastName}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <span className="text-primary font-semibold md:text-xl">
                Alma Matter:{" "}
              </span>
              <h1 className="font-semibold md:text-xl">
                {applicantData?.almaMatter}
              </h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-primary font-semibold md:text-xl">
                Contact Number:{" "}
              </span>
              <h1 className="font-semibold md:text-xl">
                {`+91 ${applicantData?.contact}`}
              </h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-primary font-semibold md:text-xl">
                Email:{" "}
              </span>
              <h1 className="font-semibold md:text-xl">
                {applicantData?.email}
              </h1>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-primary font-bold md:text-xl">
              About {applicantData?.firstName} {applicantData?.lastName}
            </span>
            <p>{applicantData?.about}</p>
          </div>
          <Separator />
          <div>
            {applicantData?.resume && (
              <iframe
                src={applicantData.resume}
                width="100%"
                height="600px"
                className="border"
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 mb-3">
        <Link href={`/my-jobs/${jobId}/viewApplicants`}>
          <Button className="w-full cursor-pointer">
            Go back to the previous page
          </Button>
        </Link>
      </div>
    </>
  );
}
