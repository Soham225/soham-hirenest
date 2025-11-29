"use client";

import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";

export function CopyLinkMenuItem({ jobUrl }: { jobUrl: string }) {
  async function HandleCopy() {
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success("URL copied to the clipboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy URL");
    }
  }
  return (
    <DropdownMenuItem onSelect={HandleCopy}>
      <Link2 size={4} />
      <span>copy job url</span>
    </DropdownMenuItem>
  );
}
