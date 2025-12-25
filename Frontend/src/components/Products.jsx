import React, { useState, useEffect } from "react";
import Product from "./Product"
import { userRequest } from "../requestMethod";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Products = ({ filters, sort, query }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        let response;
        if (query) {
          response = await userRequest.get(`/products?search=${query}`);
        } else {
          response = await userRequest.get("/products");
        }
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, [query]);

  useEffect(() => {
    let tempoProducts = [...products];

    // apply filters
    if (filters) {
      tempoProducts = tempoProducts.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return String(item[key])
            .toLowerCase()
            .includes(String(value).toLowerCase());
        })
      );
    }

    // apply sorting
    if (sort === "newest") {
      tempoProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "asc") {
      tempoProducts.sort(
        (a, b) =>
          (a.price || a.originalPrice) - (b.price || b.originalPrice)
      );
    } else if (sort === "desc") {
      tempoProducts.sort(
        (a, b) =>
          (b.price || b.originalPrice) - (a.price || a.originalPrice)
      );
    }

    setFilteredProducts(tempoProducts);
  }, [products, filters, sort]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Link key={product._id} to={`/product/${product._id}`}>
          <Product
            id={product._id}
            name={product.title}
            description={
              product.desc && product.desc.length > 80
                ? product.desc.substring(0, 80) + "..."
                : product.desc
            }
            price={product.price || product.originalPrice || "N/A"}
            image={Array.isArray(product.img) ? product.img[0] : product.img}
            rating={product.rating || 0}
          />
        </Link>
      ))}
    </div>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
  query: PropTypes.string,
};

export default Products;
