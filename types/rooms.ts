import { FieldValue } from "firebase/firestore";
export type Room = {
  name: string;
  coachId: string | undefined;
  code: string;
  createAt: FieldValue | null;
};
