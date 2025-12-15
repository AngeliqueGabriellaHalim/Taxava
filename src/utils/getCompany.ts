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

export function loadAllCompanies(): Company[] {
  const localRaw = localStorage.getItem("companies");
  const local: Company[] = localRaw ? JSON.parse(localRaw) : [];
  const seed = companiesJson as Company[];

  const map = new Map<number, Company>();
  seed.forEach((c) => map.set(c.id, c));
  local.forEach((c) => map.set(c.id, c));

  return Array.from(map.values());
}

export function saveCompaniesToLocal(companies: Company[]) {
  localStorage.setItem("companies", JSON.stringify(companies));
}

export function getCompaniesByUser(userId: number): Company[] {
  return loadAllCompanies().filter((c) => c.userId === userId);
}