import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import axios from "axios";

const Banners = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState("Uploading is 0%");
  const [loading, setLoading] = useState(false);

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Upload and create banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage || !title || !subtitle) return;

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
      setUploading("Uploaded 100%");

      // Send banner data to server
      await userRequest.post("/banners", {
        img: url,
        title: title,
        subtitle: subtitle,
      });

      // Refresh banners
      const response = await userRequest.get("/banners");
      setBanners(response.data);

      // Reset form
      setSelectedImage(null);
      setTitle("");
      setSubtitle("");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading("Upload failed!");
    }
  };

  useEffect(() => {
    const getBanners = async () => {
      setLoading(true);
      try {
        const response = await userRequest.get("/banners");
        setBanners(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await userRequest.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 gap-8 bg-gray-50 min-h-screen">

      {/* LEFT SIDE – Displays existing banners */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">Active Banners</h2>
        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-gray-400">No banners available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{banner.title}</h3>
                  <p className="text-gray-600">{banner.subtitle}</p>
                </div>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition flex items-center gap-2"
                  onClick={() => handleDelete(banner._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE – Form to upload a new banner */}
      <div className="w-full md:w-[300px] bg-white p-6 rounded-xl shadow flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-4">Upload New Banner</h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center">
          {!selectedImage ? (
            <label className="cursor-pointer w-[120px] h-[120px] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md">
              <FaPlus className="text-2xl text-gray-400" />
              <input
                type="file"
                onChange={imageChange}
                className="hidden"
              />
            </label>
          ) : (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-[120px] h-[120px] object-cover rounded-md"
            />
          )}
          <span className="text-green-500 mt-2">{uploading}</span>
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <button
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md font-semibold mt-4 transition"
          onClick={handleUpload}
        >
          Upload Banner
        </button>
      </div>
    </div>
  );
};

export default Banners;
