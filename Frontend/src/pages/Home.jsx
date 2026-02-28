import React from "react";
import Banner from "../components/Banner";
import Products from "../components/Products";
import Category from "../components/Category";
import LatestBlogs from "../components/LatestBlogs"; // ✅ Add this
import Packages from "./Package";

const Home = () => {
  return (
    <div>
      <Banner />
      {/* <Category /> */}
      {<Packages/>}
      <Products />
      <LatestBlogs />
    </div>
  );
};

export default Home;