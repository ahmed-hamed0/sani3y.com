
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/auth";
import { egyptianGovernorates } from "@/data/egyptianGovernorates";

interface GovernoratePickerProps {
  form: UseFormReturn<RegisterFormValues>;
  isDisabled: boolean;
}

const GovernoratePicker = ({ form, isDisabled }: GovernoratePickerProps) => {
  // Filter governorates to ensure no empty strings
  const validGovernorates = egyptianGovernorates.filter(gov => gov && gov.trim() !== '');

  return (
    <FormField
      control={form.control}
      name="governorate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>المحافظة</FormLabel>
          <Select
            disabled={isDisabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validGovernorates.length > 0 ? (
                validGovernorates.map((governorate) => (
                  <SelectItem 
                    key={`gov-${governorate}`} 
                    value={governorate}
                  >
                    {governorate}
                  </SelectItem>
                ))
              ) : (
                <SelectItem 
                  value="no-governorates-available" 
                  key="no-governorates-available"
                >
                  لا توجد محافظات متاحة
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GovernoratePicker;
