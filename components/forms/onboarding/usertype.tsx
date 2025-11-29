import { Button } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";

type User_Selection_Type = "company" | "jobseeker";

interface User_Type_Selection_Props {
  OnSelect: (type: User_Selection_Type) => void;
}

export function User_Type({ OnSelect }: User_Type_Selection_Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome! Let&apos;s get started</h2>
        <p className="text-muted-foreground">
          choose how you would like to use our platform
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => OnSelect("company")}
          className=" bg-background w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
          variant={"ghost"}
        >
          <div className="size-12 rounded-full bg-primary/10 flex justify-center items-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Company / Organization</h3>
            <p>Post jobs and find great talent</p>
          </div>
        </Button>

        <Button
          onClick={() => OnSelect("jobseeker")}
          className=" bg-background w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
          variant={"ghost"}
        >
          <div className="size-12 rounded-full bg-primary/10 flex justify-center items-center">
            <UserRound className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Job Seeker</h3>
            <p>Find your dream job opportunity</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
