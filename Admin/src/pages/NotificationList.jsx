import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const NotificationList = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/notifications/me");

      setNotifications(res.data.notifications || []);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= MARK AS READ =================
  const handleRead = async (id) => {
    try {
      await userRequest.put(`/notifications/read/${id}`);

      // Refresh list after marking read
      fetchNotifications();

     
       navigate(`/notifications/${id}`);

    } catch (error) {
      toast.error(error,"Failed to open notification");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Notifications
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Stay updated with your latest alerts
            </p>
          </div>

          <Link to="/notifications/create">
            <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-6 py-2.5 rounded-xl shadow-md font-medium">
              + Create Notification
            </button>
          </Link>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-2xl shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
            <div className="text-gray-400 text-lg font-medium">
              No notifications found
            </div>
            <p className="text-gray-400 text-sm mt-2">
              New notifications will appear here
            </p>
          </div>
        )}

        {/* Notification List */}
        {!loading && notifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleRead(n._id)}
                className="p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                      {n.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
                      {n.message}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      n.read
                        ? "bg-green-100 text-green-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {n.read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;