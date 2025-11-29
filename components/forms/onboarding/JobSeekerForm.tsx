import { createJobSeeker } from "@/app/utils/action";
import { JobSeekerSchema } from "@/app/utils/zodSchema";
import { UploadDropzone } from "@/components/general/uploadthingreexported";
import { Button } from "@/components/ui/button";

import pdf from "@/public/pdf.png";

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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function Job_Seeker_Form() {
  const [pending, setpending] = useState(false);

  const form = useForm<z.infer<typeof JobSeekerSchema>>({
    resolver: zodResolver(JobSeekerSchema),
    defaultValues: {
      name: "",
      about: "",
      resume: "",
    },
  });

  async function onSubmit(data: z.infer<typeof JobSeekerSchema>) {
    try {
      setpending(true);
      await createJobSeeker(data);
    } catch (error) {
      if (error instanceof Error && error.message! == "NEXT_REDIRECT") {
        console.log("something went wrong");
      }
    } finally {
      setpending(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>short Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div className="w-full max-w-full overflow-hidden">
                  <div>
                    {field.value ? (
                      <div className="relative w-fit ">
                        <Image
                          src={pdf}
                          alt="job seeker logo"
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

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "submitting..." : "continue"}
        </Button>
      </form>
    </Form>
  );
}
