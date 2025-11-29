"use client";
import pdf from "@/public/pdf.png";
import { ApplicantSchema } from "@/app/utils/zodSchema";
import { UploadDropzone } from "@/components/general/uploadthingreexported";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { CreateApplicantDetails } from "@/app/utils/action";

export function ApplicantForm({ jobId }: { jobId: string }) {
  const form = useForm<z.infer<typeof ApplicantSchema>>({
    resolver: zodResolver(ApplicantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      about: "",
      almaMatter: "",
      contact: "",
      email: "",
      resume: "",
      github: "",
    },
  });
  const [pending, setPending] = useState(false);

  async function onsubmit(data: z.infer<typeof ApplicantSchema>) {
    try {
      setPending(true);
      await CreateApplicantDetails(data, jobId);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("something went wrong");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="provide your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="provide your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="provide your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your contact number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 ... Your 10 digit contact number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="almaMatter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University / College Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="provide your university / college name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provide your Github link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://.." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell us about yourself</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Tell us about yourself .. "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Your Resume</FormLabel>
                    <FormControl>
                      <div className="w-full max-w-full overflow-hidden">
                        <div>
                          {field.value ? (
                            <div className="relative w-fit ">
                              <Image
                                src={pdf}
                                alt="resume"
                                width={100}
                                height={100}
                                className="rounded-lg"
                              />
                              <Button
                                type="button"
                                className="absolute -top-0 -right-2 opacity-100 bg-red-700 text-white hover:bg-red-800"
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
                              endpoint={"resumeUploader"}
                              onClientUploadComplete={(res) => {
                                field.onChange(res[0].ufsUrl);
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
            </div>
          </CardContent>
        </Card>
        <Button
          type="submit"
          className=" w-full cursor-pointer mt-3 mb-3"
          disabled={pending}
        >
          {pending ? "Submitting ..." : "Submit "}
        </Button>
      </form>
    </Form>
  );
}
