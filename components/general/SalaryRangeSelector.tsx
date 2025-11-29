import { Control, useController } from "react-hook-form";
import { Slider } from "../ui/slider";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface iAppProps {
  control: Control<any>;
  currency: string;
  maxsalary: number;
  minsalary: number;
  step: number;
}

export function SalaryRangeSelector({
  control,
  currency,
  maxsalary,
  minsalary,
  step,
}: iAppProps) {
  const { field: formField } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });

  const [range, setrange] = useState<[number, number]>([
    formField.value || minsalary,
    toField.value || maxsalary / 2,
  ]);

  function handleChangeRange(value: number[]) {
    const newRange: [number, number] = [value[0], value[1]];
    setrange(newRange);
    formField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  }

  useEffect(() => {
    formField.onChange(range[0]);
    toField.onChange(range[1]);
  }, []);

  return (
    <div className="w-full space-y-4">
      <Slider
        onValueChange={handleChangeRange}
        min={minsalary}
        max={maxsalary}
        step={step}
        value={range}
      />
      <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
    </div>
  );
}
