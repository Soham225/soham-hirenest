"use server";

import { z } from "zod";
import { Require_User } from "./requireUser";
import {
  ApplicantSchema,
  companySchema,
  JobPostSchema,
  JobSeekerSchema,
} from "./zodSchema";
import { prisma } from "./db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "./jobListingDurationPricing";
import { inngest } from "./inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await Require_User();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof JobSeekerSchema>) {
  const user = await Require_User();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = JobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
}

export async function CreateApplicantDetails(
  data: z.infer<typeof ApplicantSchema>,
  jobId: string
) {
  const user = await Require_User();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = ApplicantSchema.parse(data);

  await prisma.applicationDetails.create({
    data: {
      userId: user.id as string,
      jobPostId: jobId,
      about: validateData.about,
      almaMatter: validateData.almaMatter,
      contact: validateData.contact,
      email: validateData.email,
      firstName: validateData.firstName,
      lastName: validateData.lastName,
      resume: validateData.resume,
      github: validateData.github,
    },
  });
  return redirect(`/job/${jobId}`);
}

export async function createJob(data: z.infer<typeof JobPostSchema>) {
  const user = await Require_User();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const validateData = JobPostSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });

    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const jobpost = await prisma.jobPost.create({
    data: {
      employmentType: validateData.employmentType,
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      listingDuration: validateData.listingDuration,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      benefits: validateData.benefits,
      companyId: company.id,
    },
    select: {
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validateData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  await inngest.send({
    name: "job-created",
    data: {
      jobId: jobpost.id,
      expirationDays: validateData.listingDuration,
    },
  });

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `job posting -${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fgratisography.com%2Fphotos%2Fpeople%2F&psig=AOvVaw2Ce7NSlQCLOwrabpt1K8Nd&ust=1757342970450000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNiHou7yxo8DFQAAAAAdAAAAABAE",
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: jobpost.id,
    },

    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}

export async function SaveJobPost(jobId: string) {
  const user = await Require_User();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      UserId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}}`);
}

export async function unSaveJobPost(savedJobPostId: string) {
  const user = await Require_User();

  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      UserId: user.id,
    },
    select: {
      id: true,
    },
  });

  revalidatePath(`job/${data.id}`);
}

export async function Edit_Job(
  data: z.infer<typeof JobPostSchema>,
  jobId: string
) {
  const user = await Require_User();
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const validatedata = JobPostSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
      Company: {
        userId: user.id,
      },
    },
    data: {
      benefits: validatedata.benefits,
      employmentType: validatedata.employmentType,
      jobDescription: validatedata.jobDescription,
      jobTitle: validatedata.jobTitle,
      listingDuration: validatedata.listingDuration,
      location: validatedata.location,
      salaryFrom: validatedata.salaryFrom,
      salaryTo: validatedata.salaryTo,
    },
  });
  return redirect("/my-jobs");
}

export async function DeleteJobPost(jobId: string) {
  const session = await Require_User();
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  await prisma.jobPost.delete({
    where: {
      id: jobId,
      Company: {
        userId: session.id,
      },
    },
  });

  await inngest.send({
    name: "job/cancel.expiration",
    data: { jobId: jobId },
  });

  return redirect("/my-jobs");
}
