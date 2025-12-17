import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
const Products = () => {
const data = [
  {
    _id: 1,
    title: "Wireless Headphones",
    img: "https://picsum.photos/100?1",
    desc: "Comfortable wireless headphones",
    originaPrice: 120,
    discountPrice: 99,
    instock: true
  },
  {
    _id: 2,
    title: "Smart Watch",
    img: "https://picsum.photos/100?2",
    desc: "Fitness tracking smart watch",
    originaPrice: 150,
    discountPrice: 130,
    instock: true
  },
  {
    _id: 3,
    title: "Bluetooth Speaker",
    img: "https://picsum.photos/100?3",
    desc: "High quality portable speaker",
    originaPrice: 80,
    discountPrice: 65,
    instock: false
  },
  {
    _id: 4,
    title: "Gaming Mouse",
    img: "https://picsum.photos/100?4",
    desc: "Ergonomic RGB gaming mouse",
    originaPrice: 60,
    discountPrice: 45,
    instock: true
  },
  {
    _id: 5,
    title: "Mechanical Keyboard",
    img: "https://picsum.photos/100?5",
    desc: "Backlit mechanical keyboard",
    originaPrice: 140,
    discountPrice: 110,
    instock: true
  },
  {
    _id: 6,
    title: "4K Monitor",
    img: "https://picsum.photos/100?6",
    desc: "Ultra HD display monitor",
    originaPrice: 450,
    discountPrice: 399,
    instock: false
  },
  {
    _id: 7,
    title: "4K Monitor",
    img: "https://picsum.photos/100?6",
    desc: "Ultra HD display monitor",
    originaPrice: 450,
    discountPrice: 399,
    instock: false
  },
   {
    _id: 8,
    title: "4K Monitor",
    img: "https://picsum.photos/100?6",
    desc: "Ultra HD display monitor",
    originaPrice: 450,
    discountPrice: 399,
    instock: false
  },
  //  {
  //   _id: 7,
  //   title: "4K Monitor",
  //   img: "https://picsum.photos/100?6",
  //   desc: "Ultra HD display monitor",
  //   originaPrice: 450,
  //   discountPrice: 399,
  //   instock: false
  // }
];

const columns = [
  { field: "_id", headerName: "ID", width: 90 },

  {
    field: "product",
    headerName: "Product",
    width: 300,
    renderCell: (params) => {
      return (
        <div className='flex items-center'>
          <img
            className='h-8 w-8 rounded-lg object-cover mr-2'
            src={params.row.img}
            alt=""
            height="100px"
            width="100px"
          />
          <span className='font-semibold'>{params.row.title}</span>
        </div>
      );
    },
  },

  { field: "desc", headerName: "Description", width: 150 },
  { field: "originaPrice", headerName: "Price(KES)", width: 100 },
  { field: "instock", headerName: "In Stock", width: 100 },

  {
    field: "edit",
    headerName: "Edit",
    width: 100,
    renderCell: (params) => {
      return (
        <Link to={`/product/${params.row._id}`}>
          <button className='bg-gray-400 text-white cursor-pointer w-[70px]'>Edit</button>
        </Link>
      );
    },
  },

  {
    field: "delete",
    headerName: "Delete",
    width: 100,
    renderCell: () => {
      return <FaTrash className="text-red-500 cursor-pointer" />;
    },
  },
];



  return (
    <div className="p-5 w-[79vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">All Products</h1>
       <Link to="/newproduct">
        <button className="py-3 px-4 bg-green-600 text-white font-semibold rounded-lg">Create Product</button>
       </Link>
      </div>
      {/* CREATING TABLE TO DISPLAY PRODUCTS */}
      <div className='m-[15px]'>
          <DataGrid rows={data} checkboxSelection columns={columns} getRowId={(row) => row._id} />
      </div>
    </div>
  )
}

export default Products
