import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { CopyLinkMenuItem } from "@/components/general/CopyLink";
import { EmptyState } from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PenBoxIcon, Users, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define the type for job listing
type JobListing = {
  id: string;
  jobTitle: string;
  status: string;
  createdAt: Date;
  Company: {
    name: string;
    logo: string;
  };
};

async function GetJobs(userId: string): Promise<JobListing[]> {
  const data = await prisma.jobPost.findMany({
    where: {
      status: "ACTIVE",
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export default async function MyJobsPage() {
  const session = await Require_User();
  const data = await GetJobs(session.id as string);

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Job Post Found"
          buttontext="Create A Job Post Now"
          description="You Don't have Any Job Post Yet"
          href="/post-job"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Jobs</CardTitle>
            <CardDescription>
              Manage your job listings and applications here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((listing: JobListing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Image
                        src={listing.Company.logo}
                        alt="company logo"
                        height={40}
                        width={40}
                        className="rounded-md size-10"
                      />
                    </TableCell>
                    <TableCell>{listing.Company.name}</TableCell>
                    <TableCell>{listing.jobTitle}</TableCell>
                    <TableCell>
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell>
                      {listing.createdAt.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/edit`}>
                              <PenBoxIcon />
                              Edit Job
                            </Link>
                          </DropdownMenuItem>
                          <CopyLinkMenuItem
                            jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                          />
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/delete`}>
                              <XCircle />
                              Delete
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/my-jobs/${listing.id}/viewApplicants`}
                            >
                              <Users />
                              view applicants
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
