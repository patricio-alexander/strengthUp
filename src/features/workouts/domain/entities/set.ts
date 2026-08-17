export interface CreateSet {
  weight: string;
  reps: string;
  performed_at: string;
}

export interface LastSession {
  label: string;
  sets: Set[] | [];
}

export interface Set {
  id: string;
  weight: string;
  performed_at: string;

  reps: string;
}
