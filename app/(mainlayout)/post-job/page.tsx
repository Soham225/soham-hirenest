import { prisma } from "@/app/utils/db";
import { Require_User } from "@/app/utils/requireUser";
import { CreateJobForm } from "@/components/forms/CreateJobForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ArcjetLogo from "@/public/arcjet.jpg";
import InngestLogo from "@/public/inngest-locale.png";
import Image from "next/image";
import { redirect } from "next/navigation";

const companies = [
  { id: 0, name: "Arcjet", logo: ArcjetLogo },
  { id: 1, name: "Inngest", logo: InngestLogo },
  { id: 2, name: "Arcjet", logo: ArcjetLogo },
  { id: 3, name: "Inngest", logo: InngestLogo },
  { id: 4, name: "Arcjet", logo: ArcjetLogo },
  { id: 5, name: "Inngest", logo: InngestLogo },
];

const testimonials = [
  {
    quote:
      "This platform transformed the way we hire talent. It's fast, efficient, and incredibly user-friendly.",
    author: "Jessica Lane",
    company: "TechNova Solutions",
  },
  {
    quote:
      "We've doubled our productivity after switching. The support team is amazing, the experience is seamless.",
    author: "Rahul Mehta",
    company: "CoreSync Systems",
  },
  {
    quote:
      "Absolutely love the design and functionality. It's a game-changer for any growing business.",
    author: "Ava Thompson",
    company: "BrightPath Marketing",
  },
];

const stats = [
  { id: 0, value: "10k+", label: "Monthly active job seekers" },
  { id: 1, value: "500+", label: "Companies hiring" },
  { id: 2, value: "1M+", label: "Applications submitted" },
  { id: 3, value: "98%", label: "User satisfaction rate" },
];

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });

  if (!data) {
    return redirect("/");
  }

  return data;
}

export default async function JobPostings() {
  const session = await Require_User();
  const data = await getCompany(session.id as string);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 gap-4">
      <CreateJobForm
        CompanyAbout={data.about}
        CompanyLocation={data.location}
        CompanyLogo={data.logo}
        CompanyName={data.name}
        CompanyWebsite={data.website}
        companyXAccount={data.xAccount}
      />

      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Trusted by Industry Leaders
            </CardTitle>
            <CardDescription>
              Join Thousands of Companies and hire best talents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id}>
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={120}
                    height={80}
                    className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {testimonials.map((testimony, index) => (
                <blockquote
                  key={index}
                  className="border-l-2 border-primary pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    {testimony.quote}
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    {" "}
                    -{testimony.author} ,{testimony.company}
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-xl font-bold">{stat.value}</h4>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
