import React from 'react';

import { Masks } from 'components';

import 'assets/styles/pages/pricing/pricingbanner.scss';
import banner_image from 'assets/images/help-banner.webp';

class PricingBanner extends React.PureComponent {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    return (
      <div id="price-banner">
        <div className="hero shift-with-hiw js-hero" id="help-banner" >
          <div className="hero__background" data-native-currency="ZAR" aria-hidden="true">
            <ul className="rslides">
              <li>
                <img src={banner_image} width={1519} alt="pricing banner" />
              </li>
            </ul>
          </div>
          <div className="hero__content page-container page-container-full text-center">
            <div className="va-container va-container-v va-container-h">
              <div className="rjbanercont">
                <h3>
                  <span className="left_cls white">Listing Plan Comparison</span>
                </h3>
              </div>
            </div>
          </div>
          <Masks mode={4}/>
        </div>
      </div>
    )
  }
}
export default PricingBanner;