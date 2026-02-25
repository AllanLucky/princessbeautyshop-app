import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSupportTicketDetail = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(`/tickets/detail/${id}`);
      setTicket(res.data.ticket);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const sendReply = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setSending(true);
      await userRequest.put(`/tickets/${id}`, {
        responses: [
          ...(ticket?.responses || []),
          {
            message: reply,
            postedBy: ticket?.user?._id,
            postedByModel: "User",
          },
        ],
      });

      toast.success("Reply sent successfully");
      setReply("");
      fetchTicket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Reply failed");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500 animate-pulse">Loading ticket...</div>;

  if (!ticket)
    return <div className="p-6 text-gray-500">Ticket not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{ticket.subject}</h2>

        <div className="mb-4">
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full 
            bg-yellow-100 text-yellow-700 capitalize">
            Status: {ticket.status}
          </span>
        </div>

        {/* Conversation */}
        <div className="space-y-4 mb-6 max-h-[450px] overflow-y-auto">
          {ticket.responses?.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                r.postedByModel === "Admin"
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className="text-gray-700 whitespace-pre-line">{r.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {r.postedByModel} • {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div className="space-y-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-300 outline-none"
            rows={4}
          />
          <button
            onClick={sendReply}
            disabled={sending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition w-full font-semibold disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSupportTicketDetail;