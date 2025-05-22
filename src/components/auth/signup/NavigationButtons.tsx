
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface NavigationButtonsProps {
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep?: (e: React.FormEvent) => void;
  isFinalStep: boolean;
  role: "client" | "craftsman";
}

const NavigationButtons = ({
  isLoading,
  onPrevStep,
  onNextStep,
  isFinalStep,
  role
}: NavigationButtonsProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isLoading}
      >
        رجوع
      </Button>
      {role === "craftsman" && onNextStep ? (
        <Button
          type="button"
          onClick={onNextStep}
          disabled={isLoading}
        >
          التالي
        </Button>
      ) : (
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" /> جارٍ التسجيل...
            </>
          ) : (
            "إنشاء الحساب"
          )}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
