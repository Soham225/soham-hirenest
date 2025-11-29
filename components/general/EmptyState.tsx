import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface iAppProps {
  title: string;
  description: string;
  buttontext: string;
  href: string;
}

export function EmptyState({
  buttontext,
  description,
  href,
  title,
}: iAppProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border border-primary/20 p-8">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground text-balance max-w-sm">
        {description}
      </p>
      <Link href={href} className={buttonVariants()}>
        <PlusCircle /> {buttontext}
      </Link>
    </div>
  );
}
