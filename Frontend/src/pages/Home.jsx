import React from "react";
import Banner from "../components/Banner";
import Products from "../components/Products";
import Category from "../components/Category";
import LatestBlogs from "../components/LatestBlogs"; // ✅ Add this

const Home = () => {
  return (
    <div>
      <Banner />
      <Category />
      <Products />

      {/* ✅ Public Latest Blog Section */}
      <LatestBlogs />
    </div>
  );
};

export default Home;