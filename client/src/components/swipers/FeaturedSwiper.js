import React from "react";
import ProductCard from "../cards/ProductCard";
const FeaturedSwiper = ({ data }) => {
  return (
    <>
      {data.map((product) => (
        <div className="shadow-card border-c rounded-lg">
          <ProductCard product={product} />
        </div>
      ))}
     
    </>
  );
};

export default FeaturedSwiper;
