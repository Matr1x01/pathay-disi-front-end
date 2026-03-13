import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmSchema, ConfirmFormData, PickupFormData, DropoffFormData } from "@/lib/orderSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Banknote, CreditCard, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "@/lib/api";
import { useEffect, useState } from "react";

interface Props {
  data?: Partial<ConfirmFormData>;
  pickupData: PickupFormData;
  dropoffData: DropoffFormData;
  onSubmit: (data: ConfirmFormData) => void;
  onBack: () => void;
}

export default function StepConfirm({ data, pickupData, dropoffData, onSubmit, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      packageType: data?.packageType || "",
      weight: data?.weight || "",
      hasCod: data?.hasCod || false,
      codAmount: data?.codAmount || 0,
      specialInstructions: data?.specialInstructions || "",
      paymentMethod: data?.paymentMethod || "",
    },
    mode: "onChange",
  });

  const [packageTypes, setPackageTypes] = useState<any[]>([]);
  const [weightOptions, setWeightOptions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await apiCall("/get-package-types");
        setPackageTypes(response.data);
      } catch (err) {
        console.error("Failed to fetch package types:", err);
      }
    };
    fetchPackageTypes();

    const fetchWeightOptions = async () => {
      try {
        const response = await apiCall("/get-weight-options");
        setWeightOptions(response.data);
      } catch (err) {
        console.error("Failed to fetch weight options:", err);
      }
    };
    fetchWeightOptions();

    const fetchPaymentMethods = async () => {
      try {
        const response = await apiCall("/get-payment-methods");
        setPaymentMethods(response.data);
      } catch (err) {
        console.error("Failed to fetch payment methods:", err);
      }
    };
    fetchPaymentMethods();
  }, []);

  const weight = watch("weight");
  const hasCod = watch("hasCod");
  const packageType = watch("packageType");
  const codAmount = watch("codAmount") || 0;
  const [price, setPrice] = useState<{ deliveryFee: number; platformFee: number; total: number } | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!weight || !packageType) return;
      try {
        const response = await apiCall("/orders/estimate-cost", {
          method: "POST",
          data: {
            pickupLat: pickupData.lat,
            pickupLon: pickupData.lng,
            dropOffLat: dropoffData.lat,
            dropOffLon: dropoffData.lng,
            weight,
            packageType,
          },
        });
        setPrice(response.data);
      } catch (err) {
        console.error("Failed to estimate cost:", err);
      }
    };
    fetchPrice();
  }, [weight, packageType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in-up">
      {/* Route summary */}
      <Card className="border-primary/20 bg-emerald-light">
        <CardContent className="p-3 text-sm space-y-1">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Pickup: {pickupData.address}</p>
              <p className="text-muted-foreground text-xs">{pickupData.contactName} • {pickupData.contactPhone}</p>
            </div>
          </div>
          <div className="ml-1 border-l border-primary/30 h-3" />
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Drop-off: {dropoffData.address}</p>
              <p className="text-muted-foreground text-xs">{dropoffData.recipientName} • {dropoffData.recipientPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-semibold">Package Type*</Label>
          <Select onValueChange={(v) => setValue("packageType", v, { shouldValidate: true })} defaultValue={data?.packageType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {packageTypes.map((p) => (
                <SelectItem key={p.value} value={String(p.value)}>
                  <Package className="w-3 h-3 inline mr-1" />
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.packageType && <p className="text-destructive text-xs mt-1">{errors.packageType.message}</p>}
        </div>
        <div>
          <Label className="text-sm font-semibold">Weight*</Label>
          <Select onValueChange={(v) => setValue("weight", v, { shouldValidate: true })} defaultValue={data?.weight}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {weightOptions.map((w) => (
                <SelectItem key={w.value} value={String(w.value)}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.weight && <p className="text-destructive text-xs mt-1">{errors.weight.message}</p>}
        </div>
      </div>

      {/* COD */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
        <Checkbox
          checked={hasCod}
          onCheckedChange={(c) => setValue("hasCod", !!c, { shouldValidate: true })}
        />
        <Label className="text-sm font-medium flex items-center gap-1">
          <Banknote className="w-4 h-4" />
          Cash on Delivery
        </Label>
      </div>

      <AnimatePresence>
        {hasCod && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <Label className="text-sm font-semibold">COD Amount (৳)</Label>
            <Input
              type="number"
              {...register("codAmount", { valueAsNumber: true })}
              placeholder="0"
              className="mt-1"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <Label className="text-sm font-semibold">Special Instructions</Label>
        <Textarea
          {...register("specialInstructions")}
          placeholder="Any special request / বিশেষ অনুরোধ"
          className="mt-1 resize-none"
          rows={2}
        />
      </div>

      {/* Payment */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Payment Method*</Label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((pm) => {
            const selected = watch("paymentMethod") === pm.value;
            return (
              <button
                type="button"
                key={pm.value}
                onClick={() => setValue("paymentMethod", pm.value, { shouldValidate: true })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${selected
                  ? "border-primary bg-emerald-light text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
              >
                <span>{pm.icon}</span>
                {pm.label}
              </button>
            );
          })}
        </div>
        {errors.paymentMethod && <p className="text-destructive text-xs mt-1">{errors.paymentMethod.message}</p>}
      </div>

      {/* Price estimate */}
      <AnimatePresence>
        {price && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-primary/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Price Estimate
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">৳{price.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">৳{price.platformFee}</span>
                  </div>
                  {hasCod && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">COD Charge</span>
                      <span className="font-medium">৳{codAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-1 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary text-lg">৳{price.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="submit" className="flex-[2] h-14 text-base font-bold gap-2" disabled={!isValid}>
          <Send className="w-5 h-5" />
          Confirm Order
        </Button>
      </div>
    </form>
  );
}
