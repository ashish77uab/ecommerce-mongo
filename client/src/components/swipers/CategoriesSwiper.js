import React from "react";
import { imageRender } from "../../utils/helpers";
import { Link } from "react-router-dom";
import CategoryCard from "../cards/CategoryCard";
const CategoriesSwiper = ({ data }) => {
  return (
      < >
        {data.map((category) => (
         <CategoryCard category={category}/>
        ))}
      </>
  );
};

export default CategoriesSwiper;
