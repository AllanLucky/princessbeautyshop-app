import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-20 py-10 bg-gray-50">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center sm:text-left">
        Shopping Cart
      </h2>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6 border-b pb-2">
            Your Items
          </h3>
          {/* Item */}
          <div className="flex flex-col sm:flex-row gap-5 border-b pb-6">
            <img
              src="/lotion2.jpg"
              alt="product"
              className="w-full sm:w-32 h-32 object-cover rounded-lg mx-auto sm:mx-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-lg font-semibold">
                Nature Well Lavender Smooth & Soften
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Best used after cleansing or shower when skin is slightly damp.
              </p>
              {/* Qty */}
              <div className="flex justify-center sm:justify-start items-center gap-4 mt-5">
                <FaMinus className="bg-pink-300 p-2 text-white rounded-full cursor-pointer" />
                <span className="font-semibold text-lg">1</span>
                <FaPlus className="bg-pink-300 p-2 text-white rounded-full cursor-pointer" />
              </div>
            </div>

            {/* Price */}
            <div className="text-center sm:text-right flex flex-col justify-between">
              <span className="text-xl font-bold text-pink-600 mt-4 sm:mt-0">
                KES 900
              </span>
              <FaTrashAlt className="text-red-500 cursor-pointer text-xl mx-auto sm:mx-0" />
            </div>
          </div>
          <button className="bg-red-400 w-full sm:w-[200px] text-white font-semibold p-4 mt-4 rounded-md mx-auto sm:mx-0">
            Clear Cart
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[350px] bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold mb-6 border-b pb-2">Order Summary</h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KES 900</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>KES 150</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-4">
              <span>Total</span>
              <span>KES 1050</span>
            </div>
          </div>
          <button className="bg-pink-600 w-full mt-6 py-3 rounded-lg text-white font-semibold hover:bg-pink-700">
            Proceed Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
