import React, { useEffect, useState } from "react";
import { getCartItems, placeOrder, removeCartItem, checkVoucherCode } from "../api/api";
import ToastMsg from "../components/toast/ToastMsg";
import { toast } from "react-toastify";
import { imageRender, numberWithCommas } from "../utils/helpers";
import TextInput from "../components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateWholeCarts } from "../redux/features/authSlice";
import RenderNoData from "../components/layout/RenderNoData";
import Spinner from "../components/loaders/Spinner";
const initialState = {
  shippingAddress1: "",
  shippingAddress2: "",
  city: "",
  zip: "",
  country: "",
  phone: "",
};
const CartDetail = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState(null);
  const [voucherCode, setVoucherCode] = useState(null);
  const [voucherId, setVoucherId] = useState(null);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(null);
  const totalPrice = cartData?.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);
  const handleReset = () => {
    setForm(initialState);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: "" });
  };
  const areFieldsNotEmpty = (state) => {
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        const value = state[key];

        if (!value || value?.trim() === "") {
          return false;  // Return false if any field is empty
        }
      }
    }
    return true; // All fields are non-empty
  };
  const getcartData = async () => {
    setFetchLoading(true)
    try {
      const res = await getCartItems();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setCartData(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setFetchLoading(false)
    }
  };
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const isValid = areFieldsNotEmpty(form);
    if (!isValid) {
      toast.error(<ToastMsg title="Please fill all required fields" />);
      return;
    }

    setLoading(true)

    try {
      let formData = {
        ...form,
        productsList: cartData.map((item) => item.product._id),
        discountValue,
        voucherId
      };
      const res = await placeOrder(formData);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        toast.success(<ToastMsg title={"Order placed successfully"} />);
        dispatch(
          updateWholeCarts([]
          )
        );
        handleReset();
        getcartData()
        navigate('/orders')
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setLoading(false)
    }
  };
  const handleVoucherCheck = async () => {
    try {
      const res = await checkVoucherCode({ voucherCode, totalPrice });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setDiscountValue(data?.discountValue)
        setVoucherId(data?.voucherId)

      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
  const handleRemoveCartItem = async (id) => {
    setLoading(true)
    try {
      const res = await removeCartItem(id);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        toast.success(<ToastMsg title={"Removed from your cart"} />);
        dispatch(
          updateWholeCarts(user?.carts.filter((item) => item._id !== id))
        );
        getcartData()

      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    getcartData();
  }, []);
  const renderButton = (_id) => {
    return <button
      onClick={(e) => {
        handleRemoveCartItem(_id);
        e.stopPropagation();
      }}
      className="btn-outline-primary"
    >
      Remove
    </button>
  }

  return (
    <div className="py-6">
      {loading || fetchLoading || !cartData ? <Spinner /> :
        <div className="container">
          <div className={`flex md:flex-row flex-col md:gap-8 gap-4 `}>
            <div className={` ${cartData?.length < 1 && 'col-span-full'} border-c col-span-3 flex-grow rounded-md`}>
              <ul>

                {cartData?.length > 0 ? (
                  <>
                    {cartData.map(({ product, quantity, _id }) => (
                      <div
                        onClick={() => navigate(`/product/${product._id}`)}
                        key={product._id}
                        className="flex md:items-center items-start  md:gap-6 gap-4 md:py-4 py-3 md:px-6 px-2 border-b border-b-zinc-200"
                      >
                        <div className=" md:w-24 md:h-24 w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-zinc-300">
                          <img
                            className="w-full h-full object-contain hoverable-img"
                            src={imageRender(product?.images?.[0])}
                            alt={product?.title}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="md:heading-6 heading-7">{product?.name}</h3>
                          <p className="text-muted font-bold md:text-base text-[11px]">
                            Rs. {numberWithCommas(product?.price)}
                          </p>
                          <p className="md:text-base text-[11px]">
                            {" "}
                            <strong className="font-semibold">
                              Quantity:
                            </strong>{" "}
                            <span className="font-medium">{quantity}</span>
                          </p>
                          <div className="block md:hidden mt-1">
                            {renderButton(_id)}
                          </div>
                        </div>
                        <div className="md:block hidden">
                          {renderButton(_id)}
                        </div>
                      </div>
                    ))}
                    <li>
                      <div className="flex justify-between items-center px-4 py-4 border-t border-t-zinc-200">
                        <h4 className="heading-4">Total Amount</h4>
                        <p className="text-muted font-bold md:text-base text-[11px]">
                          Rs. {numberWithCommas(totalPrice)}
                        </p>
                      </div>
                      {discountValue && <div className="flex justify-between px-4 ">
                        <h4 className="heading-6">Discount Applied</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-green-700 font-bold md:text-base text-[11px]">
                            -{numberWithCommas(discountValue)} 
                          </p>
                          <p className="font-bold md:text-base text-[11px]">
                             =  Rs.{numberWithCommas(totalPrice - discountValue)}
                          </p>
                        </div>


                      </div>}
                    </li>
                  </>
                ) : (
                  <li>
                    <RenderNoData title={"Your cart is empty"} />
                  </li>
                )}
              </ul>
            </div>
            {cartData?.length > 0 && <div className="border-c col-span-2 rounded-md md:w-[450px] w-full">
              <form onSubmit={handlePlaceOrder} action="" className="w-full">
                <header className="py-4 border-b border-b-zinc-200 px-4">
                  <h4 className="heading-4 ">Enter shipping Details</h4>
                </header>
                <div className="space-y-2 px-4 py-4">
                  <TextInput
                    label={"shipping Address 1"}
                    type="text"
                    placeholder="Enter shipping Address 1"
                    name="shippingAddress1"
                    value={form.shippingAddress1}
                    onChange={handleChange}
                    error={error.shippingAddress1}
                  />
                  <TextInput
                    label={"shipping Address 2"}
                    type="text"
                    placeholder="Enter shipping Address 2"
                    name="shippingAddress2"
                    value={form.shippingAddress2}
                    onChange={handleChange}
                    error={error.shippingAddress2}
                  />
                  <TextInput
                    label={"Country"}
                    type="text"
                    placeholder="Enter country name"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    error={error.country}
                  />
                  <TextInput
                    label={"City"}
                    type="text"
                    placeholder="Enter city name"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={error.city}
                  />
                  <TextInput
                    label={"Zip Code"}
                    type="number"
                    placeholder="Enter zip code"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    error={error.zip}
                  />
                  <TextInput
                    label={"Phone Number"}
                    type="number"
                    placeholder="Enter phone number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={error.phone}
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <TextInput
                        label={"Have any voucher code?"}
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value);
                        }}
                        helperText="Voucher field is not required"
                      />

                    </div>
                    <button type="button" onClick={handleVoucherCheck} className="btn-outline-primary text-xs px-4">
                      Check Availability
                    </button>
                  </div>
                  {discountValue && <p className="py-1">You got <b className="text-green-800">Rs.{discountValue}</b> discount</p>}
                  <button type="submit" className="btn-primary">
                    Place Order
                  </button>
                </div>
              </form>
            </div>}
          </div>
        </div>
      }
    </div>
  );
};

export default CartDetail;
