import React, { Suspense, lazy } from 'react';
import {Route, Switch} from 'react-router-dom';
import RoomsSidebar from 'components/rooms/RoomsSidebar';
// import Submenu from 'components/rooms/submenu/Submenu';

export const RoomBasics 			= lazy(() => import('./RoomBasics'));
export const RoomDescription 	= lazy(() => import('./RoomDescription'));
export const RoomPricing 			= lazy(() => import('./RoomPricing'));
export const RoomCalendar 		= lazy(() => import('./RoomCalendar'));
export const RoomLocation 		= lazy(() => import('./RoomLocation'));
export const RoomAmenities 		= lazy(() => import('./RoomAmenities'));
export const RoomPhotos 			= lazy(() => import('./RoomPhotos'));
export const RoomVideo 				= lazy(() => import('./RoomVideo'));
export const RoomPlans 				= lazy(() => import('./RoomPlans'));
export const RoomTerms 				= lazy(() => import('./RoomTerms'));

class ManageRoom extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			name: 'EXQUISITE CONDO ON THE LAKE',
		}

		this.onUpdateSidebar = this.onUpdateSidebar.bind(this);
		this.RoomsSidebar = React.createRef();
	}

	onUpdateSidebar() {
		this.RoomsSidebar.current.onUpdateState();
	}

	render() {
		const base_url = this.props.match.url;
		const room_id = this.props.match.params.room_id;

		return (
			<div className="full-content">

				{/* Breadcrumb */}
				<div className="row m-0 p-0">
					<div className="subnav ml-header-subnav">
						<ul className="subnav-list">
							<li className="subnav-text">
								{this.state.name}
							</li>
						</ul>
					</div>
				</div>
				{/* <Submenu
          base_url={this.props.match.url}
          room_id={this.props.match.params.room_id}
        /> */}

				<div className="row m-0 p-0">
					<div className="col-lg-2 col-md-3 bg-white p-0">
						<RoomsSidebar base_url={base_url} room_id={room_id} ref={this.RoomsSidebar}/>
					</div>

					<div className="col-lg-10 col-md-9 p-0">
						<Suspense fallback={<div>Loading...</div>}>
							<Switch>
								<Route path="/rooms/manage/:room_id/basics" render={(props) => <RoomBasics {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/description" render={(props) => <RoomDescription {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/location" render={(props) => <RoomLocation {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/photos" render={(props) => <RoomPhotos {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/pricing" render={(props) => <RoomPricing {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/terms" render={(props) => <RoomTerms {...props} onUpdateSidebar={this.onUpdateSidebar}/>} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/amenities" component={RoomAmenities} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/calendar" component={RoomCalendar} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/video" component={RoomVideo} base_url={base_url}/>
								<Route path="/rooms/manage/:room_id/plans" component={RoomPlans} base_url={base_url}/>
							</Switch>
						</Suspense>
					</div>
				</div>
			</div>
		)
	}
}

export default ManageRoom;
