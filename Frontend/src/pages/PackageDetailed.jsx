import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { userRequest } from "../requestMethod";
import { addProduct } from "../redux/cartRedux";

const BundleDetail = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bundle, setBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [quantity, setQuantity] = useState(1);

  // Fetch bundle details
  useEffect(() => {
    const getBundle = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get(`/bundles/${id}`);
        setBundle(res.data);
      } catch (error) {
        console.error("Error fetching bundle:", error);
        toast.error("Failed to load bundle details");
      } finally {
        setIsLoading(false);
      }
    };
    getBundle();
  }, [id]);

  // Price helpers
  const getProductPrice = (product) => product.discountedPrice || product.originalPrice;
  const getBundleSavings = () => (bundle ? bundle.originalPrice - bundle.discountedPrice : 0);
  const formatPrice = (price) => `KES ${price}`;

  // Badge color mapping
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "BEST VALUE": return "bg-green-500";
      case "POPULAR": return "bg-blue-500";
      case "PREMIUM": return "bg-purple-500";
      case "NEW": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  // Cart actions
  const handleAddToCart = () => {
    if (!bundle?.products) return;

    bundle.products.forEach((product) => {
      dispatch(addProduct({
        ...product,
        _id: product.productId || product._id,
        title: product.title,
        desc: product.desc,
        img: product.img?.[0] || product.img,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        quantity,
        price: getProductPrice(product),
      }));
    });

    toast.success(`${bundle.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 1000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bundle not found
  if (!bundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bundle Not Found</h2>
          <p className="text-gray-600 mb-8">The bundle you're looking for doesn't exist.</p>
          <Link
            to="/packages"
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-rose-600">Home</Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-rose-600">Packages</Link>
            <span>/</span>
            <span className="text-gray-900">{bundle.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image & Badge */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img src={bundle.image} alt={bundle.name} className="w-full h-96 object-cover" />
            </div>

            {bundle.badge && (
              <div className={`inline-flex px-4 py-2 rounded-full text-white font-bold ${getBadgeColor(bundle.badge)}`}>
                {bundle.badge}
              </div>
            )}

            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ml-3 ${
              bundle.isPrebuilt ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            }`}>
              {bundle.isPrebuilt ? "Prebuilt Package" : "Custom Bundle"}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{bundle.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{bundle.description}</p>

              {/* Pricing */}
              <div className="bg-rose-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-rose-600">{formatPrice(bundle.discountedPrice)}</span>
                  {bundle.originalPrice > bundle.discountedPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {formatPrice(getBundleSavings())}
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-rose-500 transition-colors"
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-rose-500 transition-colors"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white border border-rose-600 text-rose-600 py-3 px-6 rounded-xl hover:bg-rose-50 transition-colors font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-xl hover:bg-rose-700 transition-colors font-semibold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["overview", "products", "benefits", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab ? "border-rose-500 text-rose-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "overview" && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Package Overview</h3>
                <p className="text-gray-600 mb-6 text-lg">{bundle.description}</p>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Included Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundle.products?.map((product, index) => (
                    <div key={product.productId || index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.img?.[0] || product.img}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{product.title}</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-rose-600 font-bold">{formatPrice(getProductPrice(product))}</span>
                          {product.originalPrice > getProductPrice(product) && (
                            <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h3>
                <p className="text-gray-600 mb-4">{bundle.benefits || "Benefits coming soon."}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                <p className="text-gray-600">Reviews coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetail;