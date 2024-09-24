import React, { useEffect, useState } from "react";
import {
  addProductReview,
  cancelOrder,
  getAllUserOrders,
  editProductReview
} from "../api/api";
import ToastMsg from "../components/toast/ToastMsg";
import { toast } from "react-toastify";
import { imageRender, numberWithCommas } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RenderNoData from "../components/layout/RenderNoData";
import Spinner from "../components/loaders/Spinner";
import StarRating from "../components/forms/StarRating";
import TextInput from "../components/forms/TextInput";
import ActionButton from "../components/button/ActionButton";
import { reactIcons } from "../utils/icons";

const WishlistDetail = () => {
  const [isUpdate,setIsUpdate]=useState(false)
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [productId, setProductId] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const getOrderDetailsData = async (id) => {
    setFetchLoading(true)
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
    } finally {
      setFetchLoading(false)
    }
  };
  const handleReviewOrder = async (id) => {
    if(!rating || !text){
      toast.error(<ToastMsg title={'Please fill rating and message fields'} />);
      return;

    }
    setLoading(true)
    try {
      const res = isUpdate ? await editProductReview(reviewId, { product: id, rating: rating, text: text })  : await addProductReview({ product: id, rating: rating, text: text });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        toast.success(<ToastMsg title={'Added Successfully'} />);
        setProductId(null)
        setText('')
        setRating(0)
        setIsReviewOpen(false)
        setReviewId('')
        getOrderDetailsData()
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setLoading(false)
    }
  };
const handleCancelOrder = async (id) => { 
  setLoading(true)
  try {
    const res = await cancelOrder({id:id,status:'Cancelled'})
    const { status, data } = res;
    if (status >= 200 && status <= 300) {
      toast.success(<ToastMsg title={'Canceled Successfully'} />);
      getOrderDetailsData()
    } else {
      toast.error(<ToastMsg title={data.message} />);
    }
  } catch (error) {
    toast.error(<ToastMsg title={error?.response?.data?.message} />);
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (user) {
      getOrderDetailsData(user._id);
    }
  }, [user]);
  return (
    <div className="py-6">
      {fetchLoading || !orders ? <Spinner /> :
        <div className="container">
          <div className="grid grid-cols-1  gap-10">
            <div className="border-c col-span-3 rounded-md  max-w-8xl w-full mx-auto">
              <ul className="flex flex-col gap-4">
                {orders?.length > 0 ? (
                  orders?.map((order, orderIndex) => (
                    <li
                      key={order._id}
                      className="py-4 md:px-4 px-2 flex flex-col gap-2  border-b border-b-zinc-200"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div>
                          <div className="font-semibold pb-2 md:text-lg text-sm">Order No {orderIndex + 1}</div>

                        </div>
                        <div className="flex items-center gap-4">
                          
                          <div className="font-semibold pb-2 md:text-lg text-sm text-gray-800">Status:  <span className={`
                      ${order?.status === 'Pending' && 'text-gray-600'}
                      ${order?.status === 'Processed' && 'text-yellow-500'}
                      ${order?.status === 'Delivered' && 'text-green-700'}
                      ${order?.status === 'Rejected' && 'text-red-600'}
                      ${order?.status === 'Cancelled' && 'text-red-600'}
                       font-semibold ml-1`}>
                            {order.status}</span></div>
                          {order.status==='Pending' &&  <button onClick={() => handleCancelOrder(order._id)} className="btn-outline-primary md:text-sm text-[11px]  btn-sm md:py-2 px-4 py-1 ">Cancel Order</button>}
                        </div>

                      </div>
                      {
                        order?.productsList?.map((product) => (
                          <div
                            key={product.product}
                            className="flex items-start cursor-pointer  gap-6  border-b border-b-zinc-200"
                          >
                            <div onClick={() => navigate(`/product/${product.product}`)} className=" md:w-24 md:h-24 w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-zinc-300">
                              <img
                                className="w-full h-full object-contain hoverable-img"
                                src={imageRender(product?.productDetails?.images?.[0])}
                                alt={product?.title}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="md:heading-6 heading-7">{product?.productDetails?.name}</h3>
                              <p className="text-muted font-bold md:text-base text-[11px]">
                                Rs. {numberWithCommas(product?.productDetails?.price)}
                              </p>
                              <div className="md:text-base text-[11px]">
                                <span className="mr-2">Quantity:</span>
                                <b>{product?.quantity}</b>
                              </div>
                              {product?.productDetails?.hasReviewed && 
                              <div>
                                  <div className="mb-0 flex items-center gap-2">
                                    <StarRating
                                      readonly={true}
                                      rating={product?.productDetails?.averageRating}
                                    />
                                    {product?.productDetails?.hasReviewed == true && order?.status === 'Delivered' &&
                                      <ActionButton onClick={() => {
                                        setIsReviewOpen(true)
                                        setProductId(product.product)
                                        setRating(product?.productDetails?.userReview?.rating)
                                        setText(product?.productDetails?.userReview?.text)
                                        setIsUpdate(prev => !prev)
                                        setReviewId(product?.productDetails?.userReview?._id)
                                      }}>
                                        {reactIcons.edit}
                                      </ActionButton>}
                                  </div>
                                  <p className="mb-2">{product?.productDetails?.userReview?.text}</p>
                              </div>
                              }
                              { productId === product?.product && <div className="my-2">
                                <div >
                                  <StarRating
                                    handleRating={setRating}
                                    rating={rating}
                                    isLg />
                                  <div className="mt-2">
                                    <TextInput
                                      type="text"
                                      placeholder="Add your review"
                                      value={text}
                                      onChange={(e) => setText(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>}
                              <div className="flex gap-4 items-center">
                                {order?.status === 'Delivered' && product?.productDetails?.hasReviewed == false && productId !== product?.product && <div onClick={(e) => {
                                  setIsReviewOpen(true)
                                  setProductId(product.product)
                                  // for update reset
                                  setRating('')
                                  setText('')
                                  setIsUpdate(false)
                                  setReviewId('')
                                  e.stopPropagation()
                                }} className="btn-outline-primary btn-sm py-[6px] px-6 inline-flex my-2">
                                  Add Review
                                </div>}
                                {productId === product?.product && (
                                  <>
                                    <div onClick={(e) => {
                                      setIsReviewOpen(false)
                                      setProductId(null)
                                      e.stopPropagation()
                                      setRating('')
                                      setText('')
                                      setIsUpdate(false)
                                      setReviewId('')
                                    }} className="btn-outline-primary btn-sm py-[6px] px-6 inline-flex my-2">
                                      Cancel
                                    </div>
                                    <div onClick={(e) => {
                                      handleReviewOrder(product.product)
                                      e.stopPropagation()
                                    }} className="btn-green btn-sm py-[6px] px-6 inline-flex my-2">
                                      {isUpdate? 'Update' : 'Submit'}
                                    </div>

                                  </>
                                )}

                              </div>

                            </div>


                          </div>
                        ))
                      }
                      <div className="flex items-start md:flex-row flex-col">
                        <div className="flex-grow">
                          <div className="font-semibold">Address:</div>
                          <div>{order?.shippingAddress1}</div>
                          <div>{order?.shippingAddress2}</div>
                          <div>{order?.country} , {order?.city} {order?.zip}</div>

                          <div>{order?.phone}</div>
                        </div>
                        <div className="flex justify-end items-center gap-2 mt-4">
                          <div className="font-semibold pb-2 text-lg">Total Price:  Rs.{numberWithCommas(order?.totalPrice)}</div>

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
      }
    </div>
  );
};

export default WishlistDetail;
