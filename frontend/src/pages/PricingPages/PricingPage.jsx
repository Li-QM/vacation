import React from 'react';
 
import PricingContainer from './PricingContainer';
import PricingBanner from './PricingBanner';

import 'assets/styles/pages/pricing/common.scss';

class PricingPage extends React.PureComponent {
  // constructor(props){
  //   super(props)
  // }
  render() {
    return (
      <div>
        <PricingBanner/>
        <PricingContainer/>
      </div>
    );
  }
}

export default PricingPage;