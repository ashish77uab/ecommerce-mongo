import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToCart, addToWishList, getSingleProduct } from "../api/api";
import ToastMsg from "../components/toast/ToastMsg";
import { toast } from "react-toastify";
import { imageRender, numberWithCommas } from "../utils/helpers";
import ImagesSwiper from "../components/swipers/ImagesSwiper";
import { reactIcons } from "../utils/icons";
import StarRating from "../components/forms/StarRating";
import { useDispatch, useSelector } from "react-redux";
import { setUserWishList, updateUserCarts } from "../redux/features/authSlice";
import { getUserToken } from "../utils/constants";
import Spinner from "../components/loaders/Spinner";
const ProductDetail = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [gotoCart, setGoToCart] = useState(false);
  const [wishListAdded, setWishListAdded] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const isLoggedIn = getUserToken()
  const getProduct = async (id) => {
    setFetchLoading(true)
    try {
      const res = await getSingleProduct(id);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setProduct(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally{
      setFetchLoading(false)
    }
  };

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      user?.carts?.forEach((item) => {
        if (String(item.product) === String(id) && item.isPlaced === false) {
          setGoToCart(true);
        }
      });
      user?.whislistItems?.forEach((item) => {
        if (String(item.product) === String(id)) {
          setWishListAdded(true);
        }
      });
    }

  }, [user])

  const handleQuantity = (type) => {
    if (type === "inc") {
      setQuantity((prev) => (prev < 10 ? prev + 1 : 10));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error(<ToastMsg title={'Login first to add to cart'} />);
      return
    }
    try {
      const res = await addToCart({ product: id, quantity: quantity });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        dispatch(
          updateUserCarts(data)
        );
        toast.success(<ToastMsg title={"Added Successfully"} />);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
  const handleAddToWishList = async () => {
    if (!isLoggedIn) {
      toast.error(<ToastMsg title={'Login first to add to wishlist'} />);
      return
    }
    try {
      const res = await addToWishList({ product: id });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        dispatch(
          setUserWishList({
            product: id,
            user: user._id,
          })
        );
        toast.success(
          <ToastMsg title={"Added to your wishlist successfully"} />
        );
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
  return (

    <>
      {fetchLoading|| !product ? <Spinner/>
        :
        <div className="py-4">
          <div className="container">
            <div className="flex gap-10">
              <div className="relative max-w-[600px] w-full bg-zinc-100 ">
                <div className="w-full  h-[600px] rounded-md overflow-hidden bg-zinc-300">
                  <img
                    className="w-full h-full object-contain hoverable-img"
                    src={imageRender(product?.images?.[active])}
                    alt={product?.title}
                  />
                </div>
                <div className=" py-4">
                  <ImagesSwiper
                    data={product?.images}
                    active={active}
                    setActive={setActive}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="heading-3 mb-2">{product?.name}</h3>
                <h6 className="heading-6">{product?.description}</h6>
                <p className="text-muted">{product?.richDescription}</p>
                <p className="text-3xl font-bold my-2">
                  Rs. {numberWithCommas(product?.price || 0)}
                </p>

                <div className="bg-amber-300 inline-block text-black py-2 px-4 rounded-md">
                  {product?.brand}
                </div>
                <div className="flex gap-4 items-center">
                  <strong>Quantity:</strong>
                  <div className="flex gap-1 items-center py-2">
                    <button
                      onClick={() => handleQuantity("dec")}
                      className="w-10 h-8 rounded-md bg-amber-400 text-black text-xl flex-center"
                    >
                      {reactIcons.minus}
                    </button>
                    <span className="w-[40px] text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity("inc")}
                      className="w-10 h-8 rounded-md bg-amber-400 text-black text-xl flex-center"
                    >
                      {reactIcons.plus}
                    </button>
                  </div>
                </div>
                <div className="py-2">
                  <StarRating readonly={true} number={product?.rating} />
                </div>
                <div className="flex gap-4 items-center">
                  {gotoCart ? (
                    <Link to="/cart" className="btn-primary">
                      Go to cart
                    </Link>
                  ) : (
                    <button onClick={handleAddToCart} className="btn-primary">
                      Add to cart
                    </button>
                  )}
                  {wishListAdded ? (
                    <button className="btn-outline-primary">
                      Added (view wishlist)
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToWishList}
                      className="btn-outline-primary"
                    >
                      Add to Wishlist
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default ProductDetail;
