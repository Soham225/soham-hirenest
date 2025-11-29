import { OnboardingComponent } from "@/components/forms/onboarding/onboardingcomponent";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { Require_User } from "../utils/requireUser";

async function Onboarding_completed_or_not(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  });

  if (user?.onboardingCompleted === true) {
    return redirect("/");
  }
}

export default async function OnboardingPage() {
  const session = await Require_User();
  await Onboarding_completed_or_not(session.id as string);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center py-10 gap-4 px-4">
      <OnboardingComponent />
    </div>
  );
}
