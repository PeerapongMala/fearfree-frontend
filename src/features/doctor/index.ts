export type {
  Patient,
  CreatePatientPayload,
  PlayHistoryItem,
  TestHistoryItem,
  PatientHistoryResponse,
  PatientTestHistoryResponse,
  PatientRedemptionHistoryResponse,
} from "./doctor.model";
export { doctorService } from "./doctor.service";
export { useDoctorStore } from "./doctor.store";
