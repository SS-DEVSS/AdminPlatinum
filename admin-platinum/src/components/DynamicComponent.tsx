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
};

const DynamicComponent = ({ type, name, required }: getComponentProps) => {
  const [date, setDate] = useState<Date>();
  const [form, setForm] = useState({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  switch (type) {
    case CategoryAttributesTypes.NUMERIC:
      return (
        <Input
          required={required}
          className="mt-3"
          type="number"
          placeholder={`Ingresa ${name}...`}
          onChange={(e) => handleInputChange(e, name)}
        />
      );
    case CategoryAttributesTypes.STRING:
      return (
        <Input
          required={required}
          className="mt-3"
          type="text"
          placeholder={`Ingresa ${name}...`}
          // onChange={(e) => handleInputChange(e, name)}
        />
      );
    case CategoryAttributesTypes.DATE:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
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
                setForm((prev) => ({
                  ...prev,
                  [name]: selectedDate,
                }));
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
