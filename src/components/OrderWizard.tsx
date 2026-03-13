import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "@/components/Stepper";
import StepPickup from "@/components/StepPickup";
import StepDropoff from "@/components/StepDropoff";
import StepConfirm from "@/components/StepConfirm";
import type { PickupFormData, DropoffFormData, ConfirmFormData } from "@/lib/orderSchema";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/lib/api";

const STEPS = [
  { label: "Pickup" },
  { label: "Drop-off" },
  { label: "Confirm" },
];

export default function OrderWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pickupData, setPickupData] = useState<PickupFormData | undefined>();
  const [dropoffData, setDropoffData] = useState<DropoffFormData | undefined>();
  const [confirmData, setConfirmData] = useState<ConfirmFormData | undefined>();

  const handlePickupNext = (data: PickupFormData) => {
    console.log(data);
    setPickupData(data);
    setStep(1);
  };

  const handleDropoffNext = (data: DropoffFormData) => {
    console.log(data);
    setDropoffData(data);
    setStep(2);
  };

  const handleConfirmSubmit = async (data: ConfirmFormData) => {
    if (!pickupData || !dropoffData) return;
    console.log(data)
    setConfirmData(data);

    const response = await apiCall("/orders", {
      method: "POST",
      data: {
        pickupAddress: pickupData.address,
        pickupLat: pickupData.lat,
        pickupLng: pickupData.lng,
        dropoffAddress: dropoffData.address,
        dropoffLat: dropoffData.lat,
        dropoffLng: dropoffData.lng,
        price: data.codAmount,
        packageWeightKg: parseFloat(data.weight),
        packageType: data.packageType,
        notes: data.specialInstructions,
        paymentMethod: data.paymentMethod,
        hasCod: data.hasCod,
        codAmount: data.codAmount,

      }
    })

    console.log(response)

    navigate(`/dashboard/order-success/${response.data.orderKey}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => step > 0 ? setStep(step - 1) : navigate("/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-lg">Send Parcel</h1>
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
