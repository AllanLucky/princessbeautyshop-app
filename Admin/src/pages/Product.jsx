import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [inputs, setInputs] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await userRequest.get("/products/find/" + id);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imgUrl = product.img;
      if (selectedImage) {
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          { method: "POST", body: data }
        );
        const uploadData = await uploadRes.json();
        imgUrl = uploadData.url;
      }

      await userRequest.put(`/products/${id}`, { ...inputs, img: imgUrl });

      // Show success toast
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Optionally reset inputs
      setInputs({});
      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-5 w-[79vw]">
      <ToastContainer />
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl font-semibold">Product</h3>
        <Link to="/newproduct">
          <button className="bg-slate-500 text-white py-2 px-4 rounded-lg">
            Create
          </button>
        </Link>
      </div>

      {/* CHART + PRODUCT CARD */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* CHART */}
        <div className="flex-1">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 4, 5, 6] }]}
            series={[{ data: [2, 5, 3, 7, 4, 6] }]}
            height={300}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>

        {/* PRODUCT CARD */}
        <div className="flex-1 bg-white p-5 rounded-lg shadow-lg">
          <div className="flex items-center mb-5">
            <img
              src={product.img?.[0] || product.img}
              alt=""
              className="h-20 w-20 rounded-full mr-5"
            />
            <span className="text-2xl font-semibold">{product.title}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">ID</span>
              <span>{product._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sales</span>
              <span>{product.sales || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">In Stock</span>
              <span>{product.inStock ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="mt-5 p-5 bg-white shadow-lg rounded-lg">
        <form className="flex flex-col md:flex-row gap-5" onSubmit={handleUpdate}>
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-5">
            <input
              type="text"
              name="title"
              placeholder={product.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              value={inputs.title || ""}
            />
            <input
              type="text"
              name="desc"
              placeholder={product.desc}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              value={inputs.desc || ""}
            />
            <input
              type="number"
              name="originalPrice"
              placeholder={product.originalPrice}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              value={inputs.originalPrice || ""}
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder={product.discountedPrice}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              value={inputs.discountedPrice || ""}
            />
            <select
              name="inStock"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              value={inputs.inStock || product.inStock}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col items-center space-y-5">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : product.img?.[0] || product.img}
              alt=""
              className="h-32 w-32 rounded-full"
            />
            <input type="file" onChange={handleImageChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer">
              <FaUpload className="text-3xl text-gray-800" />
            </label>
            <button
              type="submit"
              className="bg-slate-600 text-white py-3 px-6 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Product;

