import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const SupportTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH TICKETS =================
  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get("/tickets/admin/all");

      setTickets(res.data.tickets || res.data || []);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================= DELETE TICKET =================
  const deleteTicket = async (id) => {
    if (!window.confirm("Delete ticket?")) return;

    try {
      await userRequest.delete(`/tickets/admin/${id}`);

      setTickets((prev) =>
        prev.filter((t) => t._id !== id)
      );

      toast.success("Ticket deleted");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Support Tickets
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 animate-pulse">
            Loading tickets...
          </p>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <p className="text-gray-400">
            No tickets found
          </p>
        )}

        {/* Ticket List */}
        <div className="bg-white rounded-2xl shadow divide-y overflow-hidden">

          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="flex justify-between items-center p-5 hover:bg-gray-50 transition flex-wrap gap-4"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {ticket.subject}
                </h3>

                <p className="text-sm text-gray-500">
                  {ticket.user?.name || "Unknown User"}
                </p>

                <span className="inline-block mt-2 text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full capitalize">
                  {ticket.status}
                </span>
              </div>

              <div className="flex gap-5 items-center">

                <Link to={`/ticket/${ticket._id}`}>
                  <FaEye className="text-purple-600 text-xl hover:scale-110 transition" />
                </Link>

                <button
                  onClick={() => deleteTicket(ticket._id)}
                  className="group"
                >
                  <FaTrash className="text-red-600 text-xl hover:scale-110 transition group-hover:text-red-700" />
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default SupportTicketList;