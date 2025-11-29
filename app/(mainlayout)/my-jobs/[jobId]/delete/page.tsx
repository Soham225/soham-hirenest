import { DeleteJobPost } from "@/app/utils/action";
import { Require_User } from "@/app/utils/requireUser";
import { GeneralSubmitButton } from "@/components/general/GeneralSubmitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ jobId: string }>;

export default async function DeleteJob({ params }: { params: Params }) {
  const { jobId } = await params;
  await Require_User();
  return (
    <div>
      <Card className="max-w-lg mx-auto mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this job ?</CardTitle>
          <CardDescription>
            This action can not be undone. This will permanently delete this job
            from our server
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <Link
            href={"/my-jobs"}
            className={buttonVariants({ variant: "secondary" })}
          >
            <ArrowLeft />
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await DeleteJobPost(jobId);
            }}
          >
            <GeneralSubmitButton
              text="Delete"
              icon={<Trash />}
              variant={"destructive"}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
