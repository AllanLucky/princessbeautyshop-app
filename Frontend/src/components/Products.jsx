import React, { useState, useEffect } from "react";
import Product from "./Product";
import { userRequest } from "../requestMethod";
import { useLocation, Link } from "react-router-dom";

const Products = ({ sort, query, filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  // Get category from query string
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        let url = "/products";

        if (category) {
          url += `?category=${category}`;
        } else if (query) {
          url += `?search=${query}`;
        }

        const res = await userRequest.get(url);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category, query]);

  // ================= APPLY FILTERS =================
  useEffect(() => {
    let temp = [...products];

    if (Object.keys(filters).length > 0) {
      temp = temp.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          value ? item[key]?.toString().includes(value) : true
        )
      );
    }

    setFilteredProducts(temp);
  }, [products, filters]);

  // ================= APPLY SORTING =================
  useEffect(() => {
    let temp = [...filteredProducts];

    if (sort === "newest") {
      temp.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (sort === "asc") {
      temp.sort(
        (a, b) =>
          Number(a.discountedPrice || a.originalPrice || 0) -
          Number(b.discountedPrice || b.originalPrice || 0)
      );
    }

    if (sort === "desc") {
      temp.sort(
        (a, b) =>
          Number(b.discountedPrice || b.originalPrice || 0) -
          Number(a.discountedPrice || a.originalPrice || 0)
      );
    }

    setFilteredProducts(temp);
  }, [sort]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading products...
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (!filteredProducts.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No products found.
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const price =
          product.discountedPrice ||
          product.originalPrice ||
          0;

        return (
          <Link key={product._id} to={`/product/${product._id}`}>
            <Product
              id={product._id}
              name={product.title}
              description={
                product.desc && product.desc.length > 80
                  ? product.desc.substring(0, 80) + "..."
                  : product.desc || ""
              }
              price={price}
              image={
                Array.isArray(product.img)
                  ? product.img[0]
                  : product.img || ""
              }
              rating={
                product.ratings?.length
                  ? product.ratings[0].star
                  : 0
              }
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Products;