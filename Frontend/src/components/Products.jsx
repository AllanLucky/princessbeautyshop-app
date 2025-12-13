import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Rosehip Oil",
    price: 600,
    image: "/image.png",
    rating: 4,
    description: "Nature’s secret for radiant skin and healthy hair.",
  },
  {
    id: 2,
    name: "Lavender Lotion",
    price: 750,
    image: "/allan.webp",
    rating: 5,
    description: "Moisturizing lotion for soft skin.",
  },
  {
    id: 3,
    name: "Vitamin C Serum",
    price: 900,
    image: "/nonda.jpg",
    rating: 4.5,
    description: "Brighten your complexion",
  },
  {
    id: 4,
    name: "Foundation Cream",
    price: 1200,
    image: "/akinyi.jpg",
    rating: 4,
    description: "Smooth coverage",
  },
];

const StarRating = ({ rating, maxRating = 5 }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return <div className="flex space-x-1 justify-center mt-1">{stars}</div>;
};

const Products = () => {
  return (
    <div className="flex flex-wrap mt-3 justify-center mx-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col items-center justify-center h-auto m-5 cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[250px] object-cover rounded-lg shadow-md"
          />

          <h2 className="mt-2 text-center text-xl font-semibold text-gray-800">
            {product.name}
          </h2>

          <p className="mt-1 text-center text-gray-600 text-sm">
            {product.description}
          </p>

          <StarRating rating={product.rating} />

          <span className="mt-2 text-lg font-bold text-pink-600">
            Price: Kes <span>{product.price}</span>
          </span>

          <button className="mt-4 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300 mb-3">
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
