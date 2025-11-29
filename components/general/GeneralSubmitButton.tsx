"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Divide, Heart, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GeneralSubmitButtonProps {
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  width?: string;
  icon?: ReactNode;
}

export function GeneralSubmitButton({
  text,
  variant,
  width,
  icon,
}: GeneralSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button variant={variant} className={width} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>submitting...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
}

export function SaveJobButton({ saveJob }: { saveJob: Boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={"outline"}
      disabled={pending}
      type="submit"
      className="cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={cn(
              saveJob ? "fill-current text-red-500" : "",
              "size-4 transition-colors"
            )}
          />
          {saveJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}
