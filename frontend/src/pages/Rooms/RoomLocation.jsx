import React from 'react'
import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import ManageRoomFooter from "components/rooms/ManageRoomFooter";
import RoomLocationAddress from "components/rooms/location/RoomLocationAddress";

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/room_location.scss';

class RoomLocation extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		const room_id = this.props.match.params.room_id;

		return (
			<div className="manage-listing-content-wrapper">
				<div className="listing_whole col-md-9" id="js-manage-listing-content">
					<div className="common_listpage">
						<ManageRoomHeader 
							title="Set Your Listing Location" 
							descr="You’re not only sharing your space, you’re sharing your neighborhood. Travelers will use this information to find a place that’s in the right spot." 
							prev="description" 
							next="amenities" 
							room_id={room_id}/>

						<RoomLocationAddress room_id={room_id} onUpdateSidebar={this.props.onUpdateSidebar}/>
						
						<ManageRoomFooter 
							prev="description" 
							next="amenities" 
							room_id={room_id}/>

					</div>
				</div>

				<div className="col-md-3 col-sm-12 listing_desc location_desc">
					<div className="manage_listing_left">
						<img src={property_help} className="col-center" width={75} height={75} alt="Property" />
						<div className="amenities_about">
							<h4>Location</h4>
							<p>
								Your exact address will only be shared with confirmed guests.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default RoomLocation;
