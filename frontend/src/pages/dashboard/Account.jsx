import React from 'react';

import 'assets/styles/pages/dashboard/account.scss';

class Account extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      old_password: "",
      new_password: "",
      confirm_password: "",
    }

    this.onOldPassword = this.onOldPassword.bind(this);
    this.onNewPassword = this.onNewPassword.bind(this);
    this.onConfirmPassword = this.onConfirmPassword.bind(this);
    this.onUpdatePassword = this.onUpdatePassword.bind(this);
  }

  onOldPassword(e) {
    this.setState({
      old_password: e.target.value
    })
  }
  onNewPassword(e) {
    this.setState({
      new_password: e.target.value
    })
  }
  onConfirmPassword(e) {
    this.setState({
      confirm_password: e.target.value
    })
  }

  onUpdatePassword() {
    
  }

  render() {
    return (
      <div className="aside-main-content">
        <div className="side-cnt">
          <div className="head-label">
            <h4>Change Your Password</h4>
          </div>
          <div className="aside-main-cn">
            <div className="edit-profile_">
              <div className="form-wrapper">
                <form action className="form">
                  <div className="row">
                    <div className="col-lg-7 lang-chang-label">
                      <div className="row row-condensed row-space-2">
                        <div className="col-md-5 text-right lang-chang-label">
                          <label htmlFor="old_password">
                            Old Password
                        </label>
                        </div>
                        <div className="col-md-7">
                          <input className="input-block" id="old_password" name="old_password" type="password" onChange={this.onOldPassword}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-7 lang-chang-label ">
                      <div className="row row-condensed row-space-2">
                        <div className="col-md-5 text-right lang-chang-label">
                          <label htmlFor="user_password">
                            New Password
                        </label>
                        </div>
                        <div className="col-7">
                          <input className="input-block" data-hook="new_password" id="new_password" name="new_password" size={30} type="password" onChange={this.onNewPassword}/>
                        </div>
                      </div>
                      <div className="row row-condensed row-space-2">
                        <div className="col-md-5 text-right lang-chang-label">
                          <label htmlFor="user_password_confirmation">
                            Confirm Password
                        </label>
                        </div>
                        <div className="col-md-7">
                          <input className="input-block" id="user_password_confirmation" name="password_confirmation" size={30} type="password" onChange={this.onConfirmPassword}/>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 password-strength" data-hook="password-strength" />
                  </div>
                  <div className="row">
                    <div className="col-md-12  col-sm-12">
                      <div className="field-wrapper">
                        <button className="btn btn-outline-primary pull-right" onClick={this.onUpdatePassword}>Update Password</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Account;