import { prisma } from "@/app/utils/db";
import pdf from "@/public/pdf.png";
import { EmptyState } from "@/components/general/EmptyState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Require_User } from "@/app/utils/requireUser";

// Define the type for applicant based on your Prisma schema
type Applicant = {
  id: string;
  firstName: string;
  lastName: string;
  about: string;
  almaMatter: string;
  contact: string;
  email: string;
  resume: string;
};

type Params = Promise<{ jobId: string }>;

export default async function ViewApplicants({ params }: { params: Params }) {
  const { jobId } = await params;
  await Require_User();

  const findapplicant = await prisma.applicationDetails.findMany({
    where: {
      jobPostId: jobId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      about: true,
      almaMatter: true,
      contact: true,
      email: true,
      resume: true,
    },
  });

  return (
    <>
      {findapplicant.length === 0 ? (
        <EmptyState
          title="No applicant found"
          buttontext="Go back to the job post"
          description="There is no applicant yet"
          href={`/job/${jobId}`}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              View Applicant Details
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage the applicants information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>About</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Alma Matter</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findapplicant.map((applicant: Applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>{applicant.firstName}</TableCell>
                    <TableCell>{applicant.lastName}</TableCell>
                    <TableCell className="max-w-[150px]">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis line-clamp-2">
                        {applicant.about} ...
                      </div>
                    </TableCell>

                    <TableCell>
                      <Image
                        src={pdf}
                        alt="resume"
                        height={20}
                        width={20}
                        className="ml-3"
                      />
                    </TableCell>
                    <TableCell>{applicant.almaMatter}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.contact}</TableCell>
                    <TableCell>
                      <Link
                        href={`/my-jobs/${jobId}/applicantView/${applicant.id}`}
                      >
                        <Button className="cursor-pointer">view</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
