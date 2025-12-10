import { getCompaniesByUser } from "./getCompany";
import propertiesJson from "../db/property.json";

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

export interface Property {
  id: number;
  name: string;
  type: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  companyId: number;
}

// ambil property milik user
export function getPropertiesByUser(userId: number): Property[] {
  // ambil company yg dimiliki user
  const companies = getCompaniesByUser(userId);
  const ownedCompanyIds = companies.map((c) => c.id);

  // ambil property dari localstorage
  const local = (() => {
    try {
      const raw = localStorage.getItem("properties");
      return raw ? (JSON.parse(raw) as Property[]) : [];
    } catch {
      return [];
    }
  })();

  // gabungkan json + local
  const merged: Property[] = [...(propertiesJson as Property[]), ...local];
  // filter: hanya yg sesuai dengan companyId user
  return merged.filter((p) => ownedCompanyIds.includes(p.companyId));
}
