import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { userRequest } from "../requestMethods";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format amounts in KES
  const formatKES = (amount) =>
    Number(amount || 0).toLocaleString("en-KE", { style: "currency", currency: "KES" });

  // Calculate total for an order dynamically using merged products
  const calculateOrderTotal = (order) => {
    if (!order.products) return 0;
    return order.products.reduce((sum, p) => {
      // Find the product details from fetched products
      const product = products.find((prod) => prod._id === p.productId || prod._id === p._id);
      if (!product) return sum;
      const price = product.discountedPrice || product.originalPrice || 0;
      return sum + price * (p.quantity || 1);
    }, 0);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, productsRes, usersRes] = await Promise.all([
          userRequest.get("/orders"),
          userRequest.get("/products"),
          userRequest.get("/users"),
        ]);

        setOrders(ordersRes.data.orders || ordersRes.data);
        setProducts(productsRes.data.products || productsRes.data);
        setUsers(usersRes.data.users || usersRes.data);

        console.log("Orders fetched:", ordersRes.data.orders || ordersRes.data);
        console.log("Products fetched:", productsRes.data.products || productsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Total revenue across all orders
  const totalRevenue = orders.reduce((acc, order) => acc + calculateOrderTotal(order), 0);

  // Last 5 orders for the table
  const latestOrders = orders.slice(-5).reverse();

  return (
    <div className="flex flex-col p-5 bg-gray-100 min-h-screen">
      {/* --- Top Cards --- */}
      <div className="flex flex-wrap gap-5 mb-5">
        {[
          { title: "Orders", count: orders.length, border: "border-blue-400" },
          { title: "Products", count: products.length, border: "border-red-500" },
          { title: "Users", count: users.length, border: "border-gray-400" },
        ].map((card) => (
          <div
            key={card.title}
            className="flex-1 bg-white h-52 shadow-xl rounded-lg flex flex-col items-center justify-center"
          >
            <div className={`h-32 w-32 border-[15px] rounded-full flex items-center justify-center ${card.border}`}>
              <h2 className="text-3xl font-bold">{loading ? "..." : card.count}</h2>
            </div>
            <h2 className="text-xl font-semibold mt-2">{card.title}</h2>
          </div>
        ))}
      </div>

      {/* --- Table & Chart Section --- */}
      <div className="flex flex-wrap gap-5">
        {/* Latest Orders Table */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-5 min-w-[400px]">
          <h3 className="text-xl font-bold mb-4">Latest Transactions</h3>
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : latestOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => {
                  const orderTotal = calculateOrderTotal(order); // calculate per order
                  return (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 px-4">{order.name}</td>
                      <td className="py-2 px-4">{formatKES(orderTotal)}</td>
                      <td
                        className={`py-2 px-4 font-medium ${
                          order.status === 2
                            ? "text-green-500"
                            : order.status === 1
                            ? "text-blue-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {order.status === 2
                          ? "Delivered"
                          : order.status === 1
                          ? "Processing"
                          : "Pending"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-5 min-w-[400px]">
          <h3 className="text-xl font-bold mb-4">Revenue Chart</h3>

          <div className="flex flex-col gap-3 mb-5">
            <div className="bg-gray-50 p-3 rounded-lg shadow flex justify-between">
              <span className="font-semibold">Total Revenue:</span>
              <span className="text-green-600 font-bold">{formatKES(totalRevenue)}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg shadow flex justify-between">
              <span className="font-semibold">Total Orders:</span>
              <span className="text-blue-600 font-bold">{orders.length}</span>
            </div>
          </div>

          <LineChart
            xAxis={[{ data: orders.map((_, i) => i + 1) }]}
            series={[{ data: orders.map((o) => calculateOrderTotal(o)) }]}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
