import React from "react";
import { imageRender } from "../../utils/helpers";
import { Link } from "react-router-dom";
const CategoriesSwiper = ({ data }) => {
  return (
      < >
        {data.map((category) => (
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
        ))}
      </>
  );
};

export default CategoriesSwiper;
