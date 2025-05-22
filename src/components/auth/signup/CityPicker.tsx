
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

interface CityPickerProps {
  form: UseFormReturn<RegisterFormValues>;
  isDisabled: boolean;
  selectedGovernorate: string;
  availableCities: string[];
}

const CityPicker = ({ 
  form, 
  isDisabled, 
  selectedGovernorate,
  availableCities 
}: CityPickerProps) => {
  // Ensure all cities are valid non-empty strings
  const validCities = availableCities.filter(city => city && city.trim() !== '');
  
  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>المدينة</FormLabel>
          <Select
            disabled={isDisabled || !selectedGovernorate}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedGovernorate
                      ? "اختر المحافظة أولاً"
                      : "اختر المدينة"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validCities.length > 0 ? (
                validCities.map((city) => (
                  <SelectItem 
                    key={`city-${city}`} 
                    value={city}
                  >
                    {city}
                  </SelectItem>
                ))
              ) : (
                <SelectItem 
                  value="no-cities-available" 
                  key="no-cities-available"
                >
                  لا توجد مدن متاحة
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

export default CityPicker;
