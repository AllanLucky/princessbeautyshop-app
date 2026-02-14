import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods"; // axios instance
import { toast } from "react-toastify";

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await userRequest.get("/products");
        const fetchedProducts = response.data.products || response.data;
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Update total whenever orderItems change
  useEffect(() => {
    const newTotal = orderItems.reduce(
      (sum, item) => sum + (item.quantity * (item.price || 0)),
      0
    );
    setTotal(newTotal);
  }, [orderItems]);

  // Handle quantity change for a product
  const handleQuantityChange = (productId, quantity) => {
    const existing = orderItems.find((item) => item.productId === productId);

    if (existing) {
      // Update existing item quantity
      setOrderItems(
        orderItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } else {
      // Add new product to orderItems
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      setOrderItems([
        ...orderItems,
        {
          productId,
          quantity,
          price: product.discountedPrice || product.originalPrice || 0,
        },
      ]);
    }
  };

  // Submit the order
  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      toast.error("Add at least one product to create an order");
      return;
    }

    try {
      setLoading(true);
      await userRequest.post("/orders", {
        products: orderItems,
        total,
        currency: "KES",
      });

      toast.success("Order created successfully!");
      // Reset form
      setOrderItems([]);
      setTotal(0);
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Create New Order</h1>

      {/* Product Selection */}
      <div className="bg-white p-5 rounded-lg shadow mb-5">
        <h2 className="text-xl font-semibold mb-3">Select Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const selectedItem = orderItems.find(
              (item) => item.productId === product._id
            );
            return (
              <div
                key={product._id}
                className="border p-3 rounded flex flex-col gap-2"
              >
                <h3 className="font-bold">{product.title}</h3>
                <p>Price: KES {product.discountedPrice || product.originalPrice}</p>
                <p>Stock: {product.stock}</p>
                <input
                  type="number"
                  min={0}
                  max={product.stock}
                  value={selectedItem?.quantity || 0}
                  onChange={(e) =>
                    handleQuantityChange(product._id, Number(e.target.value))
                  }
                  className="border rounded p-1 w-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
        <span className="font-bold text-lg">Total: KES {total}</span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-pink-500 text-white px-5 py-2 rounded hover:bg-pink-600 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;
