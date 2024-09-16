import React, { useEffect, useState } from "react";
import { deleteCategory, getAllOrderList } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import { imageRender, numberWithCommas } from "../../utils/helpers";
import { reactIcons } from "../../utils/icons";
import DeleteButton from "../../components/button/DeleteButton";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import UpdateOrderStatus from "../../components/modals/UpdateOrderStatus";

const Orders = () => {
  const limit = 10
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [formData,setFormData] = useState({})
  const getAllOrders = async () => {
    try {
      const res = await getAllOrderList({ limit, page });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setOrders(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
  const handlePageClick = ({ selected }) => {
    setPage();
  };
  
  useEffect(() => {
    getAllOrders();
  }, [page]);
  return (
    <>
      <div>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="heading-3">All Orders </h3>
          <div>Total orders: <span className="text-sm align-middle">{numberWithCommas(orders?.totalOrders)}</span></div>
        </header>
        <div>
          <div className="overflow-x-auto w-full">
            <table>
              <thead>
                <tr>
                  <th className="w-[80px]">Sr.No</th>
                  <th>Name of User</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.orders?.map((order, index) => (
                  <tr>
                    <td className="w-[80px]">{index + 1}</td>
                    <td>{order.userDetails?.fullName}</td>
                    <td>
                      <div>{order?.shippingAddress1}</div>
                      <div>{order?.shippingAddress2}</div>
                      <div>{order?.zip} {order?.city}, {order?.country}</div>
                      <div>{order?.phone}</div>
                    </td>
                    <td>
                      <span className={`
                      ${order?.status === 'Pending' && 'text-black'}
                      ${order?.status==='Processed' && 'text-yellow-500'}
                      ${order?.status==='Delivered' && 'text-green-700'}
                      ${order?.status === 'Rejected' && 'text-red-600'}
                       font-semibold`}>
                      {order.status}</span>
                      </td>
                    <td>Rs.{numberWithCommas(order.totalPrice)}</td>


                    <td>
                      <div className="flex justify-center gap-2">

                        <DeleteButton
                          onClick={() => {
                            setIsConfirmedOpen(true);
                            setFormData({id:order?._id,status:order.status})
                          }}

                        >
                          {reactIcons.edit}
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="my-4">
          <Pagination handlePageClick={(page) => {
            console.log(page?.selected)
            setPage(page?.selected + 1)
          }} pageCount={orders?.totalPages} />

          </div>
        </div>
      </div>
      <UpdateOrderStatus
        isOpen={isConfirmedOpen}
        closeModal={() => {
          setIsConfirmedOpen(false)
          
        }}
        fetchData={getAllOrders}
        title={"Order"}
        formData={formData}
      />
    </>
  );
};

export default Orders;