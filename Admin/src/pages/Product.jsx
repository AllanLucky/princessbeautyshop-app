import { LineChart } from "@mui/x-charts/LineChart";
import { FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";

const Product = () => {
  return (
    <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl font-semibold">Product</h3>
        <Link t0="/newproduct">
        <button className="bg-slate-500 text-white py-2 px-4 rounded-lg">
          Create
        </button>
        </Link>
      </div>

      {/* SECOND PART */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* CHART */}
        <div className="flex-1">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
            height={250}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>

        {/* PRODUCT CARD */}
        <div className="flex-1 bg-white p-5 rounded-lg shadow-lg">
          <div className="flex items-center mb-5">
            <img
              src="/lotion.jpg"
              alt=""
              className="h-20 w-20 rounded-full mr-5"
            />
            <span className="text-2xl font-semibold">
              Hydrating Facial Cleanser
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">ID</span>
              <span>65235678</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sales</span>
              <span>652</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">In Stock</span>
              <span>Yes</span>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD PART */}
      <div className="mt-5 p-5 bg-white shadow-lg rounded-lg">
        <form className="flex flex-col md:flex-row gap-5">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-5">
            <div>
              <label className="block mb-2 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Product Description
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Product Original Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Product Discounted Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                In Stock
              </label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col items-center space-y-5">
            <img
              src="/lotion.jpg"
              alt=""
              className="h-32 w-32 rounded-full"
            />
            <label className="cursor-pointer">
              <FaUpload className="text-3xl text-gray-800" />
            </label>
            <button className="bg-slate-600 text-white py-3 px-6 rounded-lg">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Product;
