import React from 'react';

import Videoform from '../../components/rooms/video/videoform/Videoform';
import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import ManageRoomFooter from "components/rooms/ManageRoomFooter";

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/video.scss';

class RoomVideo extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  componentDidMount () {
  }
  render() {
    const room_id = this.props.match.params.room_id;
    return (
      <div className="manage-listing-content-wrapper">
        <div className="listing_whole col-md-9" id="js-manage-listing-content">
          <div className="common_listpage">
            <ManageRoomHeader 
              title="Video Can Bring Your Space to Life" 
              descr="Add video of areas guests have access to." 
              prev="photos" 
              next="pricing" 
              room_id={room_id}/>

            <Videoform room_id={room_id} />

            <ManageRoomFooter 
              prev="photos" 
              next="pricing" 
              room_id={room_id}/>

            <hr />
          </div>
        </div>

        <div className="col-md-3 col-sm-12 listing_desc location_desc">
          <div className="manage_listing_left">
            <img src={property_help} className="col-center" width={75} height={75} alt="property help"/>
            <div className="amenities_about">
            <h4>Guests Love Video</h4>
              <p>Cell phone videos are just fine.</p>
              <strong>Add a video:</strong><p>Add a video on your listing page. You can enter youtube embed code.</p>
              <strong>NOTE*:<strong> only embed video code. ex: (https://youtu.be/IZXU_9pRabI)</strong></strong>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomVideo;
