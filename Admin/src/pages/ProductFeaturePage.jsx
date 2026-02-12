import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ProductFeaturePage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
<<<<<<< HEAD

  // ===== FEATURES =====
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);

  // ===== SPECIFICATIONS =====
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [specs, setSpecs] = useState([]);

=======
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [specs, setSpecs] = useState([]);
>>>>>>> 394ec64 (Updating productFeaturePage)
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////////////////////
  // 🔥 FETCH PRODUCT
  //////////////////////////////////////////////////////
  const fetchProduct = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD

      const res = await userRequest.get(`/products/find/${id}`);
=======
      const res = await userRequest.get(`/products/find/${id}`, {
        withCredentials: true, // ensure cookie is sent
      });
>>>>>>> 394ec64 (Updating productFeaturePage)
      const data = res.data;

      setProduct(data);
      setFeatures(data.features || []);
      setSpecs(data.specifications || []);
    } catch (err) {
<<<<<<< HEAD
      console.log(err);
=======
      console.error(err);
>>>>>>> 394ec64 (Updating productFeaturePage)
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
    if (!featureInput.trim()) {
      return toast.error("Write feature first");
    }
<<<<<<< HEAD

    setFeatures([...features, featureInput]);
    setFeatureInput("");
=======
    setFeatures([...features, featureInput]);
    setFeatureInput("");
    console.log(addFeature);
>>>>>>> 394ec64 (Updating productFeaturePage)
  };

  const removeFeature = (item) => {
    setFeatures(features.filter((f) => f !== item));
  };

  //////////////////////////////////////////////////////
  // 🔥 ADD SPECIFICATION
  //////////////////////////////////////////////////////
  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim()) {
      return toast.error("Add title and description");
<<<<<<< HEAD
    }

    setSpecs([...specs, { key: specKey, value: specValue }]);
    setSpecKey("");
    setSpecValue("");
=======
      
    }
    setSpecs([...specs, { key: specKey, value: specValue }]);
    setSpecKey("");
    setSpecValue("");
    console.log(addSpec);
>>>>>>> 394ec64 (Updating productFeaturePage)
  };

  const removeSpec = (index) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  //////////////////////////////////////////////////////
  // 🔥 SAVE TO DATABASE
  //////////////////////////////////////////////////////
  const saveData = async () => {
    try {
      await userRequest.put(`/products/${id}`, {
        features,
        specifications: specs,
<<<<<<< HEAD
      });

      toast.success("Product updated successfully 🔥");

      // reload product
      fetchProduct();
    } catch (err) {
      console.log(err);
=======
      }, {
        withCredentials: true, // ensure cookie is sent
      });

      toast.success("Product updated successfully 🔥");
      fetchProduct();
    } catch (err) {
      console.error(err);
>>>>>>> 394ec64 (Updating productFeaturePage)
      toast.error(
        err.response?.data?.message || "Update failed or not authorized"
      );
    }
  };

  //////////////////////////////////////////////////////
  // 🔥 LOADING STATE
  //////////////////////////////////////////////////////
<<<<<<< HEAD
  if (loading)
    return (
      <div className="p-10 text-lg font-semibold">
        ⏳ Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="p-10 text-red-500 font-semibold">
        ❌ Product not found
      </div>
    );
=======
  if (loading) {
    return <div className="p-10 text-lg font-semibold">⏳ Loading product...</div>;
  }

  if (!product) {
    return <div className="p-10 text-red-500 font-semibold">❌ Product not found</div>;
  }
>>>>>>> 394ec64 (Updating productFeaturePage)

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      <ToastContainer position="top-right" autoClose={2000} />

<<<<<<< HEAD
      {/* HEADER */}
=======
>>>>>>> 394ec64 (Updating productFeaturePage)
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
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          <p className="text-gray-500 text-sm">{product.desc}</p>
        </div>
      </div>

<<<<<<< HEAD
      {/* ================= FEATURES ================= */}
=======
      {/* FEATURES */}
>>>>>>> 394ec64 (Updating productFeaturePage)
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-1">Product Features</h2>
        <p className="text-sm text-gray-500 mb-4">
          These appear as highlights on product page
        </p>
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <div className="flex gap-3">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            className="border px-4 py-3 rounded w-full"
            placeholder="Example: Vitamin C Brightening"
          />
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
          <button
            onClick={addFeature}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded flex items-center gap-2"
          >
            <FaPlusCircle /> Add
          </button>
        </div>
<<<<<<< HEAD

        {/* FEATURE LIST */}
=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <div className="flex flex-wrap gap-3 mt-5">
          {features.map((f, i) => (
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

<<<<<<< HEAD
      {/* ================= SPECIFICATIONS ================= */}
=======
      {/* SPECIFICATIONS */}
>>>>>>> 394ec64 (Updating productFeaturePage)
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-1">Specifications</h2>
        <p className="text-sm text-gray-500 mb-4">
          Main title bold, description small (professional style)
        </p>
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <div className="grid grid-cols-2 gap-3">
          <input
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            className="border px-4 py-3 rounded"
            placeholder="Main Title (Example: Skin Type)"
          />
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
          <input
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className="border px-4 py-3 rounded"
            placeholder="Small description"
          />
        </div>
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <button
          onClick={addSpec}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-4 rounded flex items-center gap-2"
        >
          <FaPlusCircle /> Add Specification
        </button>
<<<<<<< HEAD

        {/* SPEC LIST */}
=======
>>>>>>> 394ec64 (Updating productFeaturePage)
        <div className="mt-6 space-y-3">
          {specs.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
            >
              <div>
                <p className="font-bold text-lg">{s.key}</p>
                <p className="text-sm text-gray-600">{s.value}</p>
              </div>
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
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

<<<<<<< HEAD
export default ProductFeaturePage;
=======
export default ProductFeaturePage;
>>>>>>> 394ec64 (Updating productFeaturePage)
