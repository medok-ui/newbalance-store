export interface IUserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  postal_code: string | null;
  address: string | null;
  updated_at: string;
}

export interface IAdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  profile: IUserProfile | null;
}
