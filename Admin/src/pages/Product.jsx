import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";
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
  const [loading, setLoading] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    categories: [],
    skintype: [],
    concern: [],
  });

  // ================= GET PRODUCT =================
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get(`/products/find/${id}`);
        setProduct(res.data);

        setSelectedOptions({
          categories: res.data.categories || [],
          skintype: res.data.skintype || [],
          concern: res.data.concern || [],
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch product");
      }
    };
    getProduct();
  }, [id]);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    if (e.target.files[0]) setSelectedImage(e.target.files[0]);
  };

  // ================= MULTI SELECT =================
  const handleSelectedChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].includes(value) ? prev[name] : [...prev[name], value],
    }));
  };

  const removeOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((v) => v !== value),
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imgArr = product.img || [];

      // upload image if new selected
      if (selectedImage) {
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          { method: "POST", body: data }
        );

        const uploadData = await uploadRes.json();
        imgArr = [uploadData.secure_url];
      }

      // stock logic
      const stockValue = inputs.stock !== undefined ? inputs.stock : product.stock;

      const updatedProduct = {
        ...product,
        ...inputs,
        ...selectedOptions,
        stock: stockValue,
        inStock: stockValue > 0,
        img: imgArr,
      };

      await userRequest.put(`/products/${id}`, updatedProduct);

      toast.success("🔥 Product updated successfully");
      setSelectedImage(null);
      setInputs({});
    } catch (err) {
      console.log(err);
      toast.error("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full min-w-[300px] bg-gray-50 min-h-screen overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-3xl font-semibold">Edit Product</h3>
        <Link to="/newproduct">
          <button className="bg-slate-700 text-white py-2 px-4 rounded-lg">
            Create
          </button>
        </Link>
      </div>

      {/* CHART + CARD */}
      <div className="flex flex-col md:flex-row gap-5 overflow-hidden">
        <div className="flex-1">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 4, 5, 6] }]}
            series={[{ data: [2, 5, 3, 7, 4, 6] }]}
            height={300}
          />
        </div>

        <div className="flex-1 bg-white p-5 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center mb-5">
            <img
              src={product.img?.[0]}
              alt=""
              className="h-20 w-20 rounded-full mr-5 object-cover"
            />
            <span className="text-2xl font-semibold">{product.title}</span>
          </div>

          <div className="space-y-2">
            <p><b>ID:</b> {product._id}</p>
            <p><b>Quantity:</b> {product.stock}</p>
            <p><b>Status:</b> {product.inStock ? "In Stock" : "Out of Stock"}</p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow overflow-hidden">
        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-4">
            <input
              className="input"
              name="title"
              placeholder={product.title}
              onChange={handleChange}
            />
            <input
              className="input"
              name="desc"
              placeholder={product.desc}
              onChange={handleChange}
            />

            <input
              className="input"
              type="number"
              name="originalPrice"
              placeholder={product.originalPrice}
              onChange={handleChange}
            />
            <input
              className="input"
              type="number"
              name="discountedPrice"
              placeholder={product.discountedPrice}
              onChange={handleChange}
            />

            <input
              className="input"
              type="number"
              name="stock"
              placeholder={`Quantity: ${product.stock}`}
              onChange={handleChange}
            />

            <Select
              label="Category"
              name="categories"
              options={["serum","cream","lotion","foundation"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              removeOption={removeOption}
            />
            <Select
              label="Skin Type"
              name="skintype"
              options={["all","oily","dry"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              removeOption={removeOption}
            />
            <Select
              label="Concern"
              name="concern"
              options={["acne","darkspots","aging"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              removeOption={removeOption}
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : product.img?.[0]}
              className="h-40 w-40 object-cover rounded-lg"
            />

            <input type="file" id="file" hidden onChange={handleImageChange} />
            <label htmlFor="file">
              <FaUpload className="text-3xl cursor-pointer" />
            </label>

            <button
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-3 rounded-lg font-semibold"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= SELECT COMPONENT =================
const Select = ({ label, name, options, selectedOptions, handleSelectedChange, removeOption }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <select name={name} onChange={handleSelectedChange} className="input">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>

    <div className="flex gap-2 mt-2 flex-wrap">
      {selectedOptions[name]?.map((opt) => (
        <span key={opt} className="bg-gray-200 px-2 py-1 rounded flex items-center">
          {opt}
          <FaTrash
            className="ml-2 text-red-500 cursor-pointer"
            onClick={() => removeOption(name, opt)}
          />
        </span>
      ))}
    </div>
  </div>
);

export default Product;
