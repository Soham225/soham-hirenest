"use client";

import Image from "next/image";
import MyLogo from "@/public/MyLogo.png";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { useState } from "react";
import { User_Type } from "./usertype";
import { Company_Form } from "./CompanyForm";
import { Job_Seeker_Form } from "./JobSeekerForm";

type User_Selection_Type = "company" | "jobseeker" | null;

export function OnboardingComponent() {
  const [Step, setStep] = useState(1);
  const [UserType, setUserType] = useState<User_Selection_Type>(null);

  function Handle_User_Type_Selection(type: User_Selection_Type) {
    setUserType(type);
    setStep(2);
  }

  function RenderStep() {
    switch (Step) {
      case 1:
        return <User_Type OnSelect={Handle_User_Type_Selection} />;

      case 2:
        return UserType === "company" ? <Company_Form /> : <Job_Seeker_Form />;

      default:
        return null;
    }
  }

  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Image src={MyLogo} alt="logo for hirenest" width={50} height={50} />
        <h1 className="text-4xl font-bold">
          Hire<span className="text-primary">Nest</span>
        </h1>
      </div>
      <Card className="max-w-lg w-full">
        <CardContent>{RenderStep()}</CardContent>
      </Card>
    </>
  );
}
