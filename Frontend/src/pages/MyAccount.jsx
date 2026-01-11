import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";           
import "react-toastify/dist/ReactToastify.css";  
import { logout } from "../redux/userRedux";
import { useNavigate } from "react-router-dom";

import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaSave } from 'react-icons/fa';

const Myaccount = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    // Delay navigation slightly to allow toast to display
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8 mb-5">

      {/* Toast container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Account Information Section */}
          <div className="p-8 border-b border-rose-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-rose-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800">{user.currentUser?.name}</h2>
                <p className="text-gray-600">{user.currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Account Settings Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="text-rose-600 mr-2" />
                Personal Information
              </h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={user.currentUser?.name} 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={user.currentUser?.email} 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Password Management Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaLock className="text-rose-600 mr-2" />
                Password & Security
              </h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center mt-4"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;
