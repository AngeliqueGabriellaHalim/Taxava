import { createContext } from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type UserContextType = {
  user: User | null;
  loginUser: (userData: User) => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  logoutUser: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);
