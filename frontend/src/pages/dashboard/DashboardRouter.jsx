import React, { lazy, Suspense } from "react";
import { Route } from 'react-router-dom';

const DashboardContent = lazy(() => import('./DashboardContent'));
const RoomListing = lazy(() => import('./RoomListing'));
const Reservation = lazy(() => import('./Reservation'));
const YourTrip = lazy(() => import('./YourTrip'));
const PrevTrip = lazy(() => import('./PrevTrip'));
const Account = lazy(() => import('./Account'));
const EditProfile = lazy(() => import('./Profile/EditProfile'));
const Photos = lazy(() => import('./Profile/Photo'));
const Verification = lazy(() => import('./Profile/Verification'));
const BAManageRoomId = lazy(() => import('./BookingAutomation/BAManageRoomId'));
const BAAccount = lazy(() => import('./BookingAutomation/BAAccount'));
const BAUpdate = lazy(() => import('./BookingAutomation/BAUpdate'));
const ApiKey = lazy(() => import('./ApiKey'));

function DashboardRouter({ match }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Dashboard Content */}
      <Route exact path={match.path} component={DashboardContent} />
      <Route path={`${match.path}/room-listing`} component={RoomListing} />
      <Route path={`${match.path}/reservation`} component={Reservation} />

      {/* Dashboard Trips */}
      <Route path={`${match.path}/mytrips`} component={YourTrip} />
      <Route path={`${match.path}/oldtrips`} component={PrevTrip} />

      {/* Dashboard Profile */}
      <Route path={`${match.path}/myprofile`} component={EditProfile} />
      <Route path={`${match.path}/photo`} component={Photos} />
      <Route path={`${match.path}/edit_verification`} component={Verification} />

      {/* Dashboard Account */}
      <Route path={`${match.path}/myaccount`} component={Account}/>
      
      {/* Dashboard Booking Automation */}
      <Route path={`${match.path}/account_ba`} component={BAAccount}/>
      <Route path={`${match.path}/ba_update`} component={BAUpdate}/>
      <Route path={`${match.path}/ba_manage_roomid`} component={BAManageRoomId}/>
      
      {/* Dashboard API Key */}
      <Route path={`${match.path}/api_key`} component={ApiKey}/>

    </Suspense>
  );
}

export default DashboardRouter;