const Category = () => {
  return (
    <div className="flex flex-wrap items-center justify-center m-5">

      {/* Serum */}
      <div className="relative bg-[url('/serum.jpg')] bg-no-repeat bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Radiance Serum
        </h2>
      </div>

      {/* Lotion */}
      <div className="relative bg-[url('/lotion.jpg')] bg-no-repeat bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Glow Elixir
        </h2>
      </div>

      {/* Foundation */}
      <div className="relative bg-[url('/foundation.jpg')] bg-no-repeat bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Velvet Touch
        </h2>
      </div>

      {/* Lotion 2 */}
      <div className="relative bg-[url('/lotion2.jpg')] bg-no-repeat bg-cover bg-center h-[400px] w-full sm:w-1/2 md:w-1/3 lg:w-1/5 mx-4 my-4 sm:my-2 rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:brightness-110">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Hydra Bliss
        </h2>
      </div>

    </div>
  );
};

export default Category;
