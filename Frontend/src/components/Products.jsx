import React, { useState, useEffect } from "react";
import Product from "./Product";
import { userRequest } from "../requestMethod";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Products = ({ filters, sort, query }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  console.log(products)

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
        console.log(error);
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
          return String(item[key]).includes(value);
        })
      );
    }

    // apply sorting
    if (sort === "newest") {
      tempoProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "asc") {
      tempoProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      tempoProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempoProducts);
  }, [products, filters, sort]);

  return (
    <div className="flex flex-wrap gap-4">
      {filteredProducts.map((product) => (
  <Link key={product._id} to={`/product/${product._id}`}>
    <Product
      id={product._id}
      name={product.title}
      description={product.desc}
      price={product.price}
      image={product.img[0]}  
      rating={product.rating} 
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
