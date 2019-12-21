// standard library

import React, { Suspense } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux'
// import store from '../store'
// import Chatbox from '../common/chatbox/Chatbox';

import PricingPage from './PricingPage';

class PricingPageRouter extends React.PureComponent {
  // constructor(props) {
  //   super(props)
  // }

  render () {
    return (
      <Router basename="/" >
        <div className="pricing-page__body">
          <Suspense fallback={<div>Loading...</div>}>
            <Switch >
              <Route path='/pricing' component={PricingPage} />
              <Route path='/pricingplan/:planId' component={PricingPage} />
            </Switch>
          </Suspense>
          {/* <Chatbox /> */}
        </div>
      </Router>
    )
  }
}

export default PricingPageRouter;
