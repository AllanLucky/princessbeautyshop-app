import { useEffect, useState } from "react"
import { userRequest } from "../requestMethod";

const Banner = () => {
  const [banner, setBanner] = useState({});

  useEffect(()=>{
    const fetchRandomBanner = async () =>{
      try{
        const response = await userRequest.get("/banners/random");
        setBanner(response.data);
      }catch(error){
        console.error("Failed to fetch random banner", error)
      }
    }
    fetchRandomBanner();
  },[])

  if(!banner){
    return <div>Loading...</div>;
  }

  return (
    <div className={`relative bg-[url(--banner.img)] bg-no-repeat bg-cover h-[80vh] mb-10`} style={{ backgroundImage:`url(${banner.img})` }}>
      <div className="absolute inset-0 bg-black opacity-20">
      </div>
      <div className="relative flex flex-col text-white w-50% p-[10%]">
        <span className="text-3xl font-bold mt-3">{banner.subtitle}</span>
        <h1 className="text-2xl font-bold mt-3">{banner.title}</h1>
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


