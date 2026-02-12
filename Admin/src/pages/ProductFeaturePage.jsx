import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ProductFeaturePage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== FEATURES =====
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);

  // ===== SPECIFICATIONS =====
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [specs, setSpecs] = useState([]);

  //////////////////////////////////////////////////////
  // 🔥 FETCH PRODUCT
  //////////////////////////////////////////////////////
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(`/products/find/${id}`);
      const data = res.data;

      setProduct(data);
      setFeatures(data.features || []);
      setSpecs(data.specifications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  //////////////////////////////////////////////////////
  // 🔥 ADD FEATURE
  //////////////////////////////////////////////////////
  const addFeature = () => {
    if (!featureInput.trim()) return toast.error("Write feature first");

    setFeatures((prev) => [...prev, featureInput.trim()]);
    toast.success("Feature added");
    setFeatureInput("");
  };

  const removeFeature = (item) => {
    setFeatures((prev) => prev.filter((f) => f !== item));
    toast.info("Feature removed");
  };

  //////////////////////////////////////////////////////
  // 🔥 ADD SPECIFICATION
  //////////////////////////////////////////////////////
  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim())
      return toast.error("Add title and description");

    setSpecs((prev) => [...prev, { key: specKey.trim(), value: specValue.trim() }]);
    toast.success("Specification added");
    setSpecKey("");
    setSpecValue("");
  };

  const removeSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
    toast.info("Specification removed");
  };

  //////////////////////////////////////////////////////
  // 🔥 SAVE TO DATABASE
  //////////////////////////////////////////////////////
  const saveData = async () => {
    try {
      if (!product) return;

      const res = await userRequest.put(`/products/${id}`, {
        features,
        specifications: specs,
      });

      setProduct(res.data);
      setFeatures(res.data.features || []);
      setSpecs(res.data.specifications || []);

      toast.success("Product features & specifications updated successfully 🔥");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed or not authorized");
    }
  };

  //////////////////////////////////////////////////////
  // 🔥 LOADING STATE
  //////////////////////////////////////////////////////
  if (loading)
    return (
      <div className="p-10 text-lg font-semibold">⏳ Loading product...</div>
    );

  if (!product)
    return (
      <div className="p-10 text-red-500 font-semibold">❌ Product not found</div>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-1">Product Features Manager</h1>
      <p className="text-gray-500 mb-6">
        Add professional features & specifications for this product
      </p>

      {/* PRODUCT INFO */}
      <div className="bg-white shadow rounded-xl p-5 mb-8 flex items-center gap-4">
        <img
          src={product?.img?.[0] || "https://via.placeholder.com/80"}
          alt=""
          className="w-20 h-20 rounded-lg object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          <p className="text-gray-500 text-sm">{product.desc}</p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-1">Product Features</h2>
        <p className="text-sm text-gray-500 mb-4">
          These appear as highlights on product page
        </p>
        <div className="flex gap-3">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            className="border px-4 py-3 rounded w-full"
            placeholder="Example: Vitamin C Brightening"
          />
          <button
            onClick={addFeature}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded flex items-center gap-2"
          >
            <FaPlusCircle /> Add
          </button>
        </div>

        {/* FEATURE LIST */}
        <div className="flex flex-wrap gap-3 mt-5">
          {features?.map((f, i) => (
            <span
              key={i}
              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full flex items-center"
            >
              {f}
              <FaTrash
                className="ml-3 cursor-pointer text-red-500"
                onClick={() => removeFeature(f)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ================= SPECIFICATIONS ================= */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-1">Specifications</h2>
        <p className="text-sm text-gray-500 mb-4">
          Main title bold, description small (professional style)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            className="border px-4 py-3 rounded"
            placeholder="Main Title (Example: Skin Type)"
          />
          <input
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className="border px-4 py-3 rounded"
            placeholder="Small description"
          />
        </div>
        <button
          onClick={addSpec}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-4 rounded flex items-center gap-2"
        >
          <FaPlusCircle /> Add Specification
        </button>

        {/* SPEC LIST */}
        <div className="mt-6 space-y-3">
          {specs?.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
            >
              <div>
                <p className="font-bold text-lg">{s.key}</p>
                <p className="text-sm text-gray-600">{s.value}</p>
              </div>
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => removeSpec(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveData}
        className="bg-black hover:bg-gray-900 text-white px-10 py-4 rounded-xl w-full text-lg font-semibold"
      >
        💾 SAVE PRODUCT FEATURES & SPECS
      </button>
    </div>
  );
};

export default ProductFeaturePage;
