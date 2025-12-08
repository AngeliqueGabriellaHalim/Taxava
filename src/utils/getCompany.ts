import companiesJson from "../db/company.json";

export interface Company {
  id: number;
  name: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  ownerName: string;
  ownerEmail: string;
  userId: number;
}

export function getCompaniesByUser(userId: number): Company[] {
  // local storage first
  const local = (() => {
    try {
      const raw = localStorage.getItem("companies");
      return raw ? (JSON.parse(raw) as Company[]) : [];
    } catch {
      return [];
    }
  })();

  const merged: Company[] = [...(companiesJson as Company[]), ...local];

  return merged.filter((c) => c.userId === userId);
}
