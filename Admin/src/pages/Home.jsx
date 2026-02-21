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

/*
=====================================================
CONFIG
=====================================================
*/

const COLORS = ["#4f46e5", "#ef4444", "#facc15"];

const FakeBuyerData = [
  { name: "Male", value: 35 },
  { name: "Female", value: 50 },
  { name: "Other", value: 15 },
];

/*
=====================================================
HOME DASHBOARD
=====================================================
*/

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  -----------------------------------------------------
  FORMAT MONEY
  -----------------------------------------------------
  */

  const formatKES = (amount) =>
    Number(amount || 0).toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
    });

  /*
  -----------------------------------------------------
  ORDER TOTAL CALCULATOR
  -----------------------------------------------------
  */

  const calculateOrderTotal = (order) => {
    if (!order?.products) return 0;

    return order.products.reduce((sum, p) => {
      return sum + (p.price || 0) * (p.quantity || 1);
    }, 0);
  };

  /*
  -----------------------------------------------------
  FETCH DASHBOARD DATA
  -----------------------------------------------------
  */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes] = await Promise.all([
          userRequest.get("/orders"),
          userRequest.get("/users"),
        ]);

        setOrders(ordersRes?.data?.orders || []);
        setUsers(usersRes?.data?.users || []);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*
  -----------------------------------------------------
  DASHBOARD METRICS
  -----------------------------------------------------
  */

  const totalRevenue = orders.reduce(
    (acc, order) => acc + calculateOrderTotal(order),
    0
  );

  const barData = orders
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((o, index) => ({
      name: `Order ${index + 1}`,
      Revenue: calculateOrderTotal(o),
    }));

  /*
  =====================================================
  UI
  =====================================================
  */

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-4">

      {/* ================= STATS ================= */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatBox
          icon={<IoCartOutline className="text-white text-xl" />}
          bg="bg-indigo-500"
          title="Revenue"
          value={formatKES(totalRevenue)}
        />

        <StatBox
          icon={<IoCashOutline className="text-white text-xl" />}
          bg="bg-red-500"
          title="Expenses"
          value={formatKES(totalRevenue * 0.3)}
        />

        <StatBox
          icon={<IoPeopleOutline className="text-white text-xl" />}
          bg="bg-yellow-500"
          title="Customers"
          value={users.length}
        />

        <StatBox
          icon={<IoClipboardOutline className="text-white text-xl" />}
          bg="bg-green-500"
          title="Orders"
          value={orders.length}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="flex flex-wrap gap-6 mb-6">

        {/* Revenue Chart */}
        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip formatter={(v) => formatKES(v)} />
              <Bar dataKey="Revenue" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Buyer Profile */}
        <ChartCard title="Buyer Profile">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={FakeBuyerData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {FakeBuyerData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* ================= LATEST TRANSACTIONS ================= */}

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Latest Transactions
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !orders.length ? (
          <p className="text-gray-400">No transactions</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                .slice(0, 5)
                .map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{order.name}</td>

                    <td className="p-3">
                      {order.phone || "N/A"}
                    </td>

                    <td className="p-3 font-semibold text-indigo-600">
                      {formatKES(order.total)}
                    </td>

                    <td className="p-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Home;

/*
=====================================================
UI COMPONENTS
=====================================================
*/

function StatBox({ icon, bg, title, value }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex-1 min-w-[180px] flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="flex-1 min-w-[280px] bg-white rounded shadow p-4 h-[22rem]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-semibold ${map[status] || map.pending}`}>
      {status || "pending"}
    </span>
  );
}