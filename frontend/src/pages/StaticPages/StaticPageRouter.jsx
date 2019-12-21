// standard library

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import store from '../store'
// import Chatbox from '../common/chatbox/Chatbox';
import StaticPages from './StaticPage';

/*
* Router for Static Pages
* Add static pages here by route.
*/
class StaticPageRouter extends React.PureComponent {
  // constructor(props) {
  //   super(props)
  // }

  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      console.log('Route change!');
    }
  }

  render () {
    return (
      <Router basename="/" >
        <div className="static-page___body">
          <Suspense fallback={<div>Loading...</div>}>
            <Switch >
              <Route path='/:parent/:slug' component={StaticPages} />
            </Switch>
          </Suspense>
          {/* <Chatbox /> */}
        </div>
      </Router>
    )
  }
}

export default StaticPageRouter;