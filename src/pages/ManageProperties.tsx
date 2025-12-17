import React, { useMemo, useState } from "react";
import { Search, MapPinHouse, UserRound, Building2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { getPropertiesByUser } from "../utils/getProperty";
import { getCompaniesByUser } from "../utils/getCompany";
import Navbar from "../component/Navbar";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

const ManageProperties: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // ambil user yang sedang login dari localStorage
  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  const userCompanies = useMemo(() => {
    if (!currentUser) return [];
    return getCompaniesByUser(currentUser.id);
  }, [currentUser]);

  const propertiesOwned = useMemo(() => {
    if (!currentUser) return [];
    return getPropertiesByUser(currentUser.id);
  }, [currentUser]);

  // search + sort
  const filteredProperties = useMemo(() => {
    const lower = search.toLowerCase().trim();

    const filtered = propertiesOwned.filter((p) =>
      p.name.toLowerCase().includes(lower)
    );

    return filtered.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [propertiesOwned, search, sortAsc]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // CLICK HANDLERS
  const handleAdd = () => {
    navigate("/property-setup"); //  pindah ke halaman setup property
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-property/${id}`); //  kirim id property
  };

  return (
    <div className="min-h-screen text-white flex flex-col bg-linear-to-r/hsl from-[#191A1F] from-15% to-[#06012F]">
      {/* Navbar */}
      <Navbar />
      <div className="min-h-screen text-white flex justify-center px-4 py-10 bg-linear-to-r/hsl from-[#191A1F] from-15% to-[#06012F]">
        <div className="absolute top-6 left-6">
          <span className="tracking-[0.3em] text-xl font-semibold">TAXAVA</span>
        </div>

        <div className="w-full max-w-5xl pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Manage Properties
          </h1>

          {/* Search bar */}
          <div className="mb-8 mt-4">
            <label
              htmlFor="property-search"
              className="block text-sm text-zinc-300 mb-2"
            >
              Search Property
            </label>

            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-3 shadow-md bg">
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
                className="rounded-full border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
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
                  className="bg-zinc-700/40 backdrop-blur-sm  rounded-2xl p-4 md:p-5 shadow-lg border border-zinc-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold">{property.name}</h3>
                    <p className="text-m text-zinc-300 flex gap-2">
                      <UserRound className="w-4" />
                      Owner: {property.owner}
                    </p>
                    <p className="text-m text-zinc-300 flex gap-2">
                      <MapPinHouse className="w-4" />
                      Type: {property.type}
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
                      onClick={() => handleEdit(property.id)} //  EDIT
                      className="px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold shadow-md transition cursor-pointer"
                    >
                      Edit Property
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Property */}
          <div className="mt-4 mb-10 pb-6 pt-4 border-t-4 border-zinc-900 bg-linear-to-r/hsl from-[#191A1F] from-5% to-[#06012F] sticky bottom-0">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd} //  ADD
                className="px-10 py-3 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] hover:from-indigo-400 hover:to-[#8B5CF6]text-base font-semibold shadow-lg transition cursor-pointer"
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProperties;
