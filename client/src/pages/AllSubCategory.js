import React, { useEffect, useState } from "react";
import { getAllSubCategories } from "../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../components/toast/ToastMsg";
import { imageRender } from "../utils/helpers";
import { useNavigate, useParams } from "react-router-dom";
import RenderNoData from "../components/layout/RenderNoData";
import SubCategoryCard from "../components/cards/SubCategoryCard";
import SubCategoryCardSkeleton from "../components/cards/SubCategoryCardSkeleton";
import { reactIcons } from "../utils/icons";

const AllSubCategory = () => {
  const navigate=useNavigate()
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const getAllSubCategoriesData = async (id) => {
    try {
      const res = await getAllSubCategories({ id });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setSubCategories(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }finally{
        setSkeletonLoading(false)
    }
  };
  useEffect(() => {
    getAllSubCategoriesData(id);
  }, [id]);
  return (
    <section className=" py-4 pb-10">
      <div className="container">
        <header className="py-4">
          <h4 className="heading-3 flex items-center gap-1"> <span className="md:text-4xl text-2xl" role="button" onClick={()=>{
            navigate(-1)
          }}>{reactIcons.goback}</span>  All sub categories</h4>
        </header>
        <div className="grid md:grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-1">
          { skeletonLoading? Array(12)
                                  .fill(2)
                                  .map((_item, index) => (
                                      <SubCategoryCardSkeleton key={index} />
                                  ))  :subCategories.length > 0 ? (
            subCategories.map((category) => (
             <SubCategoryCard category={category}/>
            ))
          ) : (
            <RenderNoData
              title={"No sub category found"}
              className={"col-span-full"}
            />
          ) }
        </div>
      </div>
    </section>
  );
};

export default AllSubCategory;
