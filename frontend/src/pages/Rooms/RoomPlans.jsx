import React from 'react';

import Publishtitle from 'components/rooms/plan/publishtitle/Publishtitle';
import Publishbutton from 'components/rooms/plan/publishbutton/Publishbutton';
import Pricingpage from 'components/price/Pricingpage';

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/plan.scss';

class RoomPlans extends React.Component {
  // constructor(props){
  //     super(props)
  // }
  componentDidMount () {

  }
  render() {
    return (
      <div className="room-publish manage-listing-content-wrapper">
        <div className="listing_whole col-md-9" id="js-manage-listing-content">
          <div className="common_listpage">
            <Publishtitle />
            <Pricingpage />
          </div>
        </div>

        <div className="col-md-3 col-sm-12 listing_desc location_desc">
          <div className="manage_listing_left">
            <img src={property_help} className="col-center" width={75} height={75} alt="property help"/>
            <div className="amenities_about">
            <h4>Guests Love Video</h4>
              <h4>Benefits Of Membership</h4>
              <Publishbutton roomId={this.props.match.params.room_id} />
              <p>Membership in our site gives you immediate exposure to 1,000s of travelers who are searching our site each day.
              Each membership allows you to upload 35 images, get a free custom YouTube video,
                            500 custom business cards with holder and utilize all of the features of this site to include iCal, SMS notifications, Google maps and much more.</p>
              <p>Sign up today and take back control of your vacation rental listing. </p>
              <p>Please make sure to join our homeowners <a href="https://www.facebook.com/groups/vacation.rentals4U/" target="_blank" rel="noopener noreferrer">Facebook Group</a> to stay abreast of all updates and improvements.</p>
              <em>*Please contact us at sales@vacation.rentals for any assistance with your listing(s).</em>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomPlans;
