
import { FaCheckDouble, FaClock, FaRegCheckCircle } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';

const Orders = () => {

  const dataOrders = [
    {
      _id: "1",
      customerName: "John Doe",
      productName: "Wireless Headphones",
      quantity: 2,
      totalAmount: 120,
      status: "Completed",
      date: "2025-02-10"
    },
    {
      _id: "2",
      customerName: "Mary Johnson",
      productName: "Smartphone Case",
      quantity: 1,
      totalAmount: 15,
      status: "Pending",
      date: "2025-02-09"
    },
    {
      _id: "3",
      customerName: "Alex Kim",
      productName: "Bluetooth Speaker",
      quantity: 3,
      totalAmount: 180,
      status: "Completed",
      date: "2025-02-08"
    },
    {
      _id: "4",
      customerName: "Sarah Lee",
      productName: "Laptop Stand",
      quantity: 1,
      totalAmount: 45,
      status: "Cancelled",
      date: "2025-02-07"
    },
    {
      _id: "5",
      customerName: "James Brown",
      productName: "USB-C Cable",
      quantity: 4,
      totalAmount: 40,
      status: "Completed",
      date: "2025-02-06"
    },
    {
      _id: "6",
      customerName: "Vivian Atieno",
      productName: "Mechanical Keyboard",
      quantity: 1,
      totalAmount: 95,
      status: "Pending",
      date: "2025-02-05"
    },
    {
      _id: "6",
      customerName: "Vivian Atieno",
      productName: "Mechanical Keyboard",
      quantity: 1,
      totalAmount: 95,
      status: "Pending",
      date: "2025-02-05"
    }
  ];

  const dataColumn = [
    { field: "_id", headerName: "Order ID", width: 100 },
    { field: "customerName", headerName: "Customer", width: 200 },
    { field: "productName", headerName: "Product", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "totalAmount", headerName: "Total Amount", width: 120 },
    { field: "date", headerName: "Date", width: 120 },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === "Pending" ? (
              <FaClock className="text-yellow-500 text-[25px] cursor-pointer mt-2" />
            ) : (
              <FaCheckDouble className="text-green-500 text-[25px] cursor-pointer mt-2" />
            )}
          </>
        );
      },
    },

    {
      field: "Deliver",
      headerName: "Mark as Delivered",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === "Pending" ? (
              <FaRegCheckCircle
                className="text-[25px] cursor-pointer mt-2"
                onClick={() => handleUpdateOrder(params.row._id)}
              />
            ) : (
              ""
            )}
          </>
        );
      },
    }

  ];

  // Dummy function to avoid errors
  const handleUpdateOrder = (id) => {
    console.log("Mark order as delivered:", id);
  };

  return (
    <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">All Orders</h1>
      </div>
      <div className='m-[30px]'>
        <DataGrid rows={dataOrders} checkboxSelection columns={dataColumn} getRowId={(row) => row._id} />
      </div>
    </div>
  );
}

export default Orders;
