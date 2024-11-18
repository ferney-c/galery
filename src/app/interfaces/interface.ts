export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface QuoteResponse {
  success: number;
  message: string;
  quotes: Quote[];
}

export interface Quote {
  id: number;
  client_id: number | null;
  barber_id: number;
  assigned: string;
  slots: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  total_price: number;
  client: Client | null;
  barber: Barber | null;
  services: Service[] | null;
}

export interface Client {
  id: number;
  user_id: number;
  role_id: number;
  barbershop_id: number | null;
  starts: number | null;
  first_start: string | null;
  last_start: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  user: User;
}

export interface Barber {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  nickname: string | null;
  birth: null | string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
  user: User | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  nickname: string | null;
  birth: Date | null;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: number;
  barbershop_id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}
