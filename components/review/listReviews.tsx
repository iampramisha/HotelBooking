import React from 'react'

const ListReviews = () => {
  return (
  <div className="reviews w-full lg:w-3/4 mb-10">
        <h3 className="text-xl font-semibold mb-2">3 Reviews</h3>
        <hr className="mb-4" />
        <div className="review-card my-3">
          <div className="flex items-start gap-4">
            <div>
              <img
                src="./images/avatar.jpg"
                alt="John Doe"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="star-ratings flex">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half"></i>
              </div>
              <p className="review_user mt-1">by John Doe</p>
              <p className="review_comment">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                consectetur, mi nec tristique vehicula, elit tellus vulputate
                ex, nec bibendum libero elit at orci.
              </p>
            </div>
          </div>
          <hr className="my-2" />
        </div>
      </div>
  )
}

export default ListReviews
