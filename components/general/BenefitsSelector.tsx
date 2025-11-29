import { benefits } from "@/app/utils/ListOfBenefits";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";

interface iAppProps {
  field: ControllerRenderProps;
}

export function BenefitSelector({ field }: iAppProps) {
  function toggleBenefits(BenefitId: string) {
    const currentBenefits = field.value || [];
    const newBenefits = currentBenefits.includes(BenefitId)
      ? currentBenefits.filter((id: string) => id !== BenefitId)
      : [...currentBenefits, BenefitId];

    field.onChange(newBenefits);
    field.onBlur();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);
          return (
            <Badge
              key={benefit.id}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 px-2 py-1 text-sm rounded-full"
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleBenefits(benefit.id)}
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground mt-4">
        Selected Benefits:{" "}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  );
}
