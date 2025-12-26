import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-5xl font-bold text-pink-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

