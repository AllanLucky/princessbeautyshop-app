import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSupportTicketDetail = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // ================= FETCH TICKET =================
  const fetchTicket = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get(`/tickets/detail/${id}`);

      setTicket(res.data.ticket);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // ================= SEND REPLY =================
  const sendReply = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setSending(true);

      await userRequest.put(`/tickets/admin/${id}`, {
        responses: [
          ...(ticket?.responses || []),
          {
            message: reply,
            postedBy: ticket?.user?._id,
          },
        ],
      });

      toast.success("Reply sent");

      setReply("");
      fetchTicket();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Reply failed"
      );
    } finally {
      setSending(false);
    }
  };

  // ================= LOADING =================
  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading ticket...
      </div>
    );

  if (!ticket)
    return (
      <div className="p-6 text-center text-gray-500">
        Ticket not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {ticket.subject}
        </h2>

        {/* Conversation Thread */}
        <div className="space-y-4 mb-6 max-h-[450px] overflow-y-auto">

          {ticket.responses?.map((r, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <p className="text-gray-700 whitespace-pre-line">
                {r.message}
              </p>
            </div>
          ))}

        </div>

        {/* Reply Box */}
        <div className="space-y-4">

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write reply..."
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

export default AdminSupportTicketDetail;