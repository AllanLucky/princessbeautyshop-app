import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from 'react';

const Products = () => {

  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await userRequest.get("/products");
        setProducts(response.data);
      } catch(error) {
        console.log(error);
      }
    }
    getProducts();
  }, [])

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
              src={params.row.img[0]} 
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
    { field: "originalPrice", headerName: "Price(KES)", width: 100 },
    { field: "inStock", headerName: "In Stock", width: 100 },

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
        <h1 className="m-[20px] text-[20px] font-bold">All Products</h1>
        <Link to="/newproduct">
          <button className="py-3 px-4 bg-green-600 text-white font-semibold rounded-lg">Create Product</button>
        </Link>
      </div>
      {/* CREATING TABLE TO DISPLAY PRODUCTS */}
      <div className='m-[15px]'>
        <DataGrid rows={products} checkboxSelection columns={columns} getRowId={(row) => row._id} />
      </div>
    </div>
  )
}

export default Products;
