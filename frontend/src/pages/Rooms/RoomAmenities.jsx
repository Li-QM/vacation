import React from 'react';

import AmenitiestList from 'components/rooms/Amenities/AmenitiestList'
import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import ManageRoomFooter from "components/rooms/ManageRoomFooter";

import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/amenities.scss';

class RoomAmenities extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      amenities_type: [],
      amenities: [],
      prev_amenities: []
    }
    this.handleCheckEvent = this.handleCheckEvent.bind(this);
  }
  componentDidMount() {
    roomsService.getAmenities(this.props.match.params.room_id).then(res => {
      if (res) {
        this.setState({
    			amenities_type: res.amenities_type,
    			amenities: res.amenities,
    			prev_amenities: res.prev_amenities
    		});
      } else {
        alertService.showError('Get Amenities');
      }
    });
  }
  handleCheckEvent(e) {
    let value = e.target.value;
    let prev_amenities = this.state.prev_amenities;
    let checked = e.target.checked;
    if (checked) {
      prev_amenities.push(value.toString())
    } else {
      let amenity_index = prev_amenities.indexOf(value.toString());
      if (amenity_index > -1) {
        prev_amenities.splice(amenity_index, 1);
      }
    }
    this.setState({
      prev_amenities: prev_amenities
    })

    let req = {
      data: this.state.prev_amenities.toString()
    }
    roomsService.updateAmenities(this.props.match.params.room_id, req).then(res => {
      if (res) {
      } else {
        alertService.showError('Update Amenities');
      }
    });
  }
  render() {
    const room_id = this.props.match.params.room_id;
    return (
      <div className="manage-listing-content-wrapper">
        <div className="listing_whole col-md-9" id="js-manage-listing-content">
          <div className="common_listpage">
            <ManageRoomHeader 
              title="Tell Travelers About Your Space" 
              descr="Every space on Vacation.Rentals----- is unique. Highlight what makes your listing welcoming so that it stands out to guests who want to stay in your area." 
              prev="location" 
              next="photos" 
              room_id={room_id}/>

            <AmenitiestList 
              onChange={this.handleCheckEvent} 
              amenities_type={this.state.amenities_type}
              amenities={this.state.amenities}
              prev_amenities={this.state.prev_amenities}
            /> 

            <ManageRoomFooter
              prev="location" 
              next="photos" 
              room_id={room_id}/>

            <hr />
          </div>
        </div>

        <div className="col-md-3 col-sm-12 listing_desc location_desc">
          <div className="manage_listing_left">
            <img src={property_help} className="col-center" width={75} height={75} alt="manage listing" />
            <div className="amenities_about">
              <h4> Amenities </h4> <p> Choose amenities features inside your listing: </p> <p > < span > Common Amenities </span></p >
              <p> <span> Additional Amenities </span></p >
              <p> <span> Special Features </span>Features of your listing for guests with specific needs.</p >
              <p> <span> Home Safety </span>Smoke and carbon monoxide detectors are strongly encouraged for all listings.</p >
              <p> <span> Kitchen </span>List items that are supplied standard in your kitchen for the guests</p >
              <p> <span> Indoor / Outdoor activities nearby </span>Describe activities close by your rental property</p >
              <p> <span> Leisure </span>What makes your property ideal for leisure pastimes?</p >
              <p> <span> Swimming Pools </span>Select all the pools that are available to your guests</p >
              <p> <span> Ideal For </span>What is your property best suited for</p >
              <p> <span> Household </span>Select all of the household items that are available to your guests</p >
              <p> <span> IT & amp; Communication </span>Tell your guests how they can stay connected to your property</p >
              <p> <span> Activities Nearby </span>Every place has unique places nearby. Tell your guests what your property offers</p >
              <p> <span> Transportation </span>Let your guests know beforehand what types of transportation there is or they will need</p >
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomAmenities;
