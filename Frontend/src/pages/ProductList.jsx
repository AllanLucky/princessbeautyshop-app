import { useLocation } from "react-router-dom";
import Products from "../components/Products";
import { useState } from "react";

const ProductList = () => {
  const location = useLocation();
  const query = location.pathname.split("/")[2];

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  // Handle filter change
  const handleFilters = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* FILTER & SORT SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

        {/* LEFT SIDE - FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Filter Products
          </h2>

          {/* Concern Filter */}
          <select
            name="concern"
            onChange={handleFilters}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Concerns</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Pigmentation">Pigmentation</option>
            <option value="Oil Control">Oil Control</option>
            <option value="Anti Acne">Anti Acne</option>
            <option value="Sunburn">Sunburn</option>
            <option value="Skin Brightening">Skin Brightening</option>
            <option value="Tan Removal">Tan Removal</option>
            <option value="Night Routine">Night Routine</option>
            <option value="UV Protection">UV Protection</option>
            <option value="Damaged Hair">Damaged Hair</option>
            <option value="Frizzy Hair">Frizzy Hair</option>
            <option value="Stretch Marks">Stretch Marks</option>
            <option value="Color Protection">Color Protection</option>
            <option value="Dry Hair">Dry Hair</option>
            <option value="Soothing">Soothing</option>
            <option value="Dandruff">Dandruff</option>
            <option value="Greying">Greying</option>
            <option value="Hairfall">Hairfall</option>
            <option value="Hair Color">Hair Color</option>
            <option value="Well Being">Well Being</option>
            <option value="Acne">Acne</option>
            <option value="Hair Growth">Hair Growth</option>
          </select>

          {/* Brand Filter */}
          <select
            name="brand"
            onChange={handleFilters}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            <option value="Garnier">Garnier</option>
            <option value="Kylie">Kylie</option>
            <option value="Kiss Beauty">Kiss Beauty</option>
            <option value="Dr Rashel">Dr Rashel</option>
            <option value="Luron">Luron</option>
            <option value="Nivea">Nivea</option>
            <option value="Heaven Dove">Heaven Dove</option>
            <option value="Disaar">Disaar</option>
            <option value="Johnsons Baby">Johnsons Baby</option>
            <option value="Rexona">Rexona</option>
          </select>
        </div>

        {/* RIGHT SIDE - SORT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sort Products
          </h2>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="asc">Price (Low → High)</option>
            <option value="desc">Price (High → Low)</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS COMPONENT */}
      <Products query={query} filters={filters} sort={sort} />
    </div>
  );
};

export default ProductList;