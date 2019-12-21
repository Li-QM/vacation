import React from 'react';

import { authService } from 'services/auth';
import { alertService } from 'services/alert';

import 'assets/styles/sign/signup.scss';

export class SignUpWithEmail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      first_name : '',
      last_name : '',
      phone_number : '',
      email : '',
      password : '',
      password_confirmation : '',
      birthday_month : '',
      birthday_day : '',
      birthday_year : '',
      user_type : 'guest',
      agree_tac : '',
      is_signup_success : false
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }
  handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox'  ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }
  onSignupSubmit(e) {
    e.preventDefault();
    console.log('user sign up =>', this.state);
    let dt = new Date();
    if(dt.getFullYear() - this.state.birthday_year > 18) {
      if(this.state.agree_tac === true) {
        authService.signUp(this.state).then(res => {
          if (res) {
            if (res.success === true) {
              this.props.onSuccess();
            }
            else {
              Object.keys(res).forEach(key => {
                alertService.showError(key, res[key]);
              });
            }
          } else {
            alertService.showError("Signup Failed", "");
          }
        });
      }
      else {
        alertService.showError("Please Agree Terms Of Services!", "");
      }
    } else {
      alertService.showError("You cannot use our site because your age is less than 18.", "");
    }
  }

  render() {
    return(
      <div className="signup-modal">
				<div className="modal-header"> <h5 className="modal-title"> Sign Up </h5> </div>
          <div className="panel top-home bor-none">
            <div className=" panel-body bor-none clearfix">
              <i className="icon-remove-1 rm_lg" onClick={this.props.onChangeForm}/>
              <form method="POST"  onSubmit={this.onSignupSubmit} acceptCharset="UTF-8"
                  className="signup-form vr_form ng-pristine ng-valid" data-action="Signup"
                  id="signup_email_form" noValidate="novalidate">
                <input name="_token" type="hidden" defaultValue="nL35ucJMZqYrYVBLbFxgOOOkYiNzYYP8nPmj7RGQ" className="tooltipstered" />
                <div className="signup-form-fields">
                  <input id="signup_from_modal" name="from" type="hidden" defaultValue="email_signup" className="tooltipstered" />
                  <input id="access_code_modal" name="access_code" type="hidden" className="tooltipstered" />
                  <input id="ip_address_modal" name="ip_address" type="hidden" defaultValue="188.43.224.141" className="tooltipstered" />
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputFirst">
                        <div className="pos_rel">
                          <i className="icon-users" />
                          <input required className="decorative-input name-icon input_new tooltipstered"
                            placeholder="First name" name="first_name" type="text" onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputLast">
                        <div className="pos_rel">
                          <i className="icon-users" />
                          <input required className="decorative-input inspectletIgnore name-icon input_new tooltipstered"
                              placeholder="Last name" name="last_name" type="text" onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputPhone">
                        <div className="pos_rel">
                          <i className="icon-phone" />
                          <input required className="decorative-input inspectletIgnore name-phone name-icon input_new tooltipstered"
                            placeholder="Phone Number"  name="phone_number" type="tel" onChange={this.handleChange}
                          />
                          <span id="valid-msg" className="hide pull-right mb-3 valid-msg_modal">✓ Valid</span>
                          <span id="error-msg" className="hide pull-right mb-3 error-msg_modal">Invalid number</span>
                          <input id="phone_code_modal" name="phone_code" type="hidden" defaultValue="us" className="tooltipstered" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputEmail">
                        <div className="pos_rel">
                          <i className="icon-envelope" />
                          <input required className="decorative-input inspectletIgnore name-mail name-icon input_new tooltipstered"
                              placeholder="Email address"  name="email" type="email" onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputPassword">
                        <div className="pos_rel">
                          <i className="icon-lock" />
                          <input required className="decorative-input inspectletIgnore name-pwd name-icon input_new tooltipstered"
                            placeholder="Password"  data-hook="user_password" name="password" type="password" onChange={this.handleChange}
                          />
                        </div>
                        <div data-hook="password-strength" className="password-strength hide" />
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="control-group row-space-2 field_ico" id="inputPasswordConfirmation">
                        <div className="pos_rel">
                          <i className="icon-lock" />
                          <input required className="decorative-input inspectletIgnore name-pwd-confirmation name-icon input_new tooltipstered"
                            placeholder="Confirm Password"  data-hook="user_password_confirmation" name="password_confirmation" type="password" onChange={this.handleChange}
                          />
                        </div>
                        <div data-hook="password-strength" className="password-strength hide" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="control-group row-space-top-3 row-space-2 birthday-label-container">
                        <p className="h4 row-space-1 title">Birthday</p>
                        <p className="let_sp desc">You must be 18+ to register.</p>
                      </div>
                      <div className="control-group row-space-1 " id="inputBirthday" >
                      <div className="control-group row-space-2 calander_new tooltipstered">
                        <label className="select month drp_dwn_cng">
                          <i className="icon-chevron-down" />
                          <select className="birthday_group" onChange={this.handleChange} name="birthday_month">
                            <option value={0} key={0}>Month</option>
                            {
                              function() {
                                let month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                let rows = [];
                                month_names.map((name, index) => {
                                  return ( rows.push(<option value={index + 1} key={index + 1}>{name}</option> ) );
                                })
                                return rows;
                              }()
                            }
                          </select>
                        </label>
                        <label className="select day month drp_dwn_cng">
                          <i className="icon-chevron-down" />
                          <select className="birthday_group" onChange={this.handleChange} name="birthday_day">
                            <option value={0} key={0}>Day</option>
                            {
                              function() {
                                let rows = [];
                                for (let index = 1; index <= 31; index++) {
                                  rows.push(<option value={index} key={index}>{index}</option>)
                                }
                                return rows;
                              }()
                            }
                        </select>
                        </label>
                        <label className="select year month drp_dwn_cng">
                          <i className="icon-chevron-down" />
                          <select className="birthday_group" onChange={this.handleChange} name="birthday_year">
                            <option value={0} key={0}>Year</option>
                            {
                              function() {
                                let rows = [];
                                for (let index = (new Date().getFullYear()); index >= 1900; index--) {
                                  rows.push(<option value={index} key={index}>{index}</option>)
                                }
                                return rows;
                              }()
                            }
                          </select>
                        </label>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="control-group row-space-top-3 row-space-2 usertype-label-container">
                        <p className="h4 row-space-1 title">I'm interested in : </p>
                      </div>
                      <div className="control-group row-space-2 field_ico usertype-input-container tooltipstered" id="inputUserType">
                        <div className="row">
                          <div className="col-md-4 col-sm-6 mt-2 mb-2">
                            <input type="radio" name="user_type" id="box-1_modal"   value="host" className="user_type_group" onChange={this.handleChange}  checked={this.state.user_type === "host"}  />
                            <label htmlFor="box-1_modal">Listing a Vacation Rental</label>
                          </div>
                          <div className="col-md-4 col-sm-6 mt-2 mb-2">
                            <input type="radio" name="user_type" id="box-2_modal"   value="guest" className="user_type_group" checked={this.state.user_type === "guest"}  onChange={this.handleChange} />
                            <label htmlFor="box-2_modal">Booking a Vacation Rental</label>
                          </div>
                          <div className="col-md-4 col-sm-6 mt-2 mb-2">
                            <input type="radio" name="user_type" id="box-3_modal"   value="both" className="user_type_group" checked={this.state.user_type === "both"}  onChange={this.handleChange} />
                            <label htmlFor="box-3_modal">Both</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="clearfix" />
                  <div id="tos_outside" className="row-space-top-2 chk-box tos-container">
                    <div className="dis_tb control-group tooltipstered">
                      <div className="dis_cell">
                        <input type="checkbox" name="agree_tac" onChange={this.handleChange} required />
                      </div>
                      <div className="dis_cell">
                        <small>
                          By signing up, I agree to Vacation.Rentals's
                          <a href="/legal/terms-of-service/" data-popup="true"> Terms of Service </a>, <a href="/legal/privacy-policy/" data-popup="true">Privacy Policy</a>.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <input className="btn btn-primary btn-block btn-large pad-top tooltipstered" id="user-signup-btn_modal" type="submit" defaultValue="Sign Up" />
              </form>
          </div>
        </div>
      </div>
	  );
  }
}

// export default SignUpWithEmail;