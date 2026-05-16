export interface BookingFormData {
  customerName: string;
  phone: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  pickupSuburb: string;
  destinationSuburb: string;
  pickupDate: string;
  pickupTime: string;
}

export interface FormErrors {
  [key: string]: string;
}

export function validateBookingForm(data: BookingFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.customerName.trim()) {
    errors.customerName = "Customer name is required.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d+$/.test(data.phone.trim())) {
    errors.phone = "Phone number must contain only digits.";
  } else if (data.phone.trim().length < 10 || data.phone.trim().length > 12) {
    errors.phone = "Phone number must be 10 to 12 digits.";
  }

  if (!data.streetNumber.trim()) {
    errors.streetNumber = "Street number is required.";
  }

  if (!data.streetName.trim()) {
    errors.streetName = "Street name is required.";
  }

  if (!data.pickupSuburb.trim()) {
    errors.pickupSuburb = "Pickup suburb is required.";
  }

  if (!data.destinationSuburb.trim()) {
    errors.destinationSuburb = "Destination suburb is required.";
  }

  if (!data.pickupDate) {
    errors.pickupDate = "Pickup date is required.";
  }

  if (!data.pickupTime) {
    errors.pickupTime = "Pickup time is required.";
  }

  if (data.pickupDate && data.pickupTime) {
    const pickupDateTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
    if (pickupDateTime < new Date()) {
      errors.pickupTime = "Pickup date and time must not be in the past.";
    }
  }

  return errors;
}

export const REFERENCE_REGEX = /^BRN\d{5}$/;

export function validateReferenceNumber(ref: string): string | null {
  if (!ref.trim()) return null;
  if (!REFERENCE_REGEX.test(ref.trim().toUpperCase())) {
    return "Invalid format. Reference must be like BRN00001 (BRN + 5 digits).";
  }
  return null;
}

export const NZ_SUBURBS = [
  "Auckland CBD",
  "Newmarket",
  "Mount Eden",
  "Manukau",
  "North Shore",
  "Ponsonby",
  "Takapuna",
  "Botany",
  "Henderson",
  "Papakura",
  "Pakuranga",
  "Howick",
  "Glenfield",
  "Massey",
  "Waitakere",
  "Papatoetoe",
  "Otahuhu",
  "Onehunga",
  "Remuera",
  "Epsom",
  "Parnell",
  "Albany",
  "Orewa",
];
