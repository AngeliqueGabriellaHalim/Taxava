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
  owner: string;
  returnAddress: string;
  sameAddress: boolean;
  companyId: number;
}
export function loadAllProperties(): Property[] {
  const localRaw = localStorage.getItem("properties");
  const localProps: Property[] = localRaw ? JSON.parse(localRaw) : [];
  const seedProps = propertiesJson as Property[];

  // Gabungkan seed + local dalam urutan (seed dulu, lalu local)
  const allProps = [...seedProps, ...localProps];

  // Buat map, yang terakhir akan menimpa yang sebelumnya
  const map = new Map<number, Property>();
  allProps.forEach((p) => map.set(p.id, p));

  return Array.from(map.values());
}
// ambil property milik user
export function getPropertiesByUser(userId: number): Property[] {
  // ambil company yg dimiliki user
  const companies = getCompaniesByUser(userId);
  const ownedCompanyIds = companies.map((c) => c.id);

  // gunakan loadAllProperties untuk menghindari duplikasi
  const allProperties = loadAllProperties();

  // filter: hanya yg sesuai dengan companyId user
  return allProperties.filter((p) => ownedCompanyIds.includes(p.companyId));
}
