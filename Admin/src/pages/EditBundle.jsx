import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const EditBundle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    image: "",
    isPrebuilt: true,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ================= IMAGE CHANGE =================
  const imageChange = (e) => {
    if (e.target.files?.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => setSelectedImage(null);

  // ================= FETCH BUNDLE =================
  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setFetching(true);
        const res = await userRequest.get(`/bundles/${id}`);
        const bundle = res.data;

        if (bundle) {
          setForm({
            name: bundle.name || "",
            description: bundle.description || "",
            originalPrice: bundle.originalPrice || "",
            discountedPrice: bundle.discountedPrice || "",
            image: bundle.image || "",
            isPrebuilt: bundle.isPrebuilt ?? true,
          });
        }
      } catch (error) {
        toast.error(error,"Failed to load bundle");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBundle();
  }, [id]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "isPrebuilt"
          ? value === "true"
          : value,
    }));
  };

  // ================= UPDATE BUNDLE =================
  const updateBundle = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let imageUrl = form.image;

      // 1️⃣ Upload new image to Cloudinary if selected
      if (selectedImage) {
        setUploading(true);

        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "uploads"); // change if needed

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkjenslgr/image/upload",
          data
        );

        imageUrl = uploadRes.data.secure_url;
      }

      // 2️⃣ Send updated bundle to backend
      await userRequest.put(`/bundles/${id}`, {
        ...form,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        image: imageUrl,
      });

      toast.success("Bundle updated successfully 💖");
      setTimeout(() => navigate("/bundles"), 1200);

    } catch (error) {
      toast.error(error,"Update failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Bundle
          </h1>
          <Link to="/bundles">
            <button className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-xl transition">
              Back to Bundles
            </button>
          </Link>
        </div>

        {fetching ? (
          <div className="text-center py-12 text-gray-500">
            Loading bundle...
          </div>
        ) : (
          <form className="space-y-6" onSubmit={updateBundle}>

            {/* IMAGE SECTION */}
            <div>
              <label className="block font-semibold mb-3">
                Bundle Image
              </label>

              <div className="relative w-full sm:w-64 h-48 border-2 border-dashed rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50">

                {selectedImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    >
                      <FaTrash size={14} />
                    </button>
                  </>
                ) : form.image ? (
                  <>
                    <img
                      src={form.image}
                      alt="existing"
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="file"
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition"
                    >
                      Change Image
                    </label>
                  </>
                ) : (
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center text-gray-500 cursor-pointer"
                  >
                    <FaPlus className="text-3xl mb-2" />
                    Upload Image
                  </label>
                )}

                <input
                  type="file"
                  id="file"
                  hidden
                  onChange={imageChange}
                />
              </div>

              {uploading && (
                <p className="text-green-600 text-sm mt-2">
                  Uploading new image...
                </p>
              )}
            </div>

            {/* NAME */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Bundle Name"
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Bundle Description"
              className="w-full border p-4 rounded-xl h-40 focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />

            {/* PRICE SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="originalPrice"
                type="number"
                value={form.originalPrice}
                onChange={handleChange}
                placeholder="Original Price"
                className="border p-4 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
              <input
                name="discountedPrice"
                type="number"
                value={form.discountedPrice}
                onChange={handleChange}
                placeholder="Discounted Price"
                className="border p-4 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>

            {/* TYPE */}
            <select
              name="isPrebuilt"
              value={form.isPrebuilt}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="true">Prebuilt</option>
              <option value="false">Custom</option>
            </select>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Bundle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditBundle;