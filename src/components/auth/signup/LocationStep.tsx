
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/auth";
import { citiesByGovernorate } from "@/data/egyptianCities";
import GovernoratePicker from "./GovernoratePicker";
import CityPicker from "./CityPicker";
import TermsAgreement from "./TermsAgreement";
import NavigationButtons from "./NavigationButtons";

interface LocationStepProps {
  form: UseFormReturn<RegisterFormValues>;
  role: "client" | "craftsman";
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep?: (e: React.FormEvent) => void;
}

const LocationStep = ({
  form,
  role,
  isLoading,
  onPrevStep,
  onNextStep,
}: LocationStepProps) => {
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const selectedGovernorate = form.watch("governorate");

  useEffect(() => {
    if (selectedGovernorate) {
      // Get cities for the selected governorate, defaulting to an empty array if none exist
      const cities = citiesByGovernorate[selectedGovernorate] || [];
      
      // Make sure we're filtering properly and not including any empty strings
      const filteredCities = cities.filter(city => city && city.trim() !== '');
      
      // Set the available cities
      setAvailableCities(filteredCities);

      // If the currently selected city is not available in the new governorate, clear it
      const currentCity = form.getValues("city");
      if (currentCity && !filteredCities.includes(currentCity) && currentCity !== "no-cities-available") {
        form.setValue("city", "");
      }
    } else {
      setAvailableCities([]);
      // Clear city selection if governorate is cleared
      form.setValue("city", "");
    }
  }, [selectedGovernorate, form]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">
        {role === "client" ? "معلومات العميل" : "معلومات الصنايعي"}
      </h2>

      <GovernoratePicker 
        form={form} 
        isDisabled={isLoading} 
      />

      <CityPicker 
        form={form} 
        isDisabled={isLoading} 
        selectedGovernorate={selectedGovernorate}
        availableCities={availableCities}
      />

      <TermsAgreement 
        form={form} 
        isDisabled={isLoading} 
      />

      <NavigationButtons 
        isLoading={isLoading}
        onPrevStep={onPrevStep}
        onNextStep={onNextStep}
        isFinalStep={role === "client"}
        role={role}
      />
    </div>
  );
};

export default LocationStep;
