import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dropoffSchema, DropoffFormData } from "@/lib/orderSchema";
import { SAVED_ADDRESSES } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapPicker from "@/components/MapPicker";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  data?: Partial<DropoffFormData>;
  onNext: (data: DropoffFormData) => void;
  onBack: () => void;
}

export default function StepDropoff({ data, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<DropoffFormData>({
    resolver: zodResolver(dropoffSchema),
    defaultValues: {
      address: data?.address || "",
      recipientName: data?.recipientName || "",
      recipientPhone: data?.recipientPhone || "",
      lat: data?.lat,
      lng: data?.lng,
    },
    mode: "onChange",
  });

  const currentLat = watch("lat");
  const currentLng = watch("lng");

  const handleSavedAddress = (id: string) => {
    const addr = SAVED_ADDRESSES.find((a) => a.id === id);
    if (addr) {
      setValue("address", addr.address, { shouldValidate: true });
      setValue("lat", addr.lat);
      setValue("lng", addr.lng);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in-up">
      <div>
        <Label className="text-sm font-semibold">Saved Address / সংরক্ষিত ঠিকানা</Label>
        <Select onValueChange={handleSavedAddress}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select address / ঠিকানা বাছুন" />
          </SelectTrigger>
          <SelectContent>
            {SAVED_ADDRESSES.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-accent" />
                  {a.label} ({a.labelBn}) — {a.address}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold">Drop-off Address / ড্রপ-অফ ঠিকানা *</Label>
        <Input
          {...register("address")}
          placeholder="Type address / ঠিকানা লিখুন"
          className="mt-1"
        />
        {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
      </div>

      <MapPicker
        lat={currentLat}
        lng={currentLng}
        onLocationSelect={(lat, lng) => {
          setValue("lat", lat);
          setValue("lng", lng);
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-semibold">Recipient Name / প্রাপকের নাম *</Label>
          <Input {...register("recipientName")} className="mt-1" />
          {errors.recipientName && <p className="text-destructive text-xs mt-1">{errors.recipientName.message}</p>}
        </div>
        <div>
          <Label className="text-sm font-semibold">Recipient Phone / ফোন *</Label>
          <Input {...register("recipientPhone")} className="mt-1" placeholder="+880..." />
          {errors.recipientPhone && <p className="text-destructive text-xs mt-1">{errors.recipientPhone.message}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back / আগে
        </Button>
        <Button type="submit" className="flex-[2] h-12 text-base font-semibold gap-2" disabled={!isValid}>
          Next: Confirm / পরবর্তী
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
