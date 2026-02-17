import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequest } from "../requestMethods"; // Axios instance with auth token
import { toast, ToastContainer } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";

const Reviews = () => {
  const { id } = useParams(); // Product ID from URL
  const [reviews, setReviews] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/products/reviews/${id}`);
        console.log("Reviews response:", res.data); // Debug
        setReviews(res.data.reviews || []);
        setProductTitle(res.data.title || "");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const columns = [
    { field: "_id", headerName: "Review ID", width: 220 },
    {
      field: "postedBy",
      headerName: "User",
      width: 250,
      valueGetter: (params) => {
        // postedBy is populated with { name, email }
        if (params.row.postedBy) {
          return `${params.row.postedBy.name} (${params.row.postedBy.email})`;
        }
        return "Unknown User";
      },
    },
    { field: "star", headerName: "Rating", width: 100 },
    { field: "comment", headerName: "Comment", width: 400 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD MMM YYYY, h:mm A") : "",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-2">
        Product Reviews {productTitle && `- ${productTitle}`}
      </h1>
      <p className="mb-6 text-gray-600">Total Reviews: {reviews.length}</p>
      <div className="bg-white rounded-xl shadow p-4 w-full">
        <DataGrid
          rows={reviews.map((r) => ({ ...r, id: r._id }))}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              background: "#f9fafb",
              fontWeight: "600",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Reviews;
