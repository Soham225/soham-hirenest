import Link from "next/link";
import MyLogo from "@/public/MyLogo.png";
import Image from "next/image";
import { Login } from "@/components/login/login";

export default function Loginform() {
  return (
    <div className="min-h-screen w-screen flex justify-center items-center ">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Link href={"/"} className="flex items-center  self-center">
          <Image src={MyLogo} alt="job logo" className="size-10" />
          <h1 className="text-2xl font-bold">
            Hire<span className="text-primary">Nest</span>
          </h1>
        </Link>
        <Login />
      </div>
    </div>
  );
}
