import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { userRequest } from "../requestMethods";

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch backups from API
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const res = await userRequest.get("/backups");
        setBackups(res.data);
      } catch (error) {
        console.error("Failed to fetch backups:", error);
      }
    };
    fetchBackups();
  }, []);

  // Create new backup
  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const res = await userRequest.post("/backups/create");
      setBackups((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Failed to create backup:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a backup
  const handleDeleteBackup = async (id) => {
    try {
      await userRequest.delete(`/backups/${id}`);
      setBackups((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete backup:", error);
    }
  };

  return (
    <div className="p-5 w-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Backups</h1>
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FaPlus className="mr-2" />
          {loading ? "Creating..." : "Create Backup"}
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-5">
        {backups.length === 0 ? (
          <p className="text-gray-600">No backups available.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Backup Name</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup._id} className="border-b">
                  <td className="py-2 px-4">{backup.name}</td>
                  <td className="py-2 px-4">{new Date(backup.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteBackup(backup._id)}
                      className="flex items-center text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
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

export default Backups;

