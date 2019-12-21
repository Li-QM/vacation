import React from 'react';
import { Link } from 'react-router-dom';

import 'assets/styles/sign/signup.scss';

export class SignUpSocialModal extends React.Component {
  render() {
    return (
      <div className="signup-social-modal">
        <div className="modal-header">
          <h5 className="modal-title"> Sign Up </h5>
        </div>
        <div className="panel top-home">
          <div className="panel-padding panel-body pad-25 ">
            <div className="social-buttons">
              <a href='/login/facebook' className="fb-button fb-blue btn icon-btn btn-block row-space-1 btn-large btn-facebook pad-23" data-populate_uri data-redirect_uri="https://www.vacation.rentals/authenticate">
                <span> <i className="icon icon-facebook" /> </span>
                <span> Sign up with Facebook </span>
              </a>
            </div>
            <div className="text-center social-links hide">
              <span> Sign up with </span>
              <span> <a className="facebook-link-in-signup" href='/login/facebook'>Facebook</a> or <a href='/login/google'> Google </a> </span>
            </div>
            <div className="signup-or-separator">
              <span className="h6 signup-or-separator--text">or</span>
              <hr />
            </div>
            <div className="text-center" onClick={this.props.onChangeForm} >
              <Link to="#" className="create-using-email btn-block  row-space-2 btn btn-primary btn-block btn-large large icon-btn pad-23 signup_popup_head2 btn_new1" id="create_using_email_button" onClick={this.changeForm}>
                <span> <i className="icon icon-envelope" /> </span>
                <span> Sign up with Email </span>
              </Link>
            </div>
            <div id="tos_outside" className="row-space-top-3">
              <small className="small-font style1">
                By signing up, I agree to Vacation.Rentals's
                <a className="link_color" href="/legal/terms-of-service/" data-popup="true"> Terms of Service </a>
                ,
                <a className="link_color" href="/legal/privacy-policy/" data-popup="true"> Privacy Policy </a>
                .
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
