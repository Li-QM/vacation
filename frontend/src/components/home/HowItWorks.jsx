import React from 'react'
import { Masks } from 'components'
import 'assets/styles/home/howitworks.scss'

const HowItWorks = props => (
  <div className="how-it-works">
    <div className="page-container-responsive">
      <div className="text-intro">
        <h2>How it works</h2>
      </div>

      <div className="row">
        <div className="how-it-sect col-lg-3 col-md-6 col-sm-12">
          <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_130,h_130/v1555703591/images/how1.webp" alt="search"/>
          <h3>Search</h3>
          <p>Search for the perfect vacation home for rent from our verified listings</p>
        </div>

        <div className="how-it-sect col-lg-3 col-md-6 col-sm-12">
          <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_130,h_130/v1555703591/images/how2.webp" alt="inquiry"/>
          <h3>Make an inquiry</h3>
          <p>Contact the owner or property manager directly</p>
        </div>

        <div className="how-it-sect col-lg-3 col-md-6 col-sm-12">
          <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_130,h_130/v1555703591/images/how3.webp" alt="booking"/>
          <h3>Make the booking</h3>
          <p>Once you have settled on the home of your choice, book direct with the homeowner or property manager</p>
        </div>

        <div className="how-it-sect col-lg-3 col-md-6 col-sm-12">
          <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_130,h_130/v1555703591/images/how4.webp" alt="review"/>
          <h3>Review your stay</h3>
          <p>Tell others about the great trip you had and place you stayed</p>
        </div>
      </div>
    </div>

    <Masks mode={2} />
  </div>
)

export default HowItWorks;