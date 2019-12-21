import React from 'react'
import 'assets/styles/home/actionbar.scss'

const ActionBar = props => (
  <div className="action_box style1 mb-80" data-arrowpos="center">
    <div className="action_box_inner container ">
      <div className="page-container-no-padding action_box_content row d-flex-lg align-content-center">
        <div className="ac-content-text col-sm-12 col-md-12 col-lg-9 mb-md-20">
          <h4 className="text text-center text-md-left ">
            Ready to join the hundreds of homeowners and property managers listing on <span className="fw-bold">Vacation.Rentals?</span>
          </h4>
        </div>
        <div className="ac-buttons col-sm-12 col-md-12 col-lg-3 d-flex align-self-center justify-content-center justify-content-lg-end">
          <a href="/rooms/new" className="btn-lined btn-lg ac-btn w-100 text-center" title="List your property with Vacation.Rentals">
            Get Started!
          </a>
        </div>
      </div>
    </div>
  </div>
)

export default ActionBar;