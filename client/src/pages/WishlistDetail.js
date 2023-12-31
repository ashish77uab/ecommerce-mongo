import React, { useEffect, useState } from "react";
import { getWishlistItem, removeWishlistItem } from "../api/api";
import ToastMsg from "../components/toast/ToastMsg";
import { toast } from "react-toastify";
import { imageRender, numberWithCommas } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateWishList } from "../redux/features/authSlice";
import RenderNoData from "../components/layout/RenderNoData";

const WishlistDetail = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [wishlistData, setWishlistData] = useState([]);

  const getWishlistData = async () => {
    try {
      const res = await getWishlistItem();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setWishlistData(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
  const handleRemoveWishlist = async (id) => {
    try {
      const res = await removeWishlistItem(id);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        toast.success(<ToastMsg title={"Removed from your wishlist"} />);
        dispatch(
          updateWishList(user?.whislistItems.filter((item) => item._id !== id))
        );
        getWishlistData();
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };

  useEffect(() => {
    getWishlistData();
  }, []);

  return (
    <div className="py-6">
      <div className="container">
        <div className="grid grid-cols-1  gap-10">
          <div className="border-c col-span-3 rounded-md  max-w-3xl w-full mx-auto">
            <ul>
              {wishlistData.length > 0 ? (
                wishlistData.map(({ product, _id }) => (
                  <div
                    onClick={() => navigate(`/product/${product._id}`)}
                    key={product._id}
                    className="flex items-center cursor-pointer hover:bg-amber-100 gap-6 py-4 px-6 border-b border-b-zinc-200"
                  >
                    <div className=" w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-zinc-300">
                      <img
                        className="w-full h-full object-contain hoverable-img"
                        src={imageRender(product?.images?.[0])}
                        alt={product?.title}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-6">{product?.name}</h3>
                      <p className="text-muted font-bold">
                        Rs. {numberWithCommas(product?.price)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        handleRemoveWishlist(_id);
                        e.stopPropagation();
                      }}
                      className="btn-outline-primary"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <li>
                  <RenderNoData title={"Your wishlist is empty"} />
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
