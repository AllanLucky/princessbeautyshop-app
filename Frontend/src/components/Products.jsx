import React, { useState, useEffect, useMemo } from "react";
import Product from "./Product";
import { userRequest } from "../requestMethod";
import { useLocation, Link } from "react-router-dom";

const Products = ({ sort, query, filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  // ================= GET CATEGORY =================
  const category = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category");
  }, [location.search]);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        let url = "/products";

        const params = new URLSearchParams();

        if (category) params.append("category", category);
        if (query) params.append("search", query);

        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }

        const res = await userRequest.get(url);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category, query]);

  // ================= FILTER + SORT =================
  const filteredProducts = useMemo(() => {
    let temp = [...products];

    // Apply Filters
    if (Object.keys(filters).length > 0) {
      temp = temp.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          value ? item[key]?.toString().toLowerCase().includes(value.toLowerCase()) : true
        )
      );
    }

    // Apply Sorting
    if (sort === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "asc") {
      temp.sort(
        (a, b) =>
          Number(a.discountedPrice || a.originalPrice || 0) -
          Number(b.discountedPrice || b.originalPrice || 0)
      );
    } else if (sort === "desc") {
      temp.sort(
        (a, b) =>
          Number(b.discountedPrice || b.originalPrice || 0) -
          Number(a.discountedPrice || a.originalPrice || 0)
      );
    }

    return temp;
  }, [products, filters, sort]);

  // ================= LOADING SKELETON =================
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-8">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-80 bg-gray-100 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (!filteredProducts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <h2 className="text-xl font-semibold mb-2">
          No products found
        </h2>
        <p className="text-sm">
          Try adjusting filters or search terms.
        </p>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-8">
      {filteredProducts.map((product) => (
        <Link
          key={product._id}   // ✅ no more Math.random()
          to={`/product/${product._id}`}
          className="block transform hover:scale-[1.02] transition duration-300"
        >
          <Product product={product} />
        </Link>
      ))}
    </div>
  );
};

export default Products;