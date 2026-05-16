export const KEYS = {
  bookings: "cabsOnline_bookings",
  drivers: "cabsOnline_drivers",
};

export interface Booking {
  id: string;
  referenceNumber: string;
  customerName: string;
  phone: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  pickupSuburb: string;
  destinationSuburb: string;
  pickupDate: string;
  pickupTime: string;
  status: "unassigned" | "assigned";
  assignedDriver?: string;
  assignedDriverId?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  suburb: string;
  status: "Available" | "Busy";
}

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.bookings) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(KEYS.bookings, JSON.stringify(bookings));
}

export function getDrivers(): Driver[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.drivers) || "[]");
  } catch {
    return [];
  }
}

export function saveDrivers(drivers: Driver[]): void {
  localStorage.setItem(KEYS.drivers, JSON.stringify(drivers));
}

export function generateReferenceNumber(): string {
  const bookings = getBookings();
  const maxNum = bookings.reduce((max, b) => {
    const num = parseInt(b.referenceNumber.replace("BRN", ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const next = maxNum + 1;
  return `BRN${String(next).padStart(5, "0")}`;
}

const SAMPLE_DRIVERS: Driver[] = [
  { id: "D001", name: "James Tane",    phone: "0211234567", carModel: "Toyota Camry",     suburb: "Auckland CBD",  status: "Available" },
  { id: "D002", name: "Sarah Nguyen",  phone: "0212345678", carModel: "Honda Accord",     suburb: "Newmarket",     status: "Available" },
  { id: "D003", name: "Mike Parata",   phone: "0213456789", carModel: "Hyundai Sonata",   suburb: "Mount Eden",    status: "Available" },
  { id: "D004", name: "Lucy Chen",     phone: "0214567890", carModel: "Nissan Altima",    suburb: "Manukau",       status: "Available" },
  { id: "D005", name: "Tom Faleolo",   phone: "0215678901", carModel: "Ford Mondeo",      suburb: "North Shore",   status: "Available" },
  { id: "D006", name: "Anna Williams", phone: "0216789012", carModel: "Mazda 6",          suburb: "Ponsonby",      status: "Busy"      },
  { id: "D007", name: "Ben Hopa",      phone: "0217890123", carModel: "Kia Optima",       suburb: "Takapuna",      status: "Available" },
  { id: "D008", name: "Priya Sharma",  phone: "0218901234", carModel: "Subaru Legacy",    suburb: "Botany",        status: "Available" },
];

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "sample-1",
    referenceNumber: "BRN00001",
    customerName: "Emily Parker",
    phone: "0210001111",
    streetNumber: "12",
    streetName: "Queen Street",
    pickupSuburb: "Auckland CBD",
    destinationSuburb: "Newmarket",
    pickupDate: new Date(Date.now() + 3600000).toISOString().split("T")[0],
    pickupTime: new Date(Date.now() + 3600000).toTimeString().slice(0, 5),
    status: "unassigned",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    referenceNumber: "BRN00002",
    customerName: "Liam Taufa",
    phone: "0210002222",
    streetNumber: "45",
    streetName: "Dominion Road",
    pickupSuburb: "Mount Eden",
    destinationSuburb: "Auckland CBD",
    pickupDate: new Date(Date.now() + 7200000).toISOString().split("T")[0],
    pickupTime: new Date(Date.now() + 7200000).toTimeString().slice(0, 5),
    status: "assigned",
    assignedDriver: "James Tane",
    assignedDriverId: "D001",
    createdAt: new Date().toISOString(),
  },
];

export function initializeSampleData(): void {
  if (!localStorage.getItem(KEYS.drivers)) {
    saveDrivers(SAMPLE_DRIVERS);
  }
  if (!localStorage.getItem(KEYS.bookings)) {
    saveBookings(SAMPLE_BOOKINGS);
  }
}
