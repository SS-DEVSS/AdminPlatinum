import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { CategoryAttributesTypes } from "@/models/category";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

type getComponentProps = {
  type: CategoryAttributesTypes;
  name: string;
  required: boolean;
  value?: any;
  onChange?: (value: any) => void;
};

const DynamicComponent = ({ type, name, required, value, onChange }: getComponentProps) => {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  switch (type) {
    case CategoryAttributesTypes.NUMERIC:
      return (
        <Input
          required={required}
          className="mt-1"
          type="number"
          placeholder={`Ingresa ${name}...`}
          value={value || ""}
          onChange={handleInputChange}
        />
      );
    case CategoryAttributesTypes.STRING:
      return (
        <Input
          required={required}
          className="mt-1"
          type="text"
          placeholder={`Ingresa ${name}...`}
          value={value || ""}
          onChange={handleInputChange}
        />
      );
    case CategoryAttributesTypes.DATE:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                onChange?.(selectedDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    default:
      return null;
  }
};

export default DynamicComponent;
