import usersJson from "../db/users.json";

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  hasOnboarded: boolean;
}

export function loadAllUsers(): User[] {
  const localRaw = localStorage.getItem("users");
  const localUsers: User[] = localRaw ? JSON.parse(localRaw) : [];
  const seedUsers = usersJson as User[];

  const userMap = new Map<number, User>();
  seedUsers.forEach((u) => userMap.set(u.id, u));
  localUsers.forEach((u) => userMap.set(u.id, u));

  return Array.from(userMap.values());
}

export function getUserById(userId: number): User | undefined {
  return loadAllUsers().find((u) => u.id === userId);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("currentUser");
  try {
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function saveUsersToLocal(users: User[]): void {
  localStorage.setItem("users", JSON.stringify(users));
}
