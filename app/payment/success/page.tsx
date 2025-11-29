import { Require_User } from "@/app/utils/requireUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function PaymentSuccess() {
  await Require_User();
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="w-full mt-3 text-center sm:mt-5">
            <h2 className="font-semibold text-xl">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Congratulations! your payment was successful. Your job posting is
              now active
            </p>

            <Button asChild className="w-full mt-5">
              <Link href={"/"}>Go Back To Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
