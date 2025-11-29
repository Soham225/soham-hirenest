import { companySchema } from "@/app/utils/zodSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { countryList } from "@/app/utils/countryList";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/general/uploadthingreexported";
import { createCompany } from "@/app/utils/action";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { XIcon } from "lucide-react";

export function Company_Form() {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      logo: "",
      name: "",
      website: "",
      xAccount: "",
    },
  });

  const [Pending, setPending] = useState(false);

  async function onSubmit(data: z.infer<typeof companySchema>) {
    try {
      setPending(true);
      await createCompany(data);
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
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder={"Select Location"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>WorldWide</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌍</span> <span>WorldWide / Remote</span>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourcompany.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X (Twitter) Account</FormLabel>
                <FormControl>
                  <Input placeholder="@yourcompany" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your company"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="logo"
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
                          endpoint={"imageUploader"}
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

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={Pending}
        >
          {Pending ? "submitting ... " : "continue"}
        </Button>
      </form>
    </Form>
  );
}
