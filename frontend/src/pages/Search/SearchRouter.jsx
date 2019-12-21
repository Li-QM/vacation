import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Search from 'components/search/Search';

class SearchRouter extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      console.log('Route change!');
    }
  }
  render() {
    return (
      <div className="search__body">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/search" component={Search} />
          </Switch>
        </Suspense>
      </div>
    );
  }
}

export default SearchRouter;