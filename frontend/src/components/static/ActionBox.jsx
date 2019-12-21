import React from 'react';

import { getCookie } from 'services/config';

export class ActionBox extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      isLogedIn: true,
    }
  }
  render() {
    if(this.props.mode === 5) {
      return (
        <div className="hover-box-2">
          {/* Link box with background image */}
          <div style={{ backgroundImage: 'url(https://res.cloudinary.com/vacation-rentals/image/upload/v1561720994/images/vacation-home-1.png)', backgroundColor: '#34495e', backgroundSize: 'cover' }} className="hover-box hover-box-3" title="Vacation.Rentals">

            {/* Image/Icon */}
            {/* <img src="https://res.cloudinary.com/vacation-rentals/image/upload/v1561720994/images/vacation-home-1.png" className="hb-img " alt title="Vacation.Rentals" /> */}

            {/*/ Image/Icon */}
            {/* Title element with custom top padding */}
            <div className="kl-title-block clearfix text-center tbk-symbol-- tbk-icon-pos--after-title ptop-50 mt-4">
              {/* Title with custom kl-font-alt font, size and bold style */}
              <h3 className="tbk__title kl-font-alt fs-xl fw-bold"> READY TO GET STARTED? </h3>
              <h4 className="tbk__subtitle fs-normal light-gray3 fw-thin"> Your next vacation destination is only a click away... </h4>
            </div>

            <div className="text-center">
              {
                this.state.isLogedIn === true ? (
                  getCookie('user_type') === 'host' ?
                    <span target="_self" className="btn-element btn btn-lined lined-custom text-white border-white" title="List Your Home Now"> <span>LIST YOUR HOME NOW</span> </span>
                    : <span target="_self" className="btn-element btn btn-lined lined-custom text-white border-white" title="Search Now"> <span>SEARCH NOW</span> </span>
                  )
                  : <span target="_self" className="btn-element btn btn-lined lined-custom text-white border-white" title="Register Now"> <span>REGISTER NOW</span> </span>
              }
            </div>
          </div>
        </div>
      )
    }
    if(this.props.mode === 4) {
      return (
        <section className={"hg_section bg-white " + this.props.section_class ? this.props.section_class : ''}>
          <div className="container">
            <div className="row d-flex">
              <div className="col-sm-12 col-md-9 col-lg-9">
                {/* Title element */}
                <div className="kl-title-block">
                  {/* Title with alternative font, custom size, theme color and bold style */}
                  <h3 className="tbk__title kl-font-alt fs-l fw-bold tcolor"> {this.props.section_title ? this.props.section_title : ''} </h3>
                  {/* Sub-title with custom size and thin style */}
                  <h4 className="tbk__subtitle fs-s fw-thin"> {this.props.section_desc ? this.props.section_desc : ''} </h4>
                </div>
                {/*/ Title element */}
              </div>
              {/*/ col-sm-12 col-md-9 col-lg-9 mb-sm-35 */}
              <div className="col-sm-12 col-md-3 co-lg-3 d-flex flex-column align-self-center justify-content-center">
                {/* Button full color style */}
                <a href={this.props.btn_url_1 ? this.props.btn_url_1 : '#'} className="btn-element btn btn-fullcolor btn-md w-100" style={{margin: '0 10px 10px 0'}} title={this.props.btn_title_1 ? this.props.btn_title_1 : ''}>
                  {this.props.btn_title_1 ? this.props.btn_title_1 : ''}
                </a>
              </div>
              {/*/ col-sm-12 col-md-3 co-lg-3 d-flex align-self-center justify-content-center */}
            </div>
            {/*/ row */}
          </div>
          {/*/ container */}
        </section>
      )
    }
  }
}

// export default ActionBox;