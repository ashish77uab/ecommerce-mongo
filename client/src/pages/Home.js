import React, { useEffect, useState } from "react";
import { getBanners, getCategories, getFeaturedProducts } from "../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../components/toast/ToastMsg";
import CategoriesSwiper from "../components/swipers/CategoriesSwiper";
import FeaturedSwiper from "../components/swipers/FeaturedSwiper";
import ProductCardSkeleton from "../components/cards/ProductCardSkeleton";
import CategoryCardSkeleton from "../components/cards/CategoryCardSkeleton";
import { reactIcons } from "../utils/icons";
import { Link } from "react-router-dom";
import RenderNoData from "../components/layout/RenderNoData";
import { BANNERS_VALUES_ONLY } from "../utils/constants";
import HomeBannerSlider from "../components/slider/HomeBannerSlider";
import {io} from 'socket.io-client'
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [homeBanner, setHomeBanner] = useState(null);
  const getAllBanners = async () => {
    setSkeletonLoading(true)
    try {
      const res = await getBanners();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        let homeBanner = data?.find(item => item?.type === BANNERS_VALUES_ONLY.homeBanner)
        setHomeBanner(homeBanner);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      console.log(error, 'error')
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setSkeletonLoading(false)
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await getCategories();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setCategories(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setSkeletonLoading(false)
    }
  };
  const getAllFeaturedProducts = async () => {
    try {
      const res = await getFeaturedProducts();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setFeaturedProducts(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setSkeletonLoading(false)
    }
  };
  useEffect(() => {
     getAllCategories()
     getAllFeaturedProducts()
     getAllBanners()
  }, []);
  return (
    <section className=" pt-8 pb-20 space-y-4">
      <div className="container">
        <div className="relative">
          <HomeBannerSlider data={homeBanner}/>
        </div>
      </div>
      <div className="container">
        <header className="py-4 flex justify-between gap-4  mb-4">
          <h4 className="heading-3">Top Categories</h4>
          <Link className="flex items-center gap-2 btn-outline-primary px-4" to='/categories'>View All Categories <span>{reactIcons.arrowright}</span></Link>
        </header>
        <div className="grid md:grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-1">
          {skeletonLoading ? (
            < >
              {Array(4)
                .fill(2)
                .map((_item, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
            </>
          ) : (
              categories?.length> 0 ?    <CategoriesSwiper data={categories} /> :<RenderNoData title={'No categories available'}/>
          )}
        </div>
      </div>
      <div className="container">
        <header className="py-4 flex justify-between gap-4  mb-4">
          <h4 className="heading-3">Featured Products</h4>
          <Link className="flex items-center gap-2 btn-outline-primary px-4" to='/products'>View All Products <span>{reactIcons.arrowright}</span></Link>
        </header>
        <div className="grid md:grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-1">
          {skeletonLoading ? (
            <>
              {Array(4)
                .fill(2)
                .map((_item, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
            </>
          ) : (
              featuredProducts?.length > 0 ? <FeaturedSwiper data={featuredProducts} /> :<RenderNoData title={'No featured products available'}/>
            
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
