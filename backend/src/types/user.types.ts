export type UserRole = "admin" | "sales";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}