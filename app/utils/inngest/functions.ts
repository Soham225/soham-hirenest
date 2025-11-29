import { prisma } from "../db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const HandleJobExpiration = inngest.createFunction(
  {
    id: "job-expiration",
    cancelOn: [
      {
        event: "job/cancel.expiration",
        if: "event.data.jobId == async.data.jobId",
      },
    ],
  },
  { event: "job-created" },

  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data;

    await step.sleep("wait-for-expiration", `${expirationDays}d`);

    await step.run("update-job-status", async () => {
      await prisma.jobPost.update({
        where: {
          id: jobId,
        },
        data: {
          status: "EXPIRED",
        },
      });
    });

    return { jobId, message: "job marked as expired" };
  }
);
