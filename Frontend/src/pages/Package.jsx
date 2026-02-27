import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Packages = () => {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bundlesLoading, setBundlesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prebuilt");
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [animatingProduct, setAnimatingProduct] = useState(null);

  const dispatch = useDispatch();

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get("/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  // Fetch bundles
  useEffect(() => {
    const getBundles = async () => {
      setBundlesLoading(true);
      try {
        const res = await userRequest.get("/bundles");
        const prebuilt = res.data.data.filter((b) => b.isPrebuilt);
        setBundles(prebuilt);
      } catch (err) {
        console.error("Error fetching bundles:", err);
        toast.error("Failed to load bundles");
      } finally {
        setBundlesLoading(false);
      }
    };
    getBundles();
  }, []);

  // Filter products by search
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categories?.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const getProductPrice = (product) => product.discountedPrice || product.originalPrice;

  const getPackageTotal = () =>
    selectedProducts.reduce((total, p) => total + getProductPrice(p) * p.quantity, 0);

  const getPackageSavings = () => {
    const individualTotal = selectedProducts.reduce(
      (total, p) => total + p.originalPrice * p.quantity,
      0
    );
    return individualTotal - getPackageTotal();
  };

  const handleAddToPackage = (product) => {
    setAnimatingProduct(product);
    setShowAddAnimation(true);
    setTimeout(() => {
      setSelectedProducts((prev) => {
        if (!prev.find((p) => p._id === product._id)) {
          return [...prev, { ...product, quantity: 1 }];
        }
        return prev;
      });
      setShowAddAnimation(false);
      toast.success(`${product.title} added to package!`);
    }, 1500);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
    toast.info("Product removed from package");
  };

  const handleAddPrebuiltPackageToCart = (bundle) => {
    bundle.products.forEach((product) => {
      dispatch(
        addProduct({
          ...product.productId,
          quantity: product.quantity,
          price: getProductPrice(product.productId),
        })
      );
    });
    toast.success(`${bundle.name} added to cart!`);
    setTimeout(() => (window.location.href = "/cart"), 1500);
  };

  const handleProceedToStep2 = () => {
    if (selectedProducts.length === 0) {
      toast.error("Add at least one product to your package");
      return;
    }
    setStep(2);
  };

  const handleProceedToStep3 = () => setStep(3);

  const handlePlaceOrder = () => {
    selectedProducts.forEach((product) => {
      dispatch(
        addProduct({
          ...product,
          quantity: 1,
          price: getProductPrice(product),
        })
      );
    });
    toast.success("Package added to cart! Redirecting...");
    setTimeout(() => (window.location.href = "/cart"), 1500);
  };

  const AddToPackageAnimation = () => {
    if (!showAddAnimation || !animatingProduct) return null;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="w-32 h-40 bg-gradient-to-b from-rose-400 to-pink-500 rounded-2xl relative shadow-2xl border-2 border-white">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-24 h-6 bg-rose-300 rounded-t-2xl border-2 border-white"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold text-center">
              DUBOIS<br />BEAUTY
            </div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 animate-fly-to-bag">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-rose-200 p-3 transform rotate-12">
              <img
                src={animatingProduct.img?.[0]}
                alt={animatingProduct.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-8">
      {isLoading ? (
        <p className="text-center py-12">Loading products...</p>
      ) : step === 1 ? (
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("prebuilt")}
              className={`px-6 py-3 rounded-xl font-medium ${
                activeTab === "prebuilt"
                  ? "bg-rose-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Prebuilt
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-6 py-3 rounded-xl font-medium ${
                activeTab === "custom"
                  ? "bg-rose-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Custom
            </button>
          </div>

          {activeTab === "prebuilt" ? (
            bundlesLoading ? (
              <p className="text-center py-12">Loading bundles...</p>
            ) : bundles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
    <div
      key={bundle._id}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-4"
    >
      {/* Image Clickable */}
      <Link to={`/packages/${bundle._id}`}>
        <img
          src={bundle.image}
          alt={bundle.name}
          className="w-full h-48 object-cover rounded-xl mb-4 cursor-pointer"
        />
      </Link>

      {/* Title Clickable */}
      <Link to={`/packages/${bundle._id}`}>
        <h3 className="text-xl font-bold mb-2 hover:text-rose-600 cursor-pointer">
          {bundle.name}
        </h3>
      </Link>

      <p className="text-gray-600 mb-4">{bundle.description}</p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-rose-600 font-bold">
          KES {bundle.discountedPrice}
        </span>

        {bundle.originalPrice > bundle.discountedPrice && (
          <span className="line-through text-gray-500">
            KES {bundle.originalPrice}
          </span>
        )}
      </div>

      {/* View Details Link */}
      <Link
        to={`/packages/${bundle._id}`}
        className="block text-center mb-3 text-rose-600 font-medium hover:underline"
      >
        View Details
      </Link>

      <button
        onClick={() => handleAddPrebuiltPackageToCart(bundle)}
        className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium"
      >
        Add to Cart
      </button>
    </div>
                 ))}
               </div>
            ) : (
              <p className="text-center py-12">No prebuilt packages available.</p>
            )
          ) : (
            <div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md mx-auto px-4 py-3 border rounded-xl mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition"
                  >
                    <img
                      src={product.img?.[0]}
                      alt={product.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold mb-2">{product.title}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">{product.desc}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-rose-600 font-bold">
                        KES {getProductPrice(product)}
                      </span>
                      {product.discountedPrice &&
                        product.originalPrice > product.discountedPrice && (
                          <span className="line-through text-gray-500">
                            KES {product.originalPrice}
                          </span>
                        )}
                    </div>
                    <button
                      onClick={() => handleAddToPackage(product)}
                      className="w-full bg-rose-600 text-white py-2 rounded-xl hover:bg-rose-700 transition"
                    >
                      Add to Package
                    </button>
                  </div>
                ))}
              </div>

              {selectedProducts.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={handleProceedToStep2}
                    className="bg-gradient-to-r from-rose-600 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg"
                  >
                    Continue to Review ({selectedProducts.length})
                  </button>
                </div>
              )}
            </div>
          )}

          <AddToPackageAnimation />
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
        </div>
      ) : step === 2 ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-4">Review Your Package</h2>
          {selectedProducts.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
            >
              <div>
                <h4 className="font-semibold">{p.title}</h4>
                <span className="text-gray-500">KES {getProductPrice(p)}</span>
              </div>
              <button
                onClick={() => handleRemoveProduct(p._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right">
            <p>Total Savings: KES {getPackageSavings()}</p>
            <p className="font-bold text-lg">Total: KES {getPackageTotal()}</p>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 px-6 py-2 rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleProceedToStep3}
              className="bg-rose-600 text-white px-6 py-2 rounded-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold mb-4">Place Order</h2>
          <p>Your package is ready to be added to the cart and checkout.</p>
          <button
            onClick={handlePlaceOrder}
            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Add to Cart & Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Packages;