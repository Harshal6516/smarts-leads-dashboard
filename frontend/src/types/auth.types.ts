export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}