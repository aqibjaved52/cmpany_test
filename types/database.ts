export interface Client {
  id: string;
  name: string;
  email: string;
  business_name: string;
  created_at: string;
}

export interface ClientInsert {
  name: string;
  email: string;
  business_name: string;
}

