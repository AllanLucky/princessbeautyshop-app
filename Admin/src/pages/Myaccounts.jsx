import { useSelector } from "react-redux";

const Myaccounts = () => {
  const admin = useSelector((state) => state.admin.currentAdmin);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input type="text" value={admin.name} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" value={admin.email} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <input type="text" value="ADMIN" disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccounts;
