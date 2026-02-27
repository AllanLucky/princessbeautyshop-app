import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaStar } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBundles: 0,
    prebuiltBundles: 0,
    customBundles: 0,
    totalRevenue: 0,
  });

  /* ================= FETCH BUNDLES ================= */

  useEffect(() => {
    const getBundles = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get("/bundles");
        const bundlesData = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setBundles(bundlesData);

        // Stats calculation
        const totalBundles = bundlesData.length;
        const prebuiltBundles = bundlesData.filter(b => b?.isPrebuilt).length;
        const customBundles = bundlesData.filter(b => !b?.isPrebuilt).length;
        const totalRevenue = bundlesData.reduce(
          (total, b) => total + ((b?.discountedPrice || 0) * (b?.sales || 0)),
          0
        );

        setStats({ totalBundles, prebuiltBundles, customBundles, totalRevenue });
      } catch (error) {
        console.error("Error fetching bundles:", error);
        toast.error("Failed to fetch bundles");
        setBundles([]);
      } finally {
        setIsLoading(false);
      }
    };

    getBundles();
  }, []);

  /* ================= SEARCH FILTER ================= */

  const filteredBundles = Array.isArray(bundles)
    ? bundles.filter(
        b =>
          b?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  /* ================= DELETE BUNDLE ================= */

  const handleDeleteBundle = async (bundleId) => {
    if (!window.confirm("Are you sure you want to delete this bundle?")) return;

    try {
      await userRequest.delete(`/bundles/${bundleId}`);
      setBundles(prev => prev.filter(b => b._id !== bundleId));
      toast.success("Bundle deleted successfully");
    } catch (error) {
      console.error("Error deleting bundle:", error);
      toast.error("Failed to delete bundle");
    }
  };

  /* ================= FORMAT PRICE ================= */

  const formatPrice = (price) => `KES ${price?.toLocaleString() || "0"}`;

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="flex-1 p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading bundles...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Beauty Bundles</h1>
            <p className="text-gray-600">Manage and create beautiful product packages</p>
          </div>

          <Link
            to="/bundles/create"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Create Bundle
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Bundles" value={stats.totalBundles} />
          <StatCard title="Prebuilt" value={stats.prebuiltBundles} />
          <StatCard title="Custom" value={stats.customBundles} />
          <StatCard title="Revenue" value={formatPrice(stats.totalRevenue)} />
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search bundles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <div key={bundle._id} className="bg-white rounded-xl shadow p-5">
              <img
                src={bundle?.image}
                alt={bundle?.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />

              <h3 className="font-bold text-lg mb-2">{bundle?.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{bundle?.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-pink-600 font-bold">
                  {formatPrice(bundle?.discountedPrice)}
                </span>

                {bundle?.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar /> {bundle.rating}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/edit/${bundle._id}`}
                  className="flex-1 bg-pink-500 text-white py-2 rounded text-center"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDeleteBundle(bundle._id)}
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBundles.length === 0 && (
          <div className="text-center mt-12 text-gray-500">
            No bundles found.
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Bundles;