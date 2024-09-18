import React from 'react'
import { Link } from 'react-router-dom'
import { imageRender } from '../../utils/helpers'

const CategoryCard = ({ category }) => {
  return (
      <div className="shadow-card border-c rounded-lg">
          <Link to={`/category/${category._id}`}>
              <div className="md:h-60 h-[120px] w-full relative overflow-hidden rounded-t-lg ">
                  <img
                      className="hoverable-img"
                      src={imageRender(category.icon)}
                      alt={category.title}
                  />
              </div>
              <div className="md:py-4 py-1 text-center">
                  <h4 className="md:heading-4 heading-7">{category.name}</h4>
                  <p className="text-muted text-[12px] md:text-base">{category.description}</p>
              </div>
          </Link>
      </div>
  )
}

export default CategoryCard