// src/types/vehicle.ts
export interface Vehicle {
    id: number;
    carMake: string;
    carModel: string;
    year: number;
    vin: string;
    carNumber: string;
    coOwner: boolean;
    coOwnerName?: string | null;
    coOwnerPhone?: string | null;
    createdAt: string;
  }
  