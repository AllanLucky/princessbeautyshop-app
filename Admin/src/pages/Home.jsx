import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import {
  IoCartOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoClipboardOutline,
} from "react-icons/io5";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#ef4444", "#facc15"];
const RADIAN = Math.PI / 180;

/*
=====================================================
DASHBOARD HOME
=====================================================
*/

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  =====================================================
  FORMAT MONEY
  =====================================================
  */

  const formatKES = (amount = 0) =>
    Number(amount || 0).toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    });

  /*
  =====================================================
  ORDER TOTAL CALCULATION
  =====================================================
  */

  const calculateOrderTotal = (order) => {
    if (!order?.products) return 0;

    return order.products.reduce((sum, p) => {
      return sum + (p.price || 0) * (p.quantity || 1);
    }, 0);
  };

  /*
  =====================================================
  FETCH DASHBOARD DATA ⭐ BACKEND SAFE
  =====================================================
  */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes] = await Promise.all([
          userRequest.get("/orders?limit=20&sort=-createdAt"),
          userRequest.get("/users"),
        ]);

        const ordersData = ordersRes?.data?.orders || ordersRes?.data || [];
        const usersData = usersRes?.data?.users || usersRes?.data || [];

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
  =====================================================
  METRICS
  =====================================================
  */

  const totalRevenue = orders.reduce(
    (acc, order) => acc + calculateOrderTotal(order),
    0
  );

  const barData = orders
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((o, idx) => ({
      name: `Order ${idx + 1}`,
      Revenue: calculateOrderTotal(o),
    }));

  /*
  =====================================================
  PIE LABEL RENDERER
  =====================================================
  */

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  /*
  =====================================================
  LOADING STATE
  =====================================================
  */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  /*
  =====================================================
  UI RENDER
  =====================================================
  */

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-1">

      {/* Stats Boxes */}
      <div className="flex flex-wrap gap-4 w-full mb-6">

        <StatBox
          icon={<IoCartOutline className="text-2xl text-white" />}
          iconBg="bg-sky-500"
          title="Total Revenue"
          value={formatKES(totalRevenue)}
        />

        <StatBox
          icon={<IoCashOutline className="text-2xl text-white" />}
          iconBg="bg-red-500"
          title="Expenses"
          value={formatKES(totalRevenue * 0.3)}
        />

        <StatBox
          icon={<IoPeopleOutline className="text-2xl text-white" />}
          iconBg="bg-yellow-500"
          title="Customers"
          value={users.length}
        />

        <StatBox
          icon={<IoClipboardOutline className="text-2xl text-white" />}
          iconBg="bg-green-500"
          title="Orders"
          value={orders.length}
        />

      </div>

      {/* Charts */}
      <div className="flex flex-wrap gap-6 mb-6">

        <div className="flex-1 md:flex-[3] bg-white rounded shadow-lg p-6 min-w-[250px] h-[22rem] flex flex-col">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">
            Revenue Overview
          </h3>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip formatter={(value) => formatKES(value)} />
              <Bar dataKey="Revenue" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 md:flex-[1] bg-white rounded shadow-lg p-6 min-w-[200px] h-[22rem] flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">
            Buyer Profile
          </h3>

          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={[
                  { name: "Customers", value: users.length || 1 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>

              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Latest Transactions */}
      <div className="bg-white rounded shadow-lg p-6">

        <h3 className="text-2xl font-bold mb-4 text-gray-700">
          Latest Transactions
        </h3>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full table-auto border-collapse text-left">

              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>

              <tbody>

                {orders
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((order, idx) => (
                    <tr
                      key={order._id}
                      className={`border-b hover:bg-gray-50 ${
                        idx % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {order.name || "Customer"}
                      </td>

                      <td className="py-3 px-4">
                        {order.phone || "N/A"}
                      </td>

                      <td className="py-3 px-4">
                        {order.address || "N/A"}
                      </td>

                      <td className="py-3 px-4 font-semibold">
                        {formatKES(calculateOrderTotal(order))}
                      </td>

                      <td className="py-3 px-4 font-medium">
                        {order.orderStatus || "processing"}
                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Home;

/*
=====================================================
STAT BOX COMPONENT
=====================================================
*/

function StatBox({ icon, iconBg, title, value }) {
  return (
    <div className="bg-white rounded-sm p-4 border border-gray-200 flex-1 flex min-w-[12rem] items-center">
      <div className={`rounded-full w-12 h-12 flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>

      <div className="pl-4 flex flex-col">
        <span className="text-sm text-gray-500 font-light">{title}</span>
        <strong className="text-xl text-gray-700 font-semibold">{value}</strong>
      </div>
    </div>
  );
}