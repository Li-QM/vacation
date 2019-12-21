import React, { Suspense } from 'react';
import {Route, Switch} from 'react-router-dom';

import Listingdetail from 'components/listingdetail/Listingdetail';

import 'assets/styles/pages/rooms.scss';

class HomesRouter extends React.PureComponent {
  render() {
    return (
		// basename='/homes/'
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<Route path='/homes/:address_url/:room_id' component={Listingdetail}/>
			</Switch>
		</Suspense>
    )
  }
}

export default HomesRouter;