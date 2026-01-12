import React, { useState, useEffect } from "react";
import Product from "./Product";
import { userRequest } from "../requestMethod";
import { useLocation } from "react-router-dom";

const Products = ({ sort, query }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // Get category from query string
  const params = new URLSearchParams(location.search);
  const category = params.get("category"); // e.g., "Serum"

  // Fetch products from backend
  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = "/products";
        if (category) url += `?category=${category}`;
        else if (query) url += `?search=${query}`;

        const res = await userRequest.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    getProducts();
  }, [category, query]);

  // Apply sorting
  useEffect(() => {
    let tempProducts = [...products];

    if (sort === "newest") {
      tempProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "asc") {
      tempProducts.sort(
        (a, b) =>
          (a.discountedPrice || a.originalPrice) -
          (b.discountedPrice || b.originalPrice)
      );
    } else if (sort === "desc") {
      tempProducts.sort(
        (a, b) =>
          (b.discountedPrice || b.originalPrice) -
          (a.discountedPrice || a.originalPrice)
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, sort]);

  if (!filteredProducts.length)
    return <div className="text-center mt-10">No products found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Product
          key={product._id}
          id={product._id}
          name={product.title}
          description={
            product.desc && product.desc.length > 80
              ? product.desc.substring(0, 80) + "..."
              : product.desc
          }
          price={product.discountedPrice || product.originalPrice || "N/A"}
          image={Array.isArray(product.img) ? product.img[0] : product.img}
          rating={product.ratings?.length ? product.ratings[0].star : 0}
        />
      ))}
    </div>
  );
};

export default Products;

