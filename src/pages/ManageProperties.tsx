import React, { useMemo, useState } from "react";
import { Search, Phone, MapPinHouse, UserRound, Building2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { getPropertiesByUser } from "../utils/getProperty";
import { getCompaniesByUser } from "../utils/getCompany";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

const ManageProperties: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const navigate = useNavigate(); //  inisialisasi navigate()

  // ----- ambil user yang sedang login dari localStorage -----
  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userCompanies = getCompaniesByUser(currentUser.id);

  const propertiesOwned = getPropertiesByUser(currentUser.id);
  // ----- search + sort -----
  const filteredProperties = useMemo(() => {
    const lower = search.toLowerCase();
    const filtered = propertiesOwned.filter((p) =>
      p.name.toLowerCase().includes(lower)
    );

    return filtered.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [propertiesOwned, search, sortAsc]);

  // CLICK HANDLERS
  const handleAdd = () => {
    navigate("/property-setup"); // ⬅️ pindah ke halaman setup property
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-property/${id}`); // ⬅️ kirim id property
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center px-4 py-8">
      <div className="absolute top-6 left-6">
        <span className="tracking-[0.3em] text-xl font-semibold">TAXAVA</span>
      </div>

      <div className="w-full max-w-5xl pt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Manage Properties
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Logged in as{" "}
          <span className="font-semibold">{currentUser.username}</span>
        </p>

        {/* Search bar */}
        <div className="mb-8">
          <label
            htmlFor="property-search"
            className="block text-sm text-zinc-300 mb-2"
          >
            Search Property
          </label>

          <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-4 py-3 shadow-md">
            <span className="text-zinc-400 text-xl">
              <Search />
            </span>
            <input
              id="property-search"
              type="text"
              placeholder="Type property name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-zinc-500"
            />

            <button
              type="button"
              onClick={() => setSortAsc((prev) => !prev)}
              className="rounded-full border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300 hover:bg-zinc-700 transition"
            >
              {sortAsc ? "A → Z" : "Z → A"}
            </button>
          </div>
        </div>

        {/* List title */}
        <h2 className="text-lg font-semibold mb-4">List of Properties</h2>

        {/* Property cards */}
        <div className="space-y-4 mb-10">
          {filteredProperties.length === 0 && (
            <div className="text-zinc-400 text-sm">
              No properties found for this account.
            </div>
          )}

          {filteredProperties.map((property) => {
            const company = userCompanies.find(
              (c) => c.id === property.companyId
            );

            return (
              <div
                key={property.id}
                className="bg-zinc-800 rounded-2xl p-4 md:p-5 shadow-lg border border-zinc-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold">{property.name}</h3>
                  <p className="text-m text-zinc-300 flex gap-2 items-center">
                    <Phone className="w-4" /> {property.phone}
                  </p>
                  <p className="text-m text-zinc-300 flex gap-2 items-center">
                    <MapPinHouse className="w-4" /> {property.mailingAddress}
                  </p>
                  <p className="text-m text-zinc-300 flex gap-2 items-center">
                    <UserRound className="w-4" /> Type:{" "}
                    <span className="capitalize">{property.type}</span>
                  </p>

                  {company && (
                    <p className="text-m text-zinc-300 flex gap-2 items-center">
                      <Building2 className="w-4" /> Company: {company.name}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={() => handleEdit(property.id)} // ⬅️ EDIT
                    className="px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold shadow-md transition"
                  >
                    Edit Property
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Property */}
        <div className="mt-4 mb-10 pb-6 pt-4 border-t border-zinc-800 bg-zinc-900/60 sticky bottom-0">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAdd} // ⬅️ ADD
              className="px-10 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-base font-semibold shadow-lg transition"
            >
              Add Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProperties;
