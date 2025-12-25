import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import axios from "axios";

const Banners = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState("Uploading is 0%");
  const [loading, setLoading] = useState(false);

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Upload and create banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "uploads");

    setUploading("Uploading...");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkdx7xytz/image/upload",
        data
      );

      const { url } = uploadRes.data;
      setUploading("Uploaded 100%");

      // Send banner data to server
      await userRequest.post("/banners", {
        img: url,
        title: title,
        subtitle: subtitle,
      });

      console.log("Banner uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading("Upload failed!");
    }
  };

  useEffect(() => {
    const getBanners = async () => {
      try {
        const response = await userRequest.get("/banners");
        setBanners(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBanners(); // ✅ call the function
  }, []);

  const handleDelete = async (id) =>{
    try{
      await userRequest.delete(`/banners/${id}`);
      window.location.reload();
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="flex justify-evenly m-[10%]">
      {/* LEFT SIDE – Displays existing banners */}
      <div className="mr-[50px]">
        <h2 className="text-xl font-semibold mb-4">Active Banners</h2>
        <div className="flex flex-col space-y-4">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="flex items-center justify-between border-b border-x-gray-200 pb-4"
            >
              <img
                src={banner.img}
                alt=""
                className="w-32 h-32 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-xl font-semibold mb-2">{banner.title}</h3>
                <p className="text-gray-600 mb-2">{banner.subtitle}</p>
              </div>
              <button className="bg-red-600 p-2 text-white font-semibold cursor-pointer ml-4"
              onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE – Form to upload a new banner */}
      <div className="flex flex-col">
        <div className="flex-1 bg-white p-5">
          <label className="font-semibold text-xl mb-1">Image</label>
          <div className="flex flex-col">
            {!selectedImage ? (
              <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md mt-2">
                <div className="flex items-center justify-center mt-[40px]">
                  <label htmlFor="file" className="cursor-pointer">
                    <FaPlus className="text-[20px]" />
                  </label>
                </div>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="h-[100px] w-[100px] object-cover rounded-md mt-2"
              />
            )}
            <input
              type="file"
              id="file"
              onChange={imageChange}
              style={{ display: "none" }}
            />
            <span className="text-green-500 mt-[20px]">{uploading}</span>
          </div>
        </div>

        <div className="flex flex-col my-3">
          <span className="font-semibold">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[250px] outline-none border-b-2 border-[#444] border-solid"
          />
        </div>

        <div className="flex flex-col my-3">
          <span className="font-semibold">Subtitle</span>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-[250px] outline-none border-b-2 border-[#444] border-solid"
          />
        </div>

        <button
          className="bg-[#1e1e1e] p-2 text-white font-semibold cursor-pointer"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Banners;
