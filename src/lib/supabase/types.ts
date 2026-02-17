export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "quoted"
  | "paid"
  | "matched"
  | "printing"
  | "completed";

export type MatchGroupStatus = "pending" | "printing" | "completed";

export interface Profile {
  id: string;
  role: UserRole;
  customer_name: string | null;
  tel: string | null;
  address: string | null;
  company_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  box_amount: number;
  price: number;
  is_contact_us: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  package_id: string;
  status: OrderStatus;
  poster_url: string | null;
  ad_details: string | null;
  contact_person: string | null;
  contact_tel: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  order_id: string;
  amount: number;
  notes: string | null;
  valid_until: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MatchGroup {
  id: string;
  package_id: string;
  name: string;
  status: MatchGroupStatus;
  created_at: string;
  updated_at: string;
}

export interface MatchGroupMember {
  id: string;
  match_group_id: string;
  order_id: string;
  created_at: string;
}
