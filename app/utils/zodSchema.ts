import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(1, "Location must be defined"),
  about: z.string().min(10, "please provide some more info about your company"),
  logo: z.string().min(1, "please upload a logo"),
  website: z.string().url("please enter a valid URL"),
  xAccount: z.string().optional(),
});

export const JobSeekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  about: z.string().min(10, "Give us some more information about yourself"),
  resume: z.string().min(1, "Please upload your resume"),
});

export const JobPostSchema = z.object({
  jobTitle: z.string().min(2, "The Title must be of 2 characters"),
  employmentType: z.string().min(2, "Please provide  the  employment type"),
  location: z.string().min(1, "Location is required"),
  salaryFrom: z.number().min(1, "SalaryFrom is required"),
  salaryTo: z.number().min(1, "salary to is required"),
  jobDescription: z.string().min(2, "please provide the job description"),
  listingDuration: z.number().min(1, "Listing  duration is required"),
  benefits: z.array(z.string()).min(1, "Please select at least one benefit"),

  companyName: z.string().min(1, "Please write the company name"),
  companyLocation: z.string().min(1, "Please provide the location"),
  companyAbout: z.string().min(10, "Tell us about your company"),
  companyLogo: z.string().min(1, "Please provide the company logo"),
  companyWebsite: z.string().min(1, "please provide the company website"),
  companyXAccount: z.string().optional(),
});

export const ApplicantSchema = z.object({
  firstName: z.string().min(1, "please write your first name"),
  lastName: z.string().min(1, "please write your last name"),
  email: z.email("please provide your email"),
  contact: z
    .string()
    .min(10, "Enter your 10 digit mobile number")
    .max(10, "Enter your 10 digit mobile number")
    .regex(/^[0-9]+$/, "Only digits allowed"),
  about: z.string().min(10, "Enter tell us about yourself"),
  resume: z.string().min(1, "Please upload your resume"),
  almaMatter: z
    .string()
    .min(1, "Please tell us your college / university name"),
  github: z.string().optional(),
});
