import { Dayjs } from "dayjs";

export interface ContactFormData {
  userId: string;
  carId: string;
  inquiryType: string;
  content: string;
  repairStoreId: string;
  repairStoreName: string;
  appointmentDate: Dayjs | null;
}
