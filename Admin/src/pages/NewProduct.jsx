import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from "axios";
import { userRequest } from "../requestMethods";
import { useState } from "react";

const NewProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputs, setInputs] = useState({});
  const [uploading, setUploading] = useState("Uploading is 0%");
  const [selectedOptions, setSelectedOptions] = useState({
    concern: [],
    skintype: [],
    categories: []
  });

  // Image selection
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  }

  // Input change handler
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  // Add selected option
  const handleSelectedChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].includes(value) ? prev[name] : [...prev[name], value]
    }));
  }

  // Remove selected option
  const handleRemoveOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((option) => option !== value)
    }));
  }

  // Upload and create product
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "uploads");

    setUploading("Uploading...");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
        data
      );

      const { url } = uploadRes.data;

      await userRequest.post("/products", { img: url, ...inputs, ...selectedOptions });

      setUploading("Uploaded 100%");
      alert("Product uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading("Upload failed!");
    }
  }

  return (
    <div className="p-5 w-[79vw]">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-semibold">Add New Product</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form className="flex flex-col md:flex-row gap-6">

          {/* LEFT SIDE */}
          <div className="flex-1 space-y-5">

            {/* Product Image */}
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
                <input type="file" id="file" onChange={imageChange} style={{ display: "none" }} />
              </div>
              <span className="text-green-500 mt-1">{uploading}</span>
            </div>

            {/* Product Name */}
            <div>
              <label className="block font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block font-semibold mb-2">Product Description</label>
              <textarea
                name="desc"
                onChange={handleChange}
                placeholder="Product Description"
                rows={6}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Original Price (KES)</label>
                <input
                  type="number"
                  name="originalPrice"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="20000"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Discounted Price (KES)</label>
                <input
                  type="number"
                  name="discountedPrice"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="18000"
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 space-y-5">

            {/* Wholesale & Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Wholesale Price (KES)</label>
                <input
                  type="number"
                  name="wholesalePrice"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="17000"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Minimum Qty</label>
                <input
                  type="number"
                  name="wholesaleMinimumQuantity"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Kylie"
              />
            </div>

            {/* Select Options */}
            <div>
              <label className="block font-semibold mb-2">Concern</label>
              <select
                name="concern"
                onChange={handleSelectedChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select concern</option>
                <option value="acne">Acne</option>
                <option value="dry-skin">Dry Skin</option>
                <option value="oily-skin">Oily Skin</option>
                <option value="dark-spots">Dark Spots</option>
                <option value="aging">Aging</option>
                <option value="sensitive-skin">Sensitive Skin</option>
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedOptions.concern.map((option) => (
                  <span key={option} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                    {option}
                    <FaTrash
                      className="ml-1 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveOption("concern", option)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Skin Type</label>
              <select
                name="skintype"
                onChange={handleSelectedChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select skin type</option>
                <option value="all">All</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="sensitive">Sensitive</option>
                <option value="normal">Normal</option>
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedOptions.skintype.map((option) => (
                  <span key={option} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                    {option}
                    <FaTrash
                      className="ml-1 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveOption("skintype", option)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Category</label>
              <select
                name="categories"
                onChange={handleSelectedChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select category</option>
                <option value="foundations">Foundations</option>
                <option value="serum">Serum</option>
                <option value="toner">Toner</option>
                <option value="lotions">Lotions</option>
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedOptions.categories.map((option) => (
                  <span key={option} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                    {option}
                    <FaTrash
                      className="ml-1 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveOption("categories", option)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white font-semibold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
            >
              Create Product
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProduct;
