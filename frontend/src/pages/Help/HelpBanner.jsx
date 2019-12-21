import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Masks } from 'components';
import banner_image from 'assets/images/help-banner.webp';

class HelpBanner extends React.PureComponent {

  render() {
    return (
      <div id="help-banner">
        <div className="hero shift-with-hiw js-hero">
          <div className="hero__background" data-native-currency="ZAR" aria-hidden="true"
            style={{ background: `url(${banner_image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          </div>
          <div className="hero-content page-container page-container-full text-center">
            <div className="hero-content-footer hide-sm d-md-flex justify-content-center">
              <div className="col-sm-8">
                <div id="searchbar">
                  <div className="searchbar rjsearchbar" data-reactid=".1">
                    <form className="simple-search clearfix" method="get" id="help-searchbar-form" name="simple-search">
                      <div className="saved-search-wrapper searchbar-input-wrapper">
                        <label className="input-placeholder-group" style={{'alignItems': 'center'}}>
                          {/* <input className="checkout input-large text-truncate input-contrast" value={this.props.value} placeholder="Please Input Keyword."
                            onChange={this.props.onChange} aria-label="Input Keyword" /> */}
                          <input className="checkout input-large text-truncate input-contrast " value={this.props.value} onChange={this.props.onChange}
                            placeholder="Please Input Keyword." aria-label="Input Keyword" />
                          {this.props.searchResult}
                          <FontAwesomeIcon icon={faSearch} size="lg" />
                          {/* <FontAwesomeIcon icon={['fas', 'search']} /> */}
                          {/* <svg viewBox="0 0 50 50" width="30" height="50" fill="#000000" >
                            <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/>
                          </svg> */}
                        </label>
                      </div>
                      {/* <button id="submit_location" type="submit" className="searchbar__submit btn btn-primary btn-large">Search</button> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Masks mode={4}/>
        </div>
      </div>
    )
  }
}
export default HelpBanner
