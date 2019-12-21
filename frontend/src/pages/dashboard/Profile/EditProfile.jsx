import React from "react";
import PhoneInput from "react-phone-input-2";

import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';
import "assets/styles/pages/dashboard/edit-profile.scss";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language_modal_open: false,
      userinfo: {
        first_name: "",
        last_name: ""
      },
      page_data: {},
      timezones: [],
      languages: [],
      phone_number_array: []
    };
    this.openLanguageModal = this.openLanguageModal.bind(this);
    this.closeLanguageModal = this.closeLanguageModal.bind(this);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleUserinfoChange = this.handleUserinfoChange.bind(this);
    this.handelChangeBirthDay = this.handelChangeBirthDay.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleAddNewPhone = this.handleAddNewPhone.bind(this);
    this.handleRemovePhoneNumber = this.handleRemovePhoneNumber.bind(this);
  }
  componentDidMount() {
    dashboardService.getContent().then(res => {
      if (res) {
        this.setState({
          userinfo: res.user_info,
          page_data: res.data,
          timezones: res.timezones,
          languages: res.languages
        });
      } else {
        alertService.showError('Get my profile');
      }
    });
  }
  handleAddNewPhone() {
    let user_info = this.state.userinfo;
    let phone_number_array = user_info.phone_number;
    let new_phone_number = {
      id: null,
      phone_number: "+1",
      country_name: "us",
      default_phone_code: "1",
      status: null
    };
    phone_number_array.push(new_phone_number);
    this.setState({
      user_info: user_info
    });
  }
  handleRemovePhoneNumber(e, index) {
    e.preventDefault();
    let user_info = this.state.userinfo;
    let phone_number_array = user_info.phone_number;

    if (phone_number_array[index].id) {
      let req = { phone_number_id: phone_number_array[index].id };
      dashboardService.removeUserPhoneNubmer(req).then(res => {
        if (res && res.status === 'success') {
          phone_number_array.splice(index, 1);
          this.setState({
            userinfo: user_info
          })
          alertService.showSuccess(res.message, '');
        } else {
          alertService.showError('Remove phone number');
        }
      })
    } else {
      phone_number_array.splice(index, 1);
      this.setState({
        user_info: user_info
      });
    }
  }
  handlePhoneNumberChange(phone_number, country, data, index) {
    let user_info = this.state.userinfo;
    let phone_number_array = user_info.phone_number;
    if (index === -1) {
      let new_phone_number = {
        id: null,
        phone_number: phone_number,
        country_name: country.countryCode,
        default_phone_code: country.dialCode,
        status: null
      };
      phone_number_array.push(new_phone_number);
    } else {
      phone_number_array[index].phone_number = phone_number;
      phone_number_array[index].country_name = country.countryCode;
      phone_number_array[index].default_phone_code = country.dialCode;
    }
    this.setState({
      user_info: user_info
    });
  }

  openLanguageModal(e) {
    e.preventDefault();
    this.setState({
      language_modal_open: true
    });
  }
  closeLanguageModal(e) {
    e.preventDefault();
    this.setState({
      language_modal_open: false
    });
  }
  handleLanguage(language_id, e) {
    let userinfo = this.state.userinfo;
    let languages = userinfo.languages;
    let index = languages.indexOf(language_id);
    if (index === -1) {
      languages.push(language_id);
    } else {
      languages.splice(index, 1);
    }
    userinfo.languages = languages;
    this.setState({
      userinfo: userinfo
    });
  }
  handleUserinfoChange(e) {
    e.preventDefault();
    let { userinfo } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    userinfo[name] = value;
    this.setState({
      userinfo: userinfo
    });
  }
  handelChangeBirthDay(e) {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    let userinfo = this.state.userinfo;
    let dob = this.state.userinfo.dob;
    let year = dob.split("-")[0];
    let month = dob.split("-")[1];
    let day = dob.split("-")[2];
    let newDob = dob;
    if (name === "year") {
      newDob = value + "-" + month + "-" + day;
    }
    if (name === "month") {
      newDob = year + "-" + value + "-" + day;
    }
    if (name === "day") {
      newDob = year + "-" + month + "-" + value;
    }
    userinfo.dob = newDob;
    this.setState({
      userinfo: userinfo
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    let { userinfo } = this.state;
    dashboardService.saveUserProfile(userinfo).then(res => {
      if (res && res.status === 'success') {
        this.setState({
          userinfo: res.userinfo
        });
        alertService.showSuccess(res.message, '');
      } else {
        alertService.showError('Save user profile');
      }
    })
  }

  render() {
    let { userinfo } = this.state;
    let phone_number_section = [];

    if (userinfo.phone_number) {
      userinfo.phone_number.forEach((phone_number, index) => {
        phone_number_section.push(
          <div className="col-sm-9 ml-auto phone-item" key={index}>
            <PhoneInput
              type="text"
              placeholder="Enter phone number"
              value={phone_number.phone_number ? phone_number.phone_number : ""}
              disabled={phone_number.status === "Confirmed"}
              onChange={(phone, country, data) =>
                this.handlePhoneNumberChange(phone, country, data, index)
              }
              labels="Phone Number"
            />
            <div className="phone-state m-0 p-0 d-inline-flex">
              <span
                className={
                  phone_number.status === "Confirmed"
                    ? "label mr-1 label-success"
                    : "label mr-1 label-warning"
                }
              >
                Status : {phone_number.status ? phone_number.status : "UnSaved"}
              </span>
              |
              <span
                className="ml-1 label label-danger"
                onClick={event => this.handleRemovePhoneNumber(event, index)}
              >
                Delete
              </span>
            </div>
          </div>
        );
      });
      phone_number_section.push(
        <div className="col-sm-9 ml-auto" key={"new"}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleAddNewPhone}
          >
            Add New Phone Number
          </button>
        </div>
      );
    }

    return (
      <div className="boby__edit-profile col-md-12 m-0 p-0">
        <div className="aside-main-content">
          <form
            method="POST"
            acceptCharset="UTF-8"
            name="update_form"
            id="update_form"
            onSubmit={this.handleSubmit}
          >
            <div className="panel row-space-4">
              <div className="side-cnt">
                <div className="head-label">
                  <h4>Required</h4>
                </div>
              </div>
              <div className="aside-main-cn">
                <div className="edit-profile_">
                  <div className="form-wrapper">
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_first_name"
                      >
                        First Name
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_first_name"
                          size={30}
                          className="focus"
                          name="first_name"
                          type="text"
                          value={userinfo.first_name ? userinfo.first_name : ""}
                          onChange={this.handleUserinfoChange}
                        />
                        <span className="text-danger" />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_last_name"
                      >
                        Last Name
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_last_name"
                          size={30}
                          className="focus"
                          name="last_name"
                          type="text"
                          value={userinfo.last_name ? userinfo.last_name : ""}
                          onChange={this.handleUserinfoChange}
                        />
                        <span className="text-danger" />
                        <div className="text-muted row-space-top-1">
                          You information will be shared with other confirmed
                          Vacation.Rentals user.
                        </div>
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_gender"
                      >
                        I am{" "}
                        <i
                          className="icon icon-lock icon-ebisu"
                          data-behavior="tooltip"
                          aria-label="Private"
                        />
                      </label>
                      <div className="col-sm-9 d-flex">
                        <div className="select">
                          <select
                            id="user_gender"
                            className="focus"
                            name="gender"
                            value={userinfo.gender ? userinfo.gender : "Male"}
                            onChange={this.handleUserinfoChange}
                            aria-label="User Info"
                          >
                            <option>Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <span className="text-danger" />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_birthdate"
                      >
                        Birth Date
                        <i
                          className="icon icon-lock icon-ebisu"
                          data-behavior="tooltip"
                          aria-label="Private"
                        />
                      </label>
                      <div className="col-sm-9 birthday-item">
                        <div className="select">
                          <select
                            id="user_birthday_month"
                            className="focus"
                            name="month"
                            onChange={this.handelChangeBirthDay}
                            value={
                              userinfo.dob
                                ? parseInt(userinfo.dob.split("-")[1])
                                : 0
                            }
                            aria-label="User Info"
                          >
                            {(function() {
                              let month_names = [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                              ];
                              let rows = [
                                <option value={0} key={0}>
                                  Month
                                </option>
                              ];
                              month_names.map((name, index) => {
                                return rows.push(
                                  <option value={index + 1} key={index + 1}>
                                    {name}
                                  </option>
                                );
                              });
                              return rows;
                            })()}
                          </select>
                        </div>
                        <div className="select">
                          <select
                            id="user_birthday_day"
                            className="focus"
                            name="day"
                            onChange={this.handelChangeBirthDay}
                            value={
                              userinfo.dob
                                ? parseInt(userinfo.dob.split("-")[2]) + 0
                                : 0
                            }
                            aria-label="User Info"
                          >
                            {(function() {
                              let rows = [
                                <option value={0} key={0}>
                                  Day
                                </option>
                              ];
                              for (let index = 1; index <= 31; index++) {
                                rows.push(
                                  <option value={index} key={index + 1}>
                                    {index}
                                  </option>
                                );
                              }
                              return rows;
                            })()}
                          </select>
                        </div>
                        <div className="select">
                          <select
                            id="user_birthday_year"
                            className="focus"
                            name="year"
                            onChange={this.handelChangeBirthDay}
                            value={
                              userinfo.dob ? userinfo.dob.split("-")[0] : 0
                            }
                            aria-label="User Info"
                          >
                            {(function() {
                              let rows = [
                                <option value={0} key={0}>
                                  Year
                                </option>
                              ];
                              for (let index = 2018; index >= 1930; index--) {
                                rows.push(
                                  <option value={index} key={index + 1}>
                                    {index}
                                  </option>
                                );
                              }
                              return rows;
                            })()}
                          </select>
                        </div>
                        <span className="text-danger" />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_email"
                      >
                        Email Address{" "}
                        <i
                          className="icon icon-lock icon-ebisu"
                          data-behavior="tooltip"
                          aria-label="Private"
                        />
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_email"
                          size={30}
                          className="focus"
                          name="email"
                          type="text"
                          value={userinfo.email ? userinfo.email : ""}
                          onChange={this.handleUserinfoChange}
                          aria-label="User Info"
                        />
                        <span className="text-danger" />
                        <div className="text-muted row-space-top-1">
                          This is the email address you will use to correspond
                          with other Vacation.Rentals users.
                        </div>
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label className="text-right col-sm-3 lang-chang-label phone-number-verify-label">
                        Phone Number
                        <i
                          className="icon icon-lock icon-ebisu"
                          data-behavior="tooltip"
                          aria-label="Private"
                        />
                      </label>
                      {phone_number_section}
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_live"
                      >
                        Where You Live
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_live"
                          placeholder="e.g. Paris, FR / Brooklyn, NY / Chicago, IL"
                          size={30}
                          className="focus"
                          name="live"
                          type="text"
                          value={userinfo.live ? userinfo.live : ""}
                          onChange={this.handleUserinfoChange}
                          aria-label="User Info"
                        />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_about"
                      >
                        Describe Yourself
                      </label>
                      <div className="col-sm-9">
                        <textarea
                          id="user_about"
                          cols={40}
                          rows={5}
                          className="focus"
                          name="about"
                          onChange={this.handleUserinfoChange}
                          value={userinfo.about ? userinfo.about : ""}
                          style={{
                            marginTop: "0px",
                            marginBottom: "0px",
                            height: "178px"
                          }}
                        />
                        <div className="text-muted row-space-top-1">
                          Help other people get to know you by being descriptive
                          and detailed in your profile write up.
                          <br />
                          <br />
                          Sometimes, the very thing that secures a booking is
                          the connection made between host and traveler. Let
                          them know your favorite shows or music styles. Try to
                          find common ground and be open and forthcoming to your
                          guests.
                          <br />
                          <br />
                          Both homeowner and traveler can use this opportunity
                          to demonstrate why they are a good match for each
                          other.{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel row-space-4">
              <div className="side-cnt">
                <div className="head-label">
                  <h4>Required</h4>
                </div>
              </div>
              <div className="aside-main-cn">
                <div className="edit-profile_">
                  <div className="form-wrapper">
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_profile_info_website"
                      >
                        Website
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_profile_info_website"
                          size={30}
                          className="focus"
                          name="website"
                          type="url"
                          value={userinfo.website ? userinfo.website : ""}
                          onChange={this.handleUserinfoChange}
                        />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_profile_info_university"
                      >
                        School
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_profile_info_university"
                          size={30}
                          className="focus"
                          name="school"
                          type="text"
                          value={userinfo.school ? userinfo.school : ""}
                          onChange={this.handleUserinfoChange}
                        />
                      </div>
                    </div>
                    <div className="row row-condensed space-4">
                      <label
                        className="text-right col-sm-3 lang-chang-label"
                        htmlFor="user_profile_info_employer"
                      >
                        Work
                      </label>
                      <div className="col-sm-9">
                        <input
                          id="user_profile_info_employer"
                          size={30}
                          className="focus"
                          name="work"
                          type="text"
                          value={userinfo.work ? userinfo.work : ""}
                          onChange={this.handleUserinfoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="lang-btn-cange btn btn-primary btn-large"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
