import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ToastMsg from "../components/toast/ToastMsg";
import RenderNoData from "../components/layout/RenderNoData";
import CategoryCardSkeleton from "../components/cards/CategoryCardSkeleton";
import { getCategories } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { imageRender } from "../utils/helpers";
import { reactIcons } from "../utils/icons";

const AllCategories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
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
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <section className=" py-4 pb-10">
      <div className="container">
        <header className="py-4">
          <h4 className="heading-3 flex items-center gap-1"> <span className="text-6xl" role="button" onClick={() => {
            navigate(-1)
          }}>{reactIcons.goback}</span> All categories</h4>
        </header>
        <div className="grid grid-cols-4 gap-4">
          { skeletonLoading? Array(12)
                                  .fill(2)
                                  .map((_item, index) => (
                                    <CategoryCardSkeleton key={index} />
                                  ))  :categories.length > 0 ? (
            categories.map((category) => (
              <div className="shadow-card border-c rounded-lg">
                <Link to={`/category/${category._id}`}>
                  <div className="h-60 w-full relative overflow-hidden rounded-t-lg ">
                    <img
                      className="hoverable-img"
                      src={imageRender(category.icon)}
                      alt={category.title}
                    />
                  </div>
                  <div className="py-4 text-center">
                    <h4 className="heading-4">{category.name}</h4>
                    <p className="text-muted">{category.description}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <RenderNoData
              title={"No category found"}
              className={"col-span-full"}
            />
          ) }
        </div>
      </div>
    </section>
  );
};

export default AllCategories;
