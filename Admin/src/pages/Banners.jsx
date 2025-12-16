import { FaPlus } from "react-icons/fa";

const Banners = () => {
  return (
    // Main container: spaces the left and right sections horizontally
    <div className="flex justify-evenly m-[10%]">

      {/* LEFT SIDE – Displays existing banners */}
      <div className="mr-[50px]">
        <h2 className="text-xl font-semibold mb-4">Active Banners</h2>

        {/* List of currently active banners */}
        <div className="flex flex-col space-y-4">

          {/* Single Banner Item */}
          <div className="flex items-center justify-between border-b border-x-gray-200 pb-4">
            {/* Banner Image */}
            <img
              src="/lotion2.jpg"
              alt=""
              className="w-32 h-32 object-cover rounded-md"
            />

            {/* Banner Text Content */}
            <div className="flex-1 ml-4">
              <h3 className="text-xl font-semibold mb-2">Radiate Beauty, Inside and Out</h3>
              <p className="text-gray-600 mb-2">Discover your perfect Products for a flawless Look</p>
            </div>

            {/* Delete Button */}
            <button className="bg-red-600 p-2 text-white font-semibold cursor-pointer ml-4">
              Delete
            </button>
          </div>

          {/* Second Banner Item */}
          <div className="flex items-center justify-between border-b border-x-gray-200 pb-4">
            <img
              src="/lotion2.jpg"
              alt=""
              className="w-32 h-32 object-cover rounded-md"
            />
            <div className="flex-1 ml-4">
              <h3 className="text-xl font-semibold mb-2">Radiate Beauty, Inside and Out</h3>
              <p className="text-gray-600 mb-2">Discover your perfect Products for a flawless Look</p>
            </div>
            <button className="bg-red-600 p-2 text-white font-semibold cursor-pointer ml-4">
              Delete
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE – Form to upload a new banner */}
      <div className="flex flex-col">
        <div className="flex-1 bg-white p-5">

          {/* Image Upload Label */}
          <label htmlFor="" className="font-semibold text-xl mb-1">Image</label>

          <div className="flex flex-col">

            {/* Image Placeholder Box */}
            <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md">

              {/* Centered Plus Icon */}
              <div className="flex items-center justify-center mt-[40px]">
                <label htmlFor="" className="cursor-pointer">
                  <FaPlus className="text-[20px]" />
                </label>
              </div>

            </div>

            {/* Banner Title Input */}
            <div className="flex flex-col my-3">
              <span className="font-semibold">Title</span>
              <input
                type="text"
                className="w-[250px] outline-none border-b-2 border-[#444] border-solid"
              />
            </div>

            {/* Banner Subtitle Input */}
            <div className="flex flex-col my-3">
              <span className="font-semibold">Subtitle</span>
              <input
                type="text"
                className="w-[250px] outline-none border-b-2 border-[#444] border-solid"
              />
            </div>

            {/* Upload Button */}
            <button className="bg-[#1e1e1e] p-2 text-white font-semibold cursor-pointer">
              Upload
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Banners;

