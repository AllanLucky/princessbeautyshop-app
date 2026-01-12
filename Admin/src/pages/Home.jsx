import { LineChart } from "@mui/x-charts/LineChart";

const Home = () => {
  return (
    <div className="flex flex-col p-5 bg-gray-100 min-h-screen">
      {/* --- Top Cards --- */}
      <div className="flex flex-wrap gap-5 mb-5">
        {/* Orders Card */}
        <div className="flex-1 bg-white h-52 shadow-xl rounded-lg flex flex-col items-center justify-center">
          <div className="h-32 w-32 border-[15px] border-blue-400 rounded-full flex items-center justify-center">
            <h2 className="text-3xl font-bold">699</h2>
          </div>
          <h2 className="text-xl font-semibold mt-2">Orders</h2>
        </div>

        {/* Products Card */}
        <div className="flex-1 bg-white h-52 shadow-xl rounded-lg flex flex-col items-center justify-center">
          <div className="h-32 w-32 border-[15px] border-red-500 rounded-full flex items-center justify-center">
            <h2 className="text-3xl font-bold">200</h2>
          </div>
          <h2 className="text-xl font-semibold mt-2">Products</h2>
        </div>

        {/* Users Card */}
        <div className="flex-1 bg-white h-52 shadow-xl rounded-lg flex flex-col items-center justify-center">
          <div className="h-32 w-32 border-[15px] border-gray-400 rounded-full flex items-center justify-center">
            <h2 className="text-3xl font-bold">250</h2>
          </div>
          <h2 className="text-xl font-semibold mt-2">Users</h2>
        </div>
      </div>

      {/* --- Table & Chart Section --- */}
      <div className="flex flex-wrap gap-5">
        {/* Latest Transactions Table */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-5 min-w-[400px]">
          <h3 className="text-xl font-bold mb-4">Latest Transactions</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">Allan Shehe</td>
                <td className="py-2 px-4">KES 30,000</td>
                <td className="py-2 px-4 text-green-500">Approved</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Mzungu Shehe</td>
                <td className="py-2 px-4">KES 40,000</td>
                <td className="py-2 px-4 text-red-500">Declined</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Claris Akinyi</td>
                <td className="py-2 px-4">KES 20,000</td>
                <td className="py-2 px-4 text-green-600">Approved</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Revenue Chart */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-5 min-w-[400px]">
          <h3 className="text-xl font-bold mb-4">Revenue Chart</h3>

          <div className="flex flex-col gap-3 mb-5">
            <div className="bg-gray-50 p-3 rounded-lg shadow flex justify-between">
              <span className="font-semibold">Total Revenue:</span>
              <span className="text-green-600 font-bold">KES 1,230,000</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg shadow flex justify-between">
              <span className="font-semibold">Total Loss:</span>
              <span className="text-red-600 font-bold">KES 0</span>
            </div>
          </div>

         {/* LineChart Component */}
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
          height={300}
        />
         
        </div>
      </div>
    </div>
  );
};

export default Home;
