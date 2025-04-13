import { FieldValue, Timestamp } from "firebase/firestore";

export const toSafeDate = (date: Date | FieldValue | Timestamp | string): Date => {
    if (date instanceof Date) return date;
    if (date instanceof Timestamp) return date.toDate();
    if (typeof date === 'string') return new Date(date);
    return new Date();
  };