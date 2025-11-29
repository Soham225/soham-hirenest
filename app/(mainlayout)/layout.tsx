import { Navbar } from "@/components/general/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function Main_layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex mx-auto px-2 md:px-4 lg:px-6 flex-col pb-8">
      <Navbar />
      {children}
      <Toaster closeButton richColors />
    </div>
  );
}
