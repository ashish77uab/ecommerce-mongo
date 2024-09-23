import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import {
  AddProduct,
  AllProducts,
  AllSubCategory,
  CartDetail,
  Category,
  Dashboard,
  ForgotPassword,
  Home,
  Login,
  OrderDetailsPage,
  Product,
  ProductDetail,
  Register,
  ResetPassword,
  SubCategory,
  WishlistDetail,
  Profile,
  Orders,
  AllCategories,
  Banners,
  AddBanners,
  AllUsers,
  Vouchers,
  CreateAndUpdateVoucher
} from "./pages";
import { getUser } from "./api/api";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/features/authSlice";
import ToastMsg from "./components/toast/ToastMsg";
import { useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoutes from "./ProtectedRoutes";
function App() {
  const dispatch = useDispatch();
  const getUserData = async () => {
    try {
      const res = await getUser();
      const { status, data } = res;
      if (status >= 200 && status < 300) {
        dispatch(setUser(data));
      } else {
        toast.error(<ToastMsg title={"Something went wrong"} />);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("ashishToken")) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/category/:id" element={<AllSubCategory />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoutes> <CartDetail /> </ProtectedRoutes>} />
            <Route path="/wishlist" element={<ProtectedRoutes> <WishlistDetail /></ProtectedRoutes>} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/categories" element={<AllCategories />} />
            <Route path="/orders" element={<ProtectedRoutes> <OrderDetailsPage /></ProtectedRoutes>} />
            <Route path="/profile/:userId" element={<ProtectedRoutes> <Profile /></ProtectedRoutes>} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Category />} />
            <Route path="create/vouchers" element={<CreateAndUpdateVoucher />} />
            <Route path="/dashboard/update/vouchers/:voucherId" element={<CreateAndUpdateVoucher />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="categories/:id" element={<SubCategory />} />
            <Route path="products" element={<Product />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/update/:productId" element={<AddProduct />} />
            <Route path="banners" element={<Banners />} />
            <Route path="banners/add" element={<AddBanners />} />
            <Route path="banners/update/:bannerId" element={<AddBanners />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passwordReset" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        className={
          "lg:w-[500px] text-16 font-semibold w-full max-w-full  m-auto p-0 !font-poppins"
        }
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
    </div>
  );
}

export default App;
