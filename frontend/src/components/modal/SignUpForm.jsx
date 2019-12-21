import React from 'react';

import { SignUpWithEmail } from './SignUpWithEmail';
import { SignUpSocialModal } from './SignUpSocialModal';

import 'assets/styles/sign/signup.scss';

export class SignUpForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_email_form : false,
      is_signup_success : false
    }
    this.changeFormHandler = this.changeFormHandler.bind(this);
    this.onSignupSuccess = this.onSignupSuccess.bind(this);
  }

  changeFormHandler() {
    this.setState({
      is_email_form : !this.state.is_email_form
    })
  }
  onSignupSuccess() {
    this.setState({
      is_signup_success : true
    })
  }
  render() {
    if(this.props.visible === true) {
      if(this.state.is_email_form === true) {
        return (
          <SignUpWithEmail onChangeForm={this.changeFormHandler} onSuccess={this.props.onSignupSuccess} aria-labelledby="contained-modal-title-vcenter"
          centered/>
        );
      }
      else{
        return(
          <SignUpSocialModal onChangeForm={this.changeFormHandler} aria-labelledby="contained-modal-title-vcenter"
          centered/>
        );
      }
    }
    else {
      return (
        <div></div>
      )
    }
  }
}
