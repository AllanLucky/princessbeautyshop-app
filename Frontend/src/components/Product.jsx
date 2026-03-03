import { showAverageRating } from "./Ratings";

const Product = ({ product }) => {
  if (!product) return null;

  const originalPrice = Number(product?.originalPrice) || 0;
  const discountedPrice = Number(product?.discountedPrice) || 0;

  const hasDiscount =
    originalPrice > 0 &&
    discountedPrice > 0 &&
    discountedPrice < originalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const finalPrice = hasDiscount ? discountedPrice : originalPrice;

  const savings = hasDiscount
    ? (originalPrice - discountedPrice).toFixed(2)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer">

      {/* Image Section */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-50">
        {product?.img?.[0] ? (
          <img
            src={product.img[0]}
            alt={product?.title || "Product"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition" />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">

          {hasDiscount && (
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              -{discountPercentage}%
            </span>
          )}

          {product?.isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              New
            </span>
          )}

          {!product?.inStock && (
            <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">

        {/* Title */}
        <h2 className="font-semibold text-gray-800 text-base line-clamp-2 mb-2 min-h-[48px]">
          {product?.title || "No Title"}
        </h2>

        {/* Rating */}
        {product?.ratingsCount > 0 && (
          <div className="flex items-center mb-3">
            {showAverageRating(product)}
            <span className="text-xs text-gray-500 ml-1">
              ({product.ratingsCount})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mt-auto">

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-rose-700 font-bold text-lg">
                Ksh {finalPrice.toLocaleString()}
              </span>

              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm">
                  Ksh {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {hasDiscount && (
              <span className="text-green-600 text-xs font-medium">
                Save Ksh {Number(savings).toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            disabled={!product?.inStock}
            className={`p-2 rounded-full transition-all duration-300 ${
              !product?.inStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Wishlist */}
      <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 hover:text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Product;