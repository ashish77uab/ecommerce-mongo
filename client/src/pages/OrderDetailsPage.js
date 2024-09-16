import React, { useEffect, useState } from "react";
import {
  getAllUserOrders,
} from "../api/api";
import ToastMsg from "../components/toast/ToastMsg";
import { toast } from "react-toastify";
import { imageRender, numberWithCommas } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import RenderNoData from "../components/layout/RenderNoData";

const WishlistDetail = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);

  const getOrderDetailsData = async (id) => {
    try {
      const res = await getAllUserOrders(id);
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
  

  useEffect(() => {
    if (user) {
      getOrderDetailsData(user._id);
    }
  }, [user]);
  return (
    <div className="py-6">
      <div className="container">
        <div className="grid grid-cols-1  gap-10">
          <div className="border-c col-span-3 rounded-md  max-w-8xl w-full mx-auto">
            <ul className="flex flex-col gap-4">
              {orders.length > 0 ? (
                orders?.map((order, orderIndex) => (
                  <li
                    key={order._id}
                    className="py-4 px-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-semibold pb-2 text-lg">Order No {orderIndex + 1}</div>
                      <div className="font-semibold pb-2 text-lg">Status:  <span className={`
                      ${order?.status === 'Pending' && 'text-gray-600'}
                      ${order?.status === 'Processed' && 'text-yellow-500'}
                      ${order?.status === 'Delivered' && 'text-green-700'}
                      ${order?.status === 'Rejected' && 'text-red-600'}
                       font-semibold ml-1`}>
                        {order.status}</span></div>

                    </div>
                    {
                      order?.productsList?.map((product) => (
                        <div
                          onClick={() => navigate(`/product/${product.product}`)}
                          key={product.product}
                          className="flex items-center cursor-pointer hover:bg-amber-100 gap-6 py-4 px-6 border-b border-b-zinc-200"
                        >
                          <div className=" w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-zinc-300">
                            <img
                              className="w-full h-full object-contain hoverable-img"
                              src={imageRender(product?.productDetails?.images?.[0])}
                              alt={product?.title}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="heading-6">{product?.productDetails?.name}</h3>
                            <p className="text-muted font-bold">
                              Rs. {numberWithCommas(product?.productDetails?.price)}
                            </p>
                            <div>
                              <span className="mr-2">Quantity:</span>
                              <b>{product?.quantity}</b>
                            </div>
                          </div>
                          

                        </div>
                      ))
                    }
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <div className="font-semibold">Address:</div>
                       <div>{order?.shippingAddress1}</div>
                       <div>{order?.shippingAddress2}</div>
                        <div>{order?.country} , {order?.city} {order?.zip}</div>
                     
                        <div>{order?.phone}</div>
                      </div>
                    <div className="flex justify-end items-center gap-2 mt-4">
                      <div className="font-semibold pb-2 text-lg">Total Price:  Rs.{ numberWithCommas(order?.totalPrice)}</div>

                    </div>

                    </div>

                  </li>
                ))

              ) : (
                <li>
                  <RenderNoData title={"You haven't ordered yet"} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDetail;
