import React from 'react'
import { imageRender } from '../../utils/helpers'
import { Link } from 'react-router-dom'

const SubCategoryCard = ({ category }) => {
  console.log(category?.category,'category')
  return (
    <Link to={`/products?category=${category?.category}`} className="shadow-card border-c rounded-lg">
      <div className="h-60 w-full relative overflow-hidden rounded-t-lg ">
        <img
          className="hoverable-img"
          src={imageRender(category.icon)}
          alt={category.title}
        />
      </div>
      <div className="py-4 text-center px-4">
        <h4 className="heading-4">{category.name}</h4>
      </div>
    </Link>
  )
}

export default SubCategoryCard
