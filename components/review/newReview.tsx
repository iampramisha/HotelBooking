import React from 'react'

const NewReview = () => {
  return (
   <div
        className="modal fade"
        id="ratingModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                consectetur, mi nec tristique vehicula, elit tellus vulputate
                ex, nec bibendum libero elit at orci.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn my-3 form-btn w-full"
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default NewReview
