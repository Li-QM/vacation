import React from 'react';
import { Link } from 'react-router-dom';

const WhyHost = props => (
  <section className="host-section">
    <div className="page-container-responsive page-container-no-padding">
      <div className="row flex-container">
        <div className="col-md-4">
          <Link to="#">
            <div className="host-area cenralize">
              <div className="host-container h-260">
                <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_auto/v1555703148/images/booking_1.webp" alt="Booking1" />
                <div className="image-shadow" />
              </div>
              <h4 className="stat-text">Deal direct with your host</h4>
              <ul className="host-list">
                <li>Open, unfiltered communication</li>
                <li>Phone - email - even Live Chat</li>
                <li>Build trust before you book</li>
              </ul>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="#">
            <div className="host-area cenralize">
              <div className="host-container h-260">
                <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_auto/v1555703149/images/booking_2.webp"  alt="Booking2" />
                <div className="image-shadow" />
              </div>
              <h4 className="stat-text">Why list your home with us?</h4>
              <ul className="host-list">
                <li>Advertising and exposure</li>
                <li>A simple annual membership and nothing more</li>
                <li>Reach more prospective clients</li>
              </ul>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="#" className="login_popup_open">
            <div className="host-area cenralize">
              <div className="host-container h-260">
                <img src="https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,q_auto:low,w_auto/v1555703148/images/list-vacation1.webp"  alt="" />
                <div className="image-shadow" />
              </div>
              <h4 className="stat-text">List your vacation rental</h4>
              <ul className="host-list">
                <li>It only takes minutes</li>
                <li>Easy calendar, rates, and gallery</li>
                <li>Immediate exposure</li>
              </ul>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default WhyHost;