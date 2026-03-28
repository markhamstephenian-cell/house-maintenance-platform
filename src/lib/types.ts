export interface House {
  id: string;
  address: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  house_id: string;
  name: string;
  frequency: string;
  last_completed_date: string | null;
  next_due_date: string | null;
  notes: string | null;
  purchase_link: string | null;
  contractor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contractor {
  id: string;
  house_id: string;
  name: string;
  service_type: string;
  phone: string;
  email: string;
  website: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
