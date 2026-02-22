import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";

const NotificationDetail = () => {
  const { id } = useParams();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch single notification
  const fetchNotification = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get(`/notifications/${id}`);

      setNotification(res.data.notification);

    } catch (error) {
      toast.error(error,"Failed to load notification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading notification...
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-10 text-center text-gray-500">
        Notification not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        <h2 className="text-3xl font-bold text-gray-800">
          {notification.title}
        </h2>

        <p className="text-gray-500 leading-relaxed">
          {notification.message}
        </p>

        <div className="text-sm text-gray-400">
          Status:{" "}
          <span className={notification.read ? "text-green-600" : "text-pink-600"}>
            {notification.read ? "Read" : "Unread"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default NotificationDetail;