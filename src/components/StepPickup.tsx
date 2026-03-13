import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PickupFormData, pickupSchema} from "@/lib/orderSchema";
import {SAVED_ADDRESSES} from "@/lib/mockData";
import {useAuth} from "@/contexts/AuthContext";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import MapPicker from "@/components/MapPicker";
import {ArrowRight, MapPin} from "lucide-react";
import {useEffect, useState} from "react"; // Added imports

interface Props {
    data?: Partial<PickupFormData>;
    onNext: (data: PickupFormData) => void;
}

export default function StepPickup({data, onNext}: Props) {
    const {user} = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isValid},
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
    const currentAddress = watch("address");
    const [debouncedAddress, setDebouncedAddress] = useState(currentAddress);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAddress(currentAddress);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [currentAddress]);

    const handleSavedAddress = (id: string) => {
        const addr = SAVED_ADDRESSES.find((a) => a.id === id);
        if (addr) {
            setValue("address", addr.address, {shouldValidate: true});
            setValue("lat", addr.lat);
            setValue("lng", addr.lng);
            setValue("savedAddressId", addr.id);
        }
    };

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-4 animate-fade-in-up">
            <div>
                <Label className="text-sm font-semibold">Saved Address</Label>
                <Select onValueChange={handleSavedAddress}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select saved address"/>
                    </SelectTrigger>
                    <SelectContent>
                        {SAVED_ADDRESSES.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary"/>
                    {a.label} — {a.address}
                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-semibold">Pickup Address*</Label>
                <Input
                    {...register("address")}
                    placeholder="Type address or select from map"
                    className="mt-1"
                />
                {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
            </div>

            <MapPicker
                lat={currentLat}
                lng={currentLng}
                address={debouncedAddress}
                onLocationSelect={(lat, lng) => {
                    setValue("lat", lat);
                    setValue("lng", lng);
                }}
            />

            <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                    id="save-pickup-address"
                    checked={watch("saveAddress")}
                    onCheckedChange={(checked) => setValue("saveAddress", checked as boolean)}
                />
                <label
                    htmlFor="save-pickup-address"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Save this address for later
                </label>
            </div>

            {watch("saveAddress") && (
                <div className="mt-2 animate-fade-in-up">
                    <Label className="text-sm font-semibold text-muted-foreground">Address Label (Optional)</Label>
                    <Input
                        {...register("addressLabel")}
                        placeholder="e.g. Home, Office"
                        className="mt-1"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                    <Label className="text-sm font-semibold">Contact Name*</Label>
                    <Input {...register("contactName")} className="mt-1"/>
                    {errors.contactName &&
                        <p className="text-destructive text-xs mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                    <Label className="text-sm font-semibold">Phone*</Label>
                    <Input {...register("contactPhone")} className="mt-1" placeholder="+880..."/>
                    {errors.contactPhone &&
                        <p className="text-destructive text-xs mt-1">{errors.contactPhone.message}</p>}
                </div>
            </div>

            <div>
                <Label className="text-sm font-semibold">Pickup Instructions</Label>
                <Textarea
                    {...register("instructions")}
                    placeholder="e.g. Ring the bell, 3rd floor"
                    className="mt-1 resize-none"
                    rows={2}
                />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold gap-2" disabled={!isValid}>
                Next: Drop-off
                <ArrowRight className="w-4 h-4"/>
            </Button>
        </form>
    );
}
