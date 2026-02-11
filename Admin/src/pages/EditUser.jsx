import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
  });

  // ================= FETCH USER =================
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/users/${id}`);

        const u = res.data.user;

        setForm({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "user",
          isActive: u.isActive ?? true,
        });
      } catch (err) {
        console.error(err.response?.data || err);
        alert("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= UPDATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await userRequest.put(`/users/${id}`, form);

      alert("User updated successfully");
      navigate("/users");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-[79vw]">
        <h2 className="text-xl font-semibold">Loading user...</h2>
      </div>
    );
  }

  return (
    <div className="p-6 w-[79vw] bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit User
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="user">User</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm">Active user</label>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition"
            >
              {saving ? "Saving..." : "Update User"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditUser;