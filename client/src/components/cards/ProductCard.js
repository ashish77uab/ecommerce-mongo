import React from "react";
import { Link } from "react-router-dom";
import { imageRender, numberWithCommas } from "../../utils/helpers";
import StarRating from "../forms/StarRating";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="md:h-60 h-[120px] w-full relative overflow-hidden rounded-t-lg ">
        <img
          className="hoverable-img"
          src={imageRender(product.images[0])}
          alt={product.title}
        />
      </div>
      <div className="py-4 md:px-4 px-2 md:space-y-2 space-y-0 bg-neutral-200 rounded-b-lg">
        <div className="md:text-center text-left">
          <h4 className="md:heading-4 heading-7 line-clamp-1">{product.name}</h4>
          <p className="text-muted line-clamp-1  text-[10px] md:text-base">{product.description}</p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span>{product.brand}</span>
            <span className="text-black text-sm font-semibold">
              Rs. {numberWithCommas(product.price)}
            </span>
          </div>
          <div className="md:block  hidden">
            <div>
              <StarRating readonly={true} number={product.rating} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
