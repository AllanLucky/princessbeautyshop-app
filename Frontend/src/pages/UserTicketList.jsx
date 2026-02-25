import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethod";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const UserTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= FETCH USER TICKETS =================
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get("/tickets/user/all"); // matches backend
      setTickets(res.data.tickets || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE TICKET =================
  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      // Correct route for deleting a user's own ticket
      await userRequest.delete(`/tickets/user/${id}`);
      // Remove deleted ticket from state
      setTickets((prev) => prev.filter((t) => t._id !== id));
      toast.success("Ticket deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto">
        {/* Header + Create Ticket Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Support Tickets</h2>
          <button
            onClick={() => navigate("/support-tickets/new")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <FaPlus /> Create Ticket
          </button>
        </div>

        {/* Loading State */}
        {loading && <p className="text-gray-500 animate-pulse">Loading tickets...</p>}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <p className="text-gray-400">No tickets found.</p>
        )}

        {/* Ticket List */}
        <div className="bg-white rounded-2xl shadow divide-y overflow-hidden">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="flex justify-between items-center p-5 hover:bg-gray-50 transition flex-wrap gap-4"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                <span className="inline-block mt-2 text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full capitalize">
                  {ticket.status}
                </span>
              </div>

              <div className="flex gap-5 items-center">
                <Link to={`/support-tickets/${ticket._id}`}>
                  <FaEye className="text-purple-600 text-xl hover:scale-110 transition" />
                </Link>
                <button onClick={() => deleteTicket(ticket._id)}>
                  <FaTrash className="text-red-600 text-xl hover:scale-110 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTicketList;