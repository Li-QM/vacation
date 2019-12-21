import React, { Suspense, lazy } from 'react';
import {Route, Switch} from 'react-router-dom';
import 'assets/styles/pages/rooms.scss';

export const NewRoom = lazy(() => import('./NewRoom'));
export const ManageRoom = lazy(() => import('./ManageRoom'));
export const SubscribeRoom = lazy(() => import('./SubscribeRoom'));

class Rooms extends React.PureComponent {
  render() {
    return (
		// basename='/rooms/'
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<Route path="/rooms/new" component={NewRoom} />
				<Route path="/rooms/manage/:room_id" component={ManageRoom} />
				<Route path="/rooms/subscribe/:room_id" component={SubscribeRoom} />
			</Switch>
		</Suspense>
    )
  }
}

export default Rooms;