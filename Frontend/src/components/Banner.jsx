const Banner = () => {
  return (
    <div className="bg-[url('/beautybanner2.jpg')] bg-no-repeat bg-cover h-[80vh] mb-10">
      <div className="absolute inset-0 bg-black opacity-20">
      </div>
      <div className="relative flex flex-col text-white w-50% p-[10%]">
        <span className="text-3xl font-bold mt-3">Discover Your Radiance Our Handpick Beauty Essentials</span>
        <h1 className="text-2xl font-bold mt-3">Glow With Confidence</h1>
        <div className="flex flex-col sm:flex-row items-center mt-20 gap-4">
          <button className="bg-purple-500 p-4 w-full sm:w-64 text-white cursor-pointer rounded-lg">
            Shop Now
          </button>
          <button className="bg-pink-400 p-4 w-full sm:w-64 text-white cursor-pointer rounded-lg">
            Call: (+25488425000)
          </button>
        </div>

      </div>
    </div>
  )
}

export default Banner


