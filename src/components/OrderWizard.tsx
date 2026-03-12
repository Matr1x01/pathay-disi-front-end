import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "@/components/Stepper";
import StepPickup from "@/components/StepPickup";
import StepDropoff from "@/components/StepDropoff";
import StepConfirm from "@/components/StepConfirm";
import type { PickupFormData, DropoffFormData, ConfirmFormData } from "@/lib/orderSchema";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { label: "Pickup", labelBn: "পিকআপ" },
  { label: "Drop-off", labelBn: "ড্রপ-অফ" },
  { label: "Confirm", labelBn: "নিশ্চিত" },
];

export default function OrderWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pickupData, setPickupData] = useState<PickupFormData | undefined>();
  const [dropoffData, setDropoffData] = useState<DropoffFormData | undefined>();
  const [confirmData, setConfirmData] = useState<ConfirmFormData | undefined>();

  const handlePickupNext = (data: PickupFormData) => {
    setPickupData(data);
    setStep(1);
  };

  const handleDropoffNext = (data: DropoffFormData) => {
    setDropoffData(data);
    setStep(2);
  };

  const handleConfirmSubmit = (data: ConfirmFormData) => {
    setConfirmData(data);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    navigate(`/dashboard/order-success/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => step > 0 ? setStep(step - 1) : navigate("/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-lg">Send Parcel / পার্সেল পাঠান</h1>
      </div>

      <div className="max-w-lg mx-auto">
        <Stepper currentStep={step} steps={STEPS} />

        <div className="px-4 pb-8">
          {step === 0 && <StepPickup data={pickupData} onNext={handlePickupNext} />}
          {step === 1 && <StepDropoff data={dropoffData} onNext={handleDropoffNext} onBack={() => setStep(0)} />}
          {step === 2 && pickupData && dropoffData && (
            <StepConfirm
              data={confirmData}
              pickupData={pickupData}
              dropoffData={dropoffData}
              onSubmit={handleConfirmSubmit}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
