import Image from "next/image";
import Link from "next/link";
import MyLogo from "@/public/MyLogo.png";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth, signOut } from "@/app/utils/auth";
import { User_Drop_Down } from "./UserDropDown";
import { Require_User } from "@/app/utils/requireUser";
import { prisma } from "@/app/utils/db";

export async function Navbar() {
  const session = await auth();

  console.log("User Image URL:", session?.user?.image);

  return (
    <nav className="flex justify-between items-center py-5">
      <Link href={"/"} className="flex items-center gap-1">
        <Image src={MyLogo} alt="job logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Hire<span className="text-primary">Nest</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {session?.user ? (
          <User_Drop_Down
            name={session.user.name as string}
            email={session.user.email as string}
            image={session.user.image as string}
          />
        ) : (
          <Link
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href={"/login"}
          >
            LogIn
          </Link>
        )}
      </div>
    </nav>
  );
}
