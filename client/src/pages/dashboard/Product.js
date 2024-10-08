import React, { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import { imageRender } from "../../utils/helpers";
import ActionButton from "../../components/button/ActionButton";
import { reactIcons } from "../../utils/icons";
import DeleteButton from "../../components/button/DeleteButton";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import { Link, useNavigate } from "react-router-dom";
import RenderNoData from "../../components/layout/RenderNoData";
const Product = () => {
    const navigate=useNavigate()
    const[productId,setProductId]=useState(null)
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const getAllProducts = async () => {
    setFetchLoading(true)
    try {
      const res = await getProducts();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setProducts(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      console.log(error,'error')
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }finally{
      setFetchLoading(false)
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);
  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await deleteProduct(productId);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        toast.success(<ToastMsg title="Deleted Successfully" />);
        getAllProducts();
        setIsConfirmedOpen(false);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }finally{
      setLoading(false)
    }
  };
 
  return (
    <>
      <div>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="heading-3">All Products </h3>
          <Link to='add' className="btn-primary">Add New Product </Link>
        </header>
        <div>
          <div className="overflow-x-auto w-full">
            <table>
              <thead>
                <tr>
                  <th className="w-[80px]">Sr.No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Brand</th>
                  <th>Is Featured</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {  products?.map((product, index) => (
                  <tr>
                    <td className="w-[80px]">{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.countInStock}</td>
                    <td>{product.brand}</td>
                    <td>
                      {product.isFeatured ? (
                        <span className="bg-green-300 text-green-900 py-1 px-2 font-semibold rounded-md">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-red-300 text-red-900 py-1 px-2 font-semibold rounded-md">
                          No
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <div className="w-14 h-14">
                          <img
                            className="w-full h-full object-contain"
                            src={imageRender(product?.images[0])}
                            alt={product.name}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <ActionButton onClick={()=>navigate(`update/${product._id}`)}>{reactIcons.edit}</ActionButton>
                        <DeleteButton
                          onClick={() => {
                            setProductId(product._id)
                            setIsConfirmedOpen(true);
                          }}
                        >
                          {reactIcons.delete}
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {products?.length < 1 && !fetchLoading && <RenderNoData title={'No products available'}/>}
                {fetchLoading && <div className="py-8 text-center font-semibold">Loading please wait....</div>}
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DeleteConfirmation
        loading={loading}
        isOpen={isConfirmedOpen}
        closeModal={() => setIsConfirmedOpen(false)}
        handleDelete={handleDelete}
        title={"product"}
      />
    </>
  );
};

export default Product;
