export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  category: string;
  expiryDate: string;
  contact: string;
  safetyScore: number;
  status: 
    | "Available"
    | "Suspended"
    | "On Trip"
    | "Off Duty";
}