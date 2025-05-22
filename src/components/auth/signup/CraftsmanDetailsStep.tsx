
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { craftsmanSpecialties } from "@/data/craftsman-specialties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CraftsmanDetailsStepProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  onPrevStep: () => void;
}

const CraftsmanDetailsStep = ({
  form,
  isLoading,
  onPrevStep,
}: CraftsmanDetailsStepProps) => {
  // تصفية التخصصات للتأكد من عدم وجود قيم فارغة
  const filteredSpecialties = craftsmanSpecialties.filter(
    specialty => specialty && specialty.trim() !== ''
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">معلومات الصنايعي</h2>
      
      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>التخصص</FormLabel>
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              defaultValue={field.value || undefined}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر تخصصك" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredSpecialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>نبذة عنك</FormLabel>
            <FormControl>
              <Textarea 
                disabled={isLoading} 
                placeholder="اكتب نبذة قصيرة عن خبراتك ومهاراتك..." 
                {...field} 
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={isLoading}
        >
          رجوع
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" /> جارٍ التسجيل...
            </>
          ) : (
            "إنشاء الحساب"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CraftsmanDetailsStep;
