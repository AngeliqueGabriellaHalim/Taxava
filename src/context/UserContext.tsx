import { type ReactNode, useState } from "react";
import { type User, UserContext } from "./User";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<User | null>(initialUser);

  const loginUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (updatedUserData: Partial<User>) => {
    const newUser = { ...user, ...updatedUserData } as User;
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
