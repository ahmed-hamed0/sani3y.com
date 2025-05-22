
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/auth";

interface TermsAgreementProps {
  form: UseFormReturn<RegisterFormValues>;
  isDisabled: boolean;
}

const TermsAgreement = ({ form, isDisabled }: TermsAgreementProps) => {
  return (
    <FormField
      control={form.control}
      name="agreeTerms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              disabled={isDisabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              أوافق على{" "}
              <a
                href="/terms"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                الشروط والأحكام
              </a>{" "}
              و{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة الخصوصية
              </a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsAgreement;
