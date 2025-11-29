"use client";

import { countryList } from "@/app/utils/countryList";
import { JobPostSchema } from "@/app/utils/zodSchema";
import { BenefitSelector } from "@/components/general/BenefitsSelector";
import { JobDurationSelector } from "@/components/general/jobDurationSelector";
import { SalaryRangeSelector } from "@/components/general/SalaryRangeSelector";
import { UploadDropzone } from "@/components/general/uploadthingreexported";
import { JobPostEditor } from "@/components/RichTextEditor.tsx/JobpostEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createJob, Edit_Job } from "@/app/utils/action";

interface iAppProps {
  jobPost: {
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
    listingDuration: number;
    benefits: string[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    Company: {
      location: string;
      name: string;
      about: string;
      createdAt: Date;
      logo: string;
      website: string;
      xAccount: string | null;
    };
  };
}

export function EditJobForm({ jobPost }: iAppProps) {
  const form = useForm<z.infer<typeof JobPostSchema>>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: {
      benefits: jobPost.benefits,
      companyAbout: jobPost.Company.about,
      companyLocation: jobPost.Company.location,
      companyLogo: jobPost.Company.logo,
      companyName: jobPost.Company.name,
      companyWebsite: jobPost.Company.website,
      companyXAccount: jobPost.Company.xAccount || "",
      employmentType: jobPost.employmentType,
      jobDescription: jobPost.jobDescription,
      jobTitle: jobPost.jobTitle,
      listingDuration: jobPost.listingDuration,
      location: jobPost.location,
      salaryFrom: jobPost.salaryFrom,
      salaryTo: jobPost.salaryTo,
    },
  });

  const [pending, setPending] = useState(false);

  async function onSubmit(values: z.infer<typeof JobPostSchema>) {
    try {
      setPending(true);
      await Edit_Job(values, jobPost.id);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("something went wrong", error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 lg:col-span-2 flex flex-col gap-6 sm:mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Employment Type</SelectLabel>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            🌍 Worldwide / Remote
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <SalaryRangeSelector
                    control={form.control}
                    minsalary={10000}
                    maxsalary={1000000}
                    step={1000}
                    currency="USD"
                  />
                </FormControl>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <JobPostEditor field={field as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <BenefitSelector field={field as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"companyName"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            🌍 Worldwide / Remote
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Company Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"companyWebsite"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company website</FormLabel>
                    <FormControl>
                      <Input placeholder="Company website ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"companyXAccount"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company X Account</FormLabel>
                    <FormControl>
                      <Input placeholder="Company X Account ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={"companyAbout"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About The Company</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px]"
                      placeholder="Tell us about your company ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <div className="w-full max-w-full overflow-hidden">
                      <div>
                        {field.value ? (
                          <div className="relative w-fit ">
                            <Image
                              src={field.value}
                              alt="logo for company"
                              width={100}
                              height={100}
                              className="rounded-lg"
                            />
                            <Button
                              type="button"
                              className="absolute top-0 -right-2 opacity-100 bg-red-700 text-white hover:bg-red-800"
                              // variant={"destructive"}
                              size={"icon"}
                              onClick={() => {
                                field.onChange("");
                              }}
                            >
                              <XIcon className="size-4" />
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            endpoint={"imageUploader"}
                            onClientUploadComplete={(res) => {
                              field.onChange((res[0] as any).url);
                            }}
                            onUploadError={() => {
                              console.log("something went wrong");
                            }}
                            className="w-full max-w-full ut-button:bg-primary  ut-button:text-white 
                                 ut-button:hover:bg-primary/90 
                                 ut-label:text-muted-foreground 
                                  ut-allowed-content:text-muted-foreground 
                                   border-solid border-primary"
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={pending}
        >
          {pending ? "submitting..." : "Edit Job"}
        </Button>
      </form>
    </Form>
  );
}
