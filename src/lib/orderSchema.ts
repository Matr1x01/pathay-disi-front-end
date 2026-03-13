import { z } from "zod";

export const pickupSchema = z.object({
  address: z.string().min(5, "Address is required"),
  savedAddressId: z.string().optional(),
  saveAddress: z.boolean().default(false),
  addressLabel: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  contactName: z.string().min(2, "Name is required"),
  contactPhone: z.string().min(11, "Valid phone required").max(14),
  instructions: z.string().max(200).optional(),
});

export const dropoffSchema = z.object({
  address: z.string().min(5, "Address is required"),
  savedAddressId: z.string().optional(),
  saveAddress: z.boolean().default(false),
  addressLabel: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  recipientName: z.string().min(2, "Recipient name required"),
  recipientPhone: z.string().min(11, "Valid phone required").max(14),
});

export const confirmSchema = z.object({
  packageType: z.string().min(1, "Select package type"),
  weight: z.string().min(1, "Select weight"),
  hasCod: z.boolean().default(false),
  codAmount: z.number().min(0).optional(),
  specialInstructions: z.string().max(300).optional(),
  paymentMethod: z.string().min(1, "Select payment method"),
});

export type PickupFormData = z.infer<typeof pickupSchema>;
export type DropoffFormData = z.infer<typeof dropoffSchema>;
export type ConfirmFormData = z.infer<typeof confirmSchema>;

export interface OrderFormData {
  pickup: PickupFormData;
  dropoff: DropoffFormData;
  confirm: ConfirmFormData;
}
