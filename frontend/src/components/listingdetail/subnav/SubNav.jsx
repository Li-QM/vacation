import React from 'react';

import 'assets/styles/pages/homes/subnav.scss';

class SubNav extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return(
      <div className="subnav-container hide-sm">
        <div data-sticky="true" data-transition-at="#summary" aria-hidden="true" className="subnav section-titles">
          <div className="page-container-responsive p-0">
            <ul className="subnav-list" role="tablist">
              <li role="presentation">
                <a href="#jssor_1" aria-selected="true" role="tab" className="subnav-item">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      Photos
                    </font>
                  </font>
                </a>
              </li>
              <li role="presentation">
                <a href="#summary" className="subnav-item" data-extra="#summary-extend" aria-selected="false" role="tab">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      About this listing
                    </font>
                  </font>
                </a>
              </li>
              <li role="presentation">
                <a href="#reviews" className="subnav-item" aria-selected="false" role="tab">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      Reviews
                    </font>
                  </font>
                </a>
              </li>
              <li role="presentation">
                <a href="#summary" className="subnav-item" aria-selected="false" role="tab">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      Host
                    </font>
                  </font>
                </a>
              </li>
              <li role="presentation">
                <a href="#neighborhood" className="subnav-item" aria-selected="false" role="tab">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      Location
                    </font>
                  </font>
                </a>
              </li>
              <li role="presentation">
                <a href="#similar-listing" className="subnav-item" aria-selected="false" role="tab">
                  <font style={{verticalAlign: 'inherit'}}>
                    <font style={{verticalAlign: 'inherit'}}>
                      Similar listings
                    </font>
                  </font>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SubNav;