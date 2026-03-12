import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pickupSchema, PickupFormData } from "@/lib/orderSchema";
import { SAVED_ADDRESSES } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapPicker from "@/components/MapPicker";
import { MapPin, ArrowRight } from "lucide-react";

interface Props {
  data?: Partial<PickupFormData>;
  onNext: (data: PickupFormData) => void;
}

export default function StepPickup({ data, onNext }: Props) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      address: data?.address || "",
      contactName: data?.contactName || user?.name || "",
      contactPhone: data?.contactPhone || user?.phone || "",
      instructions: data?.instructions || "",
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
      setValue("savedAddressId", addr.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in-up">
      <div>
        <Label className="text-sm font-semibold">Saved Address / সংরক্ষিত ঠিকানা</Label>
        <Select onValueChange={handleSavedAddress}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select saved address / ঠিকানা বাছুন" />
          </SelectTrigger>
          <SelectContent>
            {SAVED_ADDRESSES.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  {a.label} ({a.labelBn}) — {a.address}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold">Pickup Address / পিকআপের ঠিকানা *</Label>
        <Input
          {...register("address")}
          placeholder="Type address or select from map / ঠিকানা লিখুন"
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
          <Label className="text-sm font-semibold">Contact Name / যোগাযোগের নাম *</Label>
          <Input {...register("contactName")} className="mt-1" />
          {errors.contactName && <p className="text-destructive text-xs mt-1">{errors.contactName.message}</p>}
        </div>
        <div>
          <Label className="text-sm font-semibold">Phone / ফোন *</Label>
          <Input {...register("contactPhone")} className="mt-1" placeholder="+880..." />
          {errors.contactPhone && <p className="text-destructive text-xs mt-1">{errors.contactPhone.message}</p>}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold">Pickup Instructions / পিকআপ নির্দেশনা</Label>
        <Textarea
          {...register("instructions")}
          placeholder="e.g. Ring the bell, 3rd floor / ঘণ্টা বাজান, ৩য় তলা"
          className="mt-1 resize-none"
          rows={2}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold gap-2" disabled={!isValid}>
        Next: Drop-off / পরবর্তী
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
