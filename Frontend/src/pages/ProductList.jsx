import { useLocation } from "react-router-dom";
import Products from "../components/Products";
import { useState } from "react";

const ProductList = () => {
  const location = useLocation();
  const query = location.pathname.split("/")[2]; // category from URL

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  // ================= HANDLE FILTER =================
  const handleFilters = (e) => {
    const { name, value } = e.target;

    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters[name];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  // ================= RESET FILTER =================
  const resetFilters = () => {
    setFilters({});
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 pt-24 pb-10">
      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        {query ? query.toUpperCase() : "All Products"}
      </h1>

      {/* FILTER & SORT */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* LEFT FILTER */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-gray-700">Filter:</span>

          {/* SKIN TYPE */}
          <select
            name="concern"
            onChange={handleFilters}
            className="p-2 border rounded-md"
          >
            <option value="all">Skin Type</option>
            <option>Dry Skin</option>
            <option>Oily Skin</option>
            <option>Combination Skin</option>
            <option>Normal Skin</option>
            <option>Sensitive Skin</option>
            <option>Acne Prone</option>
            <option>Mature Skin</option>
            <option>Hyperpigmentation</option>
          </select>

          {/* BRAND */}
          <select
            name="brand"
            onChange={handleFilters}
            className="p-2 border rounded-md"
          >
            <option value="all">Brand</option>
            <option>Neutrogena</option>
            <option>Olay</option>
            <option>L'Oréal</option>
            <option>Garnier</option>
            <option>Clinique</option>
            <option>Nivea</option>
            <option>Cetaphil</option>
            <option>La Roche-Posay</option>
            <option>Fenty Beauty</option>
          </select>

          {/* RESET */}
          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
          >
            Reset
          </button>
        </div>

        {/* SORT */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">Sort:</span>
          <select
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border rounded-md"
            value={sort}
          >
            <option value="newest">Newest</option>
            <option value="asc">Price (Low → High)</option>
            <option value="desc">Price (High → Low)</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      <Products query={query} filters={filters} sort={sort} />
    </div>
  );
};

export default ProductList;