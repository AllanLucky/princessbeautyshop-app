import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from "axios";
import { userRequest } from "../requestMethods";
import { useState } from "react";

const NewProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputs, setInputs] = useState({});
  const [image, setImage] = useState("");
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
  };

  // Input change handler
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Add selected option
  const handleSelectedChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: [...prev[name], value]
    }));
  };

  // Remove selected option
  const handleRemoveOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((option) => option !== value)
    }));
  };

  // Upload handler
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

      const uploadedImageUrl = uploadRes.data.secure_url;
      setImage(uploadedImageUrl);

      // Send product data to backend
      await userRequest.post("/products", {
        img: uploadedImageUrl,
        ...inputs,
        ...selectedOptions
      });

      setUploading("Uploaded 100%");
      console.log("Uploaded image URL:", uploadedImageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading("Upload failed!");
    }
  };

  return (
    <div className="p-5 w-[79vw]">
      {/* Header */}
      <div className="flex items-center justify-center mb-5">
        <h1 className="text-3xl font-semibold">New Product</h1>
      </div>

      <div className="mt-5 bg-white shadow-lg rounded-lg p-5">
        <form className="flex flex-col md:flex-row rounded-lg">

          {/* LEFT SIDE */}
          <div className="flex-1 space-y-5">

            {/* Product Image */}
            <div>
              <label className="font-semibold">Product Image</label>
              {!selectedImage ? (
                <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md mt-2">
                  <div className="flex items-center justify-center mt-[40px]">
                    <label htmlFor='file' className="cursor-pointer">
                      <FaPlus className="text-[20px]" />
                    </label>
                  </div>
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="h-[100px] w-[100px] object-cover rounded-md mt-2"
                />
              )}
              <input type="file" id='file' onChange={imageChange} style={{ display: "none" }} />
              <span className='text-green-500'>{uploading}</span>
            </div>

            {/* Product Name */}
            <div>
              <label className="block font-semibold mb-4">Product Name</label>
              <input
                type="text"
                name='title'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Product Name"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block font-semibold mb-4">Product Description</label>
              <textarea
                rows={7}
                name='desc'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Product Description"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block font-semibold mb-4">Product Original Price</label>
              <input
                type="number"
                name='originalPrice'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 20000"
              />
            </div>

            {/* Discounted Price */}
            <div>
              <label className="block font-semibold mb-4">Product Discounted Price</label>
              <input
                type="number"
                name='discountedPrice'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 2000"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 space-y-5 ml-6">

            {/* Wholesale Price */}
            <div>
              <label className="block font-semibold mb-4">Wholesale Price</label>
              <input
                type="number"
                name='wholesalePrice'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 17000"
              />
            </div>

            {/* Wholesale Minimum Quantity */}
            <div>
              <label className="block font-semibold mb-4">Wholesale Minimum Quantity</label>
              <input
                type="number"
                name='wholesaleMinimumQuantity'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="10"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block font-semibold mb-4">Brand</label>
              <input
                type="text"
                name='brand'
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Kylie"
              />
            </div>

            {/* Concern */}
            <div>
              <label className="block font-semibold mb-4">Concern</label>
              <select
                className="border-2 border-[#444] p-2 border-solid w-full rounded"
                onChange={handleSelectedChange}
                name="concern"
              >
                <option value="">Select concern</option>
                <option value="acne">Acne</option>
                <option value="dry-skin">Dry Skin</option>
                <option value="oily-skin">Oily Skin</option>
                <option value="dark-spots">Dark Spots</option>
                <option value="aging">Aging</option>
                <option value="sensitive-skin">Sensitive Skin</option>
              </select>
            </div>

            {/* Selected Concerns */}
            <div className='mt-2'>
              {selectedOptions.concern.map((option) => (
                <div key={option} className='flex items-center space-x-2'>
                  <span>{option}</span>
                  <FaTrash
                    className='cursor-pointer text-red-500'
                    onClick={() => handleRemoveOption("concern", option)}
                  />
                </div>
              ))}
            </div>

            {/* Skin Type */}
            <div>
              <label className="block font-semibold mb-4">Skin Type</label>
              <select
                className="border-2 border-[#444] p-2 border-solid w-full rounded"
              >
                <option value="">Select skin type</option>
                <option value="all">All</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="sensitive">Sensitive</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-4">Category</label>
              <select
                className="border-2 border-[#444] p-2 border-solid w-full rounded"
              >
                <option value="">Select category</option>
                <option value="foundations">Foundations</option>
                <option value="serum">Serum</option>
                <option value="toner">Toner</option>
                <option value="lotions">Lotions</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              className="bg-slate-500 text-white py-2 px-4 rounded-lg"
              onClick={handleUpload}
            >
              Create Product
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
