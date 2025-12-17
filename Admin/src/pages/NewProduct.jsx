import { FaPlus } from "react-icons/fa";

const NewProduct = () => {
  return (
    <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-center mb-5">
        <h1 className="text-3xl font-semibold">New Product</h1>
      </div>
      <div className="mt-5 bg-white shadow-lg rounded-lg p-5">
        <form className="flex flex-col md:flex-row rounded-lg">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-5">
            <div>
              <span className="font-semibold">Product Image</span>
              <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md mt-2">
                <div className="flex items-center justify-center mt-[40px]">
                  <label className="cursor-pointer">
                    <FaPlus className="text-[20px]" />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-4">Product Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Product Name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-4">
                Product Description
              </label>
              <textarea
                rows={7}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Product Description"
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">
                Product Original Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 20000"
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">
                Product Discounted Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 2000"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 space-y-5 ml-6">
            <div>
              <label className="block font-semibold mb-4">
                Wholesale Price
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="KES 17000"
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">
                Wholesale Minimum Quantity
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">Brand</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Kylie"
              />
            </div>

            <div>
              <label className="block font-semibold mb-4">Concern</label>
              <select className="border-2 border-[#444] p-2 border-solid w-full rounded">
                <option value="">Select concern</option>
                <option value="acne">Acne</option>
                <option value="dry-skin">Dry Skin</option>
                <option value="oily-skin">Oily Skin</option>
                <option value="dark-spots">Dark Spots</option>
                <option value="aging">Aging</option>
                <option value="sensitive-skin">Sensitive Skin</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-4">Skin Type</label>
              <select className="border-2 border-[#444] p-2 border-solid w-full rounded">
                <option value="">Select skin type</option>
                <option value="all">All</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="sensitive">Sensitive</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-4">Category</label>
              <select className="border-2 border-[#444] p-2 border-solid w-full rounded">
                <option value="">Select category</option>
                <option value="foundations">Foundations</option>
                <option value="serum">Serum</option>
                <option value="toner">Toner</option>
                <option value="lotions">Lotions</option>
              </select>
            </div>

            <button className="bg-slate-500 text-white py-2 px-4 rounded-lg">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
