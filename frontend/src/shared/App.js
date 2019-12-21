import React, { Suspense } from 'react';
import {Route} from 'react-router-dom';
import { withRouter } from "react-router-dom";

import { Home, Rooms, Help, Dashboard } from 'pages';
import {FrontendLayout}  from 'layouts';
import { StaticPageRouter } from 'pages';
import { PricingPageRouter } from 'pages';
import { ContactUs } from 'pages';
import { HomesRouter } from 'pages';
import { SearchRouter } from 'pages';
import { Inbox } from 'pages';
import { VerifyUser } from 'pages';

import 'assets/styles/app.scss';

/*
* Main Router Page
* Add all pages here by route.
*/
class App extends React.Component {
  componentDidUpdate(prevProps) {
  }
  render() {
    return (
      <div className="App">
        <FrontendLayout>
          <Suspense fallback={<div>Loading...</div>}>

            {/* Dashboard routes */}
            <Route exact path="/" component={Home} />
            <Route path="/help" component={Help} />
            <Route path="/dashboard" component={Dashboard} />

            {/* Footer: Company routes */}
            <Route path="/company/:slug" component={StaticPageRouter} />
            <Route path="/pricing" component={PricingPageRouter} />

            {/* Footer: Site Info routes */}
            <Route path="/site-info/why-host" component={StaticPageRouter} />
            <Route path="/contactus" component={ContactUs} />

            {/* Footer: Destinations routes */}
            <Route path="/destinations/:id" component={StaticPageRouter} />

            {/* Footer: Join Us On */}
            <Route path="/legal/terms-of-service" component={StaticPageRouter} />
            <Route path="/legal/privacy-policy" component={StaticPageRouter} />
            <Route path="/legal/copyright-policy" component={StaticPageRouter} />

            {/* Rooms routes */}
            <Route path="/rooms" component={Rooms} />

            {/* Homes routes */}
            <Route path="/homes/:address_url/:room_id" component={HomesRouter} />

            {/* Search routes */}
            <Route path="/search" component={SearchRouter} />

            {/* Inbox routes */}
            <Route path="/inbox" component={Inbox} />

            {/* Verify route */}
            <Route path="/verify-user/:id" component={VerifyUser} />

          </Suspense>
        </FrontendLayout>
      </div>
    );
  }
}

export default withRouter(props => <App {...props} />);