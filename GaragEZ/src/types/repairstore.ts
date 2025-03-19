// store.ts
export interface Store {
  id: number;
  name: string;      // 가게명
  address: string;   // 가게 주소
}

// repairStore.ts
export interface RepairStore {
  id: number;          // repair_store 테이블의 PK
  storeId: number;     // store.id FK (nullable 아님)
  location: string;    // repair_store.location
  contactInfo: string; // repair_store.contact_info
  createdAt: string;   // TIMESTAMP
}
