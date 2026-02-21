import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const ReturnDetailPage = () => {
  const { id } = useParams();
  const [ret, setRet] = useState(null);

  const fetchReturn = async () => {
    try {
      const res = await userRequest.get(`/returns`);

      const data = res.data.returns?.find((r) => r._id === id);

      setRet(data || null);
    } catch {
      toast.error("Failed to load return detail");
    }
  };

  useEffect(() => {
    fetchReturn();
  }, [id]);

  if (!ret) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-2xl p-6 max-w-3xl mx-auto border">
        <h2 className="text-xl font-bold mb-4">Return Detail</h2>

        <p className="mb-2">Order: {ret.orderId}</p>
        <p className="mb-2">Reason: {ret.reason}</p>

        <p className="mb-2 capitalize">
          Status: <strong>{ret.status}</strong>
        </p>
      </div>
    </div>
  );
};

export default ReturnDetailPage;