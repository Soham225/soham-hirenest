import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { redirect } from "next/navigation";

export default async function PaymentSuccess({ searchParams }: any) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    return redirect("/");
  }

  // Fetch full stripe session
  const session = await stripe.checkout.sessions.retrieve(session_id);

  const jobId = session.metadata?.jobId;

  if (!jobId) {
    return redirect("/");
  }

  // Mark the job as ACTIVE
  await prisma.jobPost.update({
    where: { id: jobId },
    data: { status: "ACTIVE" },
  });

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <h1 className="text-2xl font-bold">Payment Successful! 🎉</h1>
    </div>
  );
}
