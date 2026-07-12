export interface RolePermission {
  role: string;
  fleet: "full" | "read" | "none";
  drivers: "full" | "read" | "none";
  trips: "full" | "read" | "none";
  expenses: "full" | "read" | "none";
  analytics: "full" | "read" | "none";
}


export interface SettingsData {

  depotName: string;

  currency: string;

  distanceUnit: string;

  roles: RolePermission[];

}