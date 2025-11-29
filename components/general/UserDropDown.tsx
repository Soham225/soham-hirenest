import { Briefcase, ChevronDown, Heart, Layers2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "@/app/utils/auth";
import { Require_User } from "@/app/utils/requireUser";
import { prisma } from "@/app/utils/db";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export async function User_Drop_Down({ email, image, name }: iAppProps) {
  const user = await Require_User();

  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      userType: true,
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-auto p-0 hover: bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile Image" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <ChevronDown size={16} strokeWidth={2} className="ml-1 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mt-2" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userInfo?.userType === "COMPANY" ? (
            <DropdownMenuItem asChild>
              <Link href={"/post-job"}>
                <Briefcase size={16} strokeWidth={2} className="opacity-60" />
                <span>Post Job</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            ""
          )}

          <DropdownMenuItem asChild>
            <Link href="/favorites">
              <Heart className="opacity-60" size={16} strokeWidth={2} />
              <span>Favorite Jobs</span>
            </Link>
          </DropdownMenuItem>
          {userInfo?.userType === "COMPANY" ? (
            <DropdownMenuItem asChild>
              <Link href="/my-jobs">
                <Layers2 className="opacity-60" size={16} strokeWidth={2} />
                <span>My Job Listings</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            ""
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex gap-2 items-center w-full">
              <LogOut size={16} strokeWidth={2} className="opacity-60" />
              <span>Logout</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
