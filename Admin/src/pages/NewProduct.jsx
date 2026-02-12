import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { userRequest } from "../requestMethods";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputs, setInputs] = useState({});
  const [uploading, setUploading] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    concern: [],
    skintype: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);

  // ================= IMAGE =================
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));
  };

  // ================= SELECT =================
  const handleSelectedChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].includes(value) ? prev[name] : [...prev[name], value],
    }));
  };

  const handleRemoveOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((option) => option !== value),
    }));
  };

  // ================= RESET =================
  const resetForm = () => {
    setSelectedImage(null);
    setInputs({});
    setSelectedOptions({ concern: [], skintype: [], categories: [] });
    setUploading("");
  };

  // ================= CREATE PRODUCT =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    if (!inputs.title || !inputs.desc) {
      toast.error("Title and description required");
      return;
    }

    try {
      setLoading(true);
      setUploading("Uploading image...");

      // Upload to cloudinary
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "uploads");

      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
        data
      );

      // 🔥 FIX: cloudinary correct url
      const imageUrl = uploadRes.data.secure_url;

      // send to backend
      await userRequest.post("/products", {
        img: [imageUrl], // must be array for mongoose
        ...inputs,
        ...selectedOptions,
      });

      toast.success("Product created successfully 🔥");
      setUploading("Uploaded 100%");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
      setUploading("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-[77vw] overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-semibold">Add New Product</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form className="flex flex-col md:flex-row gap-6">

          {/* LEFT */}
          <div className="flex-1 space-y-5">

            {/* IMAGE */}
            <div>
              <label className="font-semibold mb-2">Product Image</label>
              <div className="relative">
                {!selectedImage ? (
                  <div className="border-2 h-32 w-32 border-gray-400 rounded-md flex items-center justify-center cursor-pointer">
                    <label htmlFor="file" className="flex flex-col items-center text-gray-600">
                      <FaPlus className="text-2xl mb-1" />
                      Select Image
                    </label>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                )}
                <input type="file" id="file" onChange={imageChange} hidden />
              </div>
              {uploading && <span className="text-green-600">{uploading}</span>}
            </div>

            {/* NAME */}
            <div>
              <label className="block font-semibold mb-2">Product Name</label>
              <input
                name="title"
                value={inputs.title || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Product name"
              />
            </div>

            {/* DESC */}
            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="desc"
                value={inputs.desc || ""}
                onChange={handleChange}
                rows={5}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={inputs.originalPrice || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold">Discount Price</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={inputs.discountedPrice || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* 🔥 STOCK */}
            <div>
              <label className="font-semibold">Product Stock</label>
              <input
                type="number"
                name="stock"
                value={inputs.stock || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter stock quantity e.g 50"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 space-y-5">

            {/* BRAND */}
            <div>
              <label className="font-semibold">Brand</label>
              <input
                name="brand"
                value={inputs.brand || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* CATEGORY */}
            <SelectOption
              label="Category"
              name="categories"
              options={["foundations", "serum", "toner", "lotions"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              handleRemoveOption={handleRemoveOption}
            />

            {/* SKIN */}
            <SelectOption
              label="Skin Type"
              name="skintype"
              options={["all", "oily", "dry", "sensitive"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              handleRemoveOption={handleRemoveOption}
            />

            {/* CONCERN */}
            <SelectOption
              label="Concern"
              name="concern"
              options={["acne", "dark-spots", "aging"]}
              selectedOptions={selectedOptions}
              handleSelectedChange={handleSelectedChange}
              handleRemoveOption={handleRemoveOption}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

// ================= SELECT COMPONENT =================
const SelectOption = ({ label, name, options, selectedOptions, handleSelectedChange, handleRemoveOption }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <select
      name={name}
      onChange={handleSelectedChange}
      className="w-full border rounded px-3 py-2 mt-1"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>

    <div className="flex flex-wrap gap-2 mt-2">
      {selectedOptions[name].map((option) => (
        <span key={option} className="bg-gray-200 px-2 py-1 rounded flex items-center">
          {option}
          <FaTrash
            className="ml-2 text-red-500 cursor-pointer"
            onClick={() => handleRemoveOption(name, option)}
          />
        </span>
      ))}
    </div>
  </div>
);

export default NewProduct;