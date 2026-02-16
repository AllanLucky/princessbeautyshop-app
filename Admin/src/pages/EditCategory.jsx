import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ name: "", description: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetching(true);
        const res = await userRequest.get(`/categories/${id}`);
        const data = res.data.data;

        setInputs({ name: data.name, description: data.description });
        setExistingImage(data.image || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch category");
        setTimeout(() => navigate("/categories"), 5000);
      } finally {
        setFetching(false);
      }
    };
    fetchCategory();
  }, [id, navigate]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= IMAGE SELECT =================
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // ================= UPDATE CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.name) return toast.error("Category name is required");

    try {
      setLoading(true);

      let imageUrl = existingImage;
      if (selectedImage) {
        // Upload to Cloudinary
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads"); // your Cloudinary preset

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
          data
        );

        imageUrl = uploadRes.data.secure_url;
      }

      await userRequest.put(`/categories/${id}`, {
        name: inputs.name,
        description: inputs.description,
        image: imageUrl,
      });

      toast.success("Category updated successfully 🎉");
      setTimeout(() => navigate("/categories"), 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-10 text-lg">Loading category...</div>;

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

       <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold">Edit Category</h1>
              <Link to="/categories">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
                  Back
                </button>
              </Link>
            </div>

      <div className="p-5 w-[77vw] bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <input
            name="name"
            value={inputs.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border rounded p-3 w-full h-14"
          />

          {/* Description */}
          <input
            name="description"
            value={inputs.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded p-3 w-full h-14"
          />

          {/* Image Upload */}
          <div className="col-span-full">
            <label className="font-semibold mb-2">Category Image</label>
            <div className="relative">
              {!selectedImage ? (
                existingImage ? (
                  <img
                    src={existingImage}
                    alt="Existing"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                ) : (
                  <div className="border-2 h-32 w-32 border-gray-400 rounded-md flex items-center justify-center cursor-pointer">
                    <label htmlFor="file" className="flex flex-col items-center text-gray-600">
                      <FaPlus className="text-2xl mb-1" />
                      Select Image
                    </label>
                  </div>
                )
              ) : (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="h-32 w-32 object-cover rounded-md border"
                />
              )}
              <input type="file" id="file" onChange={handleImageChange} hidden />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
