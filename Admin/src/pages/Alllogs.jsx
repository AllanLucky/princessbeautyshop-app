import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "../requestMethods";

const Alllogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await userRequest.get("/logs"); // your backend endpoint
        setLogs(res.data.logs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "user", headerName: "User", width: 150 },
    { field: "action", headerName: "Action", width: 250 },
    { field: "createdAt", headerName: "Date & Time", width: 200 },
  ];

  return (
    <div className="p-5 w-[79vw]">
      <h1 className="text-2xl font-bold mb-5">System Logs</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <DataGrid
          rows={logs}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Alllogs;

