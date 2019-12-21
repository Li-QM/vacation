import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import {newRoomService} from 'services/newroom';
import {alertService} from 'services/alert';
import ScriptCache from 'shared/ScriptCache';
import {GOOGLE_MAP_KEY} from 'services/config';

import "assets/styles/rooms/room_new.scss";

class NewRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      others: [],
      active_home_type: 0,
      active_accommodates: 0,
      selected_city: "",
      is_selected_home_type: false,
      is_selected_accommodates: false,
      is_selected_city: false,
      address: "",
      latLng: "",
      plan_type: [],
      property_type: [],
      room_type: []
    };
    this.handleChangeHometype = this.handleChangeHometype.bind(this);
    this.removeSelecedHomeType = this.removeSelecedHomeType.bind(this);
    this.handleChangeAccommodates = this.handleChangeAccommodates.bind(this);
    this.removeChangeAccommodates = this.removeChangeAccommodates.bind(this);
    this.handleSetCity = this.handleSetCity.bind(this);
    this.removeSelectedCity = this.removeSelectedCity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.requestAnimationFrame( () => {
			new ScriptCache([`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`]).onLoad( ()=> {
				this.setState({
					gmap_api_loaded: true
				});
			});
    });

    newRoomService.getNewRoomData().then(res => {
      if (res) {
        this.setState({
          plan_type: res.plan_type,
          property_type: res.property_type,
          room_type: res.room_type
        });
      } else {
        alertService.showError('Get new room');
      }
    });
  }

  handleChangeHometype(e) {
    this.setState({
      active_home_type: e.target.value,
      is_selected_home_type: true
    });
  }

  handleChangeAccommodates(e) {
    this.setState({
      is_selected_accommodates: true,
      active_accommodates: e.target.value
    });
  }
  removeChangeAccommodates() {
    this.setState({
      is_selected_accommodates: false
    });
  }
  handleSetCity(e) {
    this.setState({
      is_selected_city: true,
      selected_city: e.target.value
    });
  }
  removeSelectedCity() {
    this.setState({
      is_selected_city: false,
      selected_city: "",
      address: ""
    });
  }
  removeSelecedHomeType(e) {
    this.setState({
      is_selected_home_type: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const post_data = {
      active_home_type: this.state.property_type[this.state.active_home_type].id,
      address: this.state.address,
      active_accommodates: this.state.active_accommodates,
      latitude: this.state.latLng.lat,
      longitude: this.state.latLng.lng,
      latlng: this.state.latLng
    };

    newRoomService.createRoom(post_data).then(res => {
      if (res && res.status === "success") {
        alertService.showSuccess("New Room Created Successfully", '');
        this.props.history.push(`/rooms/manage/${res.room_id}/basics`);
      } else {
        if (res.message) {
          alertService.showError(res.message, '');
        } else {
          alertService.showError('Create new room');
        }
      }
    });
  }

  handleChange(address) {
    this.setState({ address });
  }

  handleSelect(address) {
    geocodeByAddress(address)
      .then(res => { console.log('latLng => ', res); if (res) { return getLatLng(res[0]);} })
      .then(latLng => {
        console.log('latLng => ', latLng)
        this.setState({
          address: address,
          latLng: latLng,
          is_selected_city: true,
          selected_city: address
        });
      })
      .catch(error => console.error("Error", error));
  }

  render() {
    let home_type_buttons = [];
    let home_type_options = [];
    let ii = 0;
    this.state.property_type.forEach(home_type => {
      if (ii < 3) {
        home_type_buttons.push(
          <button
            className="btn btn-large type alert-highlighted-element hover-select-highlight"
            type="button"
            key={ii}
            value={ii}
            onClick={this.handleChangeHometype}
          >
            <i className={"icon " + home_type.icon + " h4 icon-kazan mrg_left"}/>
            {home_type.name}
          </button>
        );
        ii++;
      } else {
        home_type_options.push(
          <option data-icon-class="icon-star-alt" key={ii} value={ii}>
            {home_type.name}
          </option>
        );
        ii++;
      }
    });
    /////////////// Apartment, House, Bed & Breakfast, Other setting as hometype //////////////////////////////
    let home_type_section = !this.state.is_selected_home_type ? (
      <div className="btn-group">
        {home_type_buttons}
        <div className="select select-large other-select" id="property-select">
          <select
            className="alert-highlighted-element hover-select-highlight ng-pristine ng-untouched ng-valid"
            id="property_type_dropdown"
            onChange={this.handleChangeHometype}
          >
            <option>Other</option>
            {home_type_options}
          </select>
        </div>
      </div>
    ) : (
      <div className="active-selection " onClick={this.removeSelecedHomeType}>
        <div
          data-type="property_type_id"
          className="selected-item property_type_id"
        >
          <div className="active-panel">
            <div className="active-title active-col">
              <div className="h4 title-value ng-binding">
                <i
                  className={
                    "icon " +
                    this.state.property_type[this.state.active_home_type].icon +
                    " h4 "
                  }
                />
                {this.state.property_type[this.state.active_home_type].name}
              </div>
            </div>
            <div className="active-caret active-col">
              <i className="icon icon-caret-right" />
            </div>
            <div className="active-message active-col">
              {/* {this.state.home_type[this.state.active_home_type].description} */}
              Vacation.Rentals----- guests love the variety of home types
              available.
            </div>
          </div>
        </div>
      </div>
    );

    /////////////////// Person numbers setting as accommodate ///////////////////////////
    let accomodates_select = [];
    for (let i = 0; i < 30; i++) {
      accomodates_select.push(
        <option
          key={i}
          className="accommodates"
          data-accommodates={i + 1}
          value={i + 1}
        >
          {i + 1}
        </option>
      );
    }
    let accommodates_section = !this.state.is_selected_accommodates ? (
      <div
        className="unselected row row-condensed"
        ng-hide="selected_accommodates"
      >
        <div className="col-sm-3">
          <div className="panel accommodates-panel">
            <div className="panel-body panel-light alert-highlighted-element hover-select-highlight">
              <div className="col-sm-12" style={{ padding: "0px !important" }}>
                <div className="select select-large" style={{ width: "100%" }}>
                  <i className="icon icon-group h4 icon-kazan va-middle icons-accommodates" />
                  <select
                    id="accomodates-select"
                    style={{ width: "100% !important" }}
                    className="hover-select-highlight ng-pristine ng-untouched ng-valid"
                    onChange={this.handleChangeAccommodates}
                  >
                    <option>Select</option>
                    {accomodates_select}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="active-selection ng-hide"
        ng-show="selected_accommodates"
        onClick={this.removeChangeAccommodates}
      >
        <div
          data-type="person_capacity"
          className="selected-item person_capacity"
        >
          <div className="active-panel">
            <div className="active-title active-col">
              <div className="h4 title-value ng-binding">
                <i className="icon icon-kazan h4 icon-group" />
                {this.state.active_accommodates}
              </div>
            </div>
            <div className="active-caret active-col">
              <i className="icon icon-caret-right" />
            </div>
            <div className="active-message active-col">
              Whether you're hosting a lone traveler or a large group, it's
              important for your guests to feel comfortable.
            </div>
          </div>
        </div>
      </div>
    );

    /////////////////// Location search as city section //////////////////////////
    let city_section = !this.state.is_selected_city ? (
      <div className="row col-sm-12">
        <div className="panel location lys-location alert-highlighted-element">
          <div className=" location-panel-body ">
            {
              this.state.gmap_api_loaded &&
              <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading
                }) => (
                  <label
                    className="input-placeholder-group w-100"
                    style={{ paddingTop: "0px", paddingBottom: "0px" }}
                  >
                    <input
                      {...getInputProps({
                        placeholder: "Enter a Location",
                        className:
                          "pull-left alert-highlighted-element geocomplete ng-valid ng-dirty ng-touched",
                        name: "locations",
                        type: "text",
                        id: "location",
                        autoComplete: "off"
                      })}
                    />
                    <div
                      className="autocomplete-dropdown-container"
                      style={{
                        position: "absolute",
                        width: "300px",
                        background: "white"
                      }}
                    >
                      {loading && <div>Loading...</div>}
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                              textAlign: "left",
                              paddingTop: "10px",
                              padding: "10px",
                              borderBottom: "solid 1px gray",
                              background: "white"
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              textAlign: "left",
                              paddingTop: "10px",
                              padding: "10px",
                              borderBottom: "solid 1px gray",
                              background: "white"
                            };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style
                            })}
                          >
                            <span>
                              <i className="fa fa-map-marker"></i>&nbsp;&nbsp;
                              {suggestion.formattedSuggestion.mainText},{" "}
                              <small>
                                {suggestion.formattedSuggestion.secondaryText}
                              </small>
                            </span>
                          </div>
                        );
                      })}

                      {suggestions.length ? (
                        <div className="text-right">
                          <img
                            src="https://vignette.wikia.nocookie.net/ichc-channel/images/7/70/Powered_by_google.png/revision/latest/scale-to-width-down/640?cb=20160331203712"
                            width="50%"
                            alt=""
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </label>
                )}
              </PlacesAutocomplete>
            }
          </div>
        </div>
      </div>
    ) : (
      <div
        className="active-selection ng-hide"
        ng-show="city_show"
        onClick={this.removeSelectedCity}
      >
        <div className="selected-item city" data-type="city">
          <div className="active-panel" ng-click="city_rm()">
            <div className="active-title active-col">
              <div className="h4 title-value ng-binding">
                <i className="icon icon-kazan h4 icon-map-marker" />
                {this.state.selected_city}
              </div>
            </div>
            <div className="active-caret active-col">
              <i className="icon icon-caret-right" />
            </div>
            <div className="active-message active-col">
              What a great place to call home
            </div>
          </div>
        </div>
      </div>
    );

    ////////////////////////////// Search button with page migration and modal /////////////////////////////////////////////
    let search_button = "";
    if (
      this.state.is_selected_accommodates &&
      this.state.is_selected_city &&
      this.state.is_selected_home_type
    ) {
      search_button = (
        <div className="row text-left space-top-3">
          <div id="js-submit-button">
            <div className="lys-continue-button-wrapper">
              <input
                className="btn btn-primary btn-large btn-block submit"
                type="submit"
                value="Continue"
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <main className="page-body__room-new" id="site-content" role="main">
        
        <div className="page-container-full">
          <div className="panel lys-panel-header">
            <div className="panel-body panel-light">
              <div className="row">
                <div className="col-sm-10 col-center text-center">
                  <h1 className="h2" style={{ marginBottom: 0 }}>
                    List your Home
                  </h1>
                  <p className="text-lead" style={{ marginBottom: 3 }}>
                    Vacation.Rentals----- lets you make money renting out your
                    place.
                  </p>
                </div>
              </div>
              <div />
            </div>
            <div className="panel-body panel-medium back-change">
              <div className="page-container-responsive">
                <div className="row" style={{justifyItems:'center'}}>
                  <div className="col-lg-7 col-md-11 col-md-push-1 col-lg-push-2 list-space">
                    <div id="alert-row" className="row">
                      <div
                        id="alert-status"
                        className="col-lg-10 col-md-11 lys-alert"
                      />
                    </div>
                    <form
                      method="POST"
                      onSubmit={this.handleSubmit}
                      acceptCharset="UTF-8"
                      className="host-onboarding-form ng-pristine ng-invalid ng-invalid-required"
                      name="lys_new"
                    >
                      <div className="row space-top-4 space-1">
                        <div
                          id="property-type-id-header"
                          className="h5 text-light"
                        >
                          <strong>Home Type</strong>
                        </div>
                      </div>
                      <div className="row fieldset fieldset_property_type_id">
                        {home_type_section}
                      </div>
                      <div className="row space-top-3 space-1">
                        <div
                          id="person-capacity-header"
                          className="h5 text-light"
                        >
                          <strong>Accommodates</strong>
                        </div>
                      </div>
                      <div className="row fieldset fieldset_person_capacity">
                        {accommodates_section}
                      </div>
                      <div className="row space-top-3 space-1">
                        <div id="city-header" className="h5 text-light">
                          <strong> Location </strong>
                        </div>
                      </div>
                      <div className="row fieldset fieldset_city">
                        {city_section}
                      </div>
                      {search_button}
                      <div
                        id="cohosting-signup-widget-banner"
                        className="hide-sm hide-md"
                      />
                    </form>
                  </div>
                </div>
                <div className="space-5 row"> </div>
              </div>
            </div>
            <div className="panel-medium back-change">
              <div className="page-container-responsive col-center">
                <div className="row">
                  <div className="col-md-4 text-center hand-icn space-5">
                    {/* <i className="icon icon-handshake icon-kazan icon-size-3" /> */}
                    <svg className="icon-handshake" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512.003 512.003" style={{enableBackground: "new 0 0 512.003 512.003"}} >
                      <g>
                        <g>
                          <path d="M509.605,171.075l-99.3-99.301c-3.193-3.194-8.37-3.194-11.565,0l-49.65,49.65c-1.533,1.533-2.394,3.613-2.394,5.782
                            c0,2.169,0.861,4.249,2.394,5.782l4.953,4.953l-11.382,11.38c-7.389,7.386-18.854,9.402-28.528,5.011
                            c-9.07-4.117-19.153-6.292-29.161-6.292c-11.883,0-23.496,2.983-33.814,8.633c-4.303-1.06-8.719-1.603-13.179-1.603
                            c-6.45,0-12.785,1.113-18.829,3.31c-9.651,3.506-19.996,1.333-27.003-5.672L171.71,132.27l2.434-2.434
                            c1.533-1.533,2.394-3.613,2.394-5.782c0-2.169-0.861-4.249-2.394-5.782l-49.65-49.65c-3.195-3.194-8.371-3.194-11.565,0
                            L2.395,179.156c-3.193,3.194-3.193,8.371,0,11.564l49.649,49.65c1.534,1.534,3.613,2.395,5.783,2.395s4.248-0.861,5.783-2.395
                            l2.961-2.961l14.414,14.414c3.637,3.637,6.048,8.178,6.971,13.131c4.786,25.683,17.086,49.032,35.57,67.526l2.715,2.715
                            c-5.214,5.491-8.082,12.645-8.082,20.245c0,7.861,3.062,15.252,8.62,20.811c5.738,5.738,13.273,8.606,20.811,8.606
                            c0.491,0,0.98-0.013,1.471-0.038c-0.398,8.019,2.458,16.17,8.568,22.282c5.559,5.559,12.95,8.62,20.811,8.62
                            c0.219,0,0.437-0.011,0.656-0.016c-0.168,7.749,2.691,15.552,8.591,21.453c5.559,5.56,12.95,8.62,20.812,8.62
                            c7.861,0,15.251-3.062,20.811-8.62c0.468-0.468,0.909-0.952,1.34-1.442c2.895,1.009,5.957,1.546,9.052,1.546
                            c7.353,0,14.261-2.865,19.441-8.062c2.757-2.756,4.849-5.998,6.211-9.529l0.837,0.837c5.359,5.359,12.398,8.039,19.437,8.039
                            c7.039,0,14.078-2.68,19.437-8.039c2.848-2.848,4.988-6.211,6.344-9.878c4.797,3.489,10.476,5.236,16.158,5.236
                            c7.039,0,14.082-2.679,19.446-8.036c5.191-5.191,8.05-12.097,8.05-19.445c0-2.22-0.266-4.397-0.773-6.502
                            c5.237-1.064,10.049-3.635,13.91-7.501c5.191-5.191,8.05-12.094,8.05-19.437c0-5.785-1.782-11.292-5.073-15.91l6.56-6.56
                            c18.699-18.708,31.052-42.35,35.725-68.371c0.783-4.357,2.941-8.404,6.243-11.707l24.398-24.398l4.289,4.289
                            c1.597,1.597,3.69,2.395,5.783,2.395c2.092,0,4.186-0.798,5.783-2.395l49.65-49.65c1.533-1.533,2.394-3.613,2.394-5.782
                            S511.138,172.609,509.605,171.075z M57.827,223.025l-38.086-38.086L118.71,85.97l38.087,38.086L57.827,223.025z M156.836,364.689
                            c-5.097,5.096-13.392,5.098-18.493,0c-2.47-2.471-3.83-5.754-3.83-9.247c0-3.492,1.361-6.776,3.831-9.246
                            c2.549-2.549,5.896-3.824,9.245-3.824c3.348,0,6.698,1.275,9.246,3.824C161.933,351.294,161.933,359.59,156.836,364.689z
                            M187.684,395.537c-2.468,2.471-5.751,3.83-9.246,3.83c-3.492,0-6.776-1.361-9.245-3.83c-5.099-5.098-5.099-13.394,0-18.493
                            c2.549-2.549,5.896-3.824,9.246-3.824c3.347,0,6.697,1.275,9.245,3.824C192.784,382.142,192.784,390.439,187.684,395.537z
                            M217.742,425.594c-2.47,2.47-5.753,3.83-9.245,3.83c-3.493,0-6.777-1.361-9.246-3.83c-5.099-5.098-5.099-13.394,0-18.493
                            c2.549-2.549,5.896-3.824,9.246-3.824c3.347,0,6.697,1.275,9.245,3.824C222.841,412.2,222.841,420.496,217.742,425.594z
                            M356.63,362.822c-2.102,2.104-4.897,3.263-7.869,3.263s-5.767-1.159-7.873-3.268l-79.33-79.312
                            c-3.196-3.193-8.372-3.192-11.565,0.002c-3.192,3.193-3.191,8.371,0.002,11.564l85.451,85.442c2.103,2.102,3.26,4.898,3.26,7.872
                            c0,2.98-1.158,5.779-3.257,7.878c-4.347,4.343-11.416,4.344-15.756,0.003l-14.416-14.416c-0.08-0.083-0.158-0.167-0.241-0.249
                            c-0.024-0.024-0.051-0.045-0.076-0.069l-66.267-66.267c-3.195-3.193-8.371-3.193-11.565,0c-3.194,3.193-3.194,8.371,0,11.564
                            l66.48,66.479c2.032,2.083,3.151,4.839,3.151,7.763c0,2.974-1.159,5.77-3.261,7.872c-4.338,4.341-11.401,4.341-15.743,0
                            l-72.085-72.086c-3.195-3.194-8.371-3.194-11.565,0c-3.194,3.193-3.194,8.371,0,11.564l53.434,53.435
                            c0.015,0.015,0.027,0.032,0.043,0.046c2.101,2.097,3.257,4.888,3.257,7.859c0,2.973-1.158,5.769-3.269,7.88
                            c-2.099,2.104-4.893,3.263-7.87,3.263c-0.719,0-1.422-0.074-2.11-0.204c1.323-8.913-1.436-18.32-8.282-25.167
                            c-5.559-5.558-12.95-8.62-20.811-8.62c-0.219,0-0.437,0.011-0.656,0.016c0.168-7.749-2.69-15.552-8.591-21.453
                            c-5.56-5.558-12.95-8.62-20.812-8.62c-0.492,0-0.981,0.012-1.469,0.036c0.393-8.014-2.463-16.158-8.57-22.266
                            c-7.434-7.433-17.884-10.044-27.444-7.847l-5.864-5.864c-16.14-16.147-26.878-36.535-31.057-58.96
                            c-1.531-8.213-5.502-15.717-11.483-21.699l-14.415-14.415l82.01-82.01l20.438,20.438c7.856,7.856,18.552,12.06,29.507,12.06
                            c4.906,0,9.867-0.844,14.646-2.581c2.318-0.843,4.715-1.448,7.144-1.832l-50.632,50.633c-6.195,6.194-9.607,14.43-9.607,23.191
                            c0,8.76,3.412,16.996,9.606,23.19c6.394,6.394,14.79,9.59,23.19,9.589c8.398,0,16.797-3.198,23.192-9.589l25.43-25.43l6.883,6.888
                            c0.002,0.002,0.003,0.003,0.005,0.005l0.286,0.286l0.275,0.275c0.001,0.001,0.003,0.003,0.005,0.004l0.005,0.005
                            c0.079,0.078,0.156,0.152,0.233,0.226l95.881,95.881c2.103,2.102,3.26,4.898,3.26,7.872
                            C359.893,357.921,358.736,360.717,356.63,362.822z M408.137,240.834c-5.674,5.675-9.4,12.723-10.774,20.381
                            c-4.08,22.72-14.867,43.364-31.193,59.698l-6.284,6.285l-51.731-51.731c1.124,0.083,2.253,0.138,3.39,0.138
                            c5.238,0,10.598-0.918,15.934-3.101c4.18-1.71,6.182-6.485,4.472-10.664c-1.71-4.179-6.481-6.182-10.664-4.472
                            c-21.046,8.611-46.278-15.12-49.087-17.855c-0.047-0.046-0.094-0.091-0.142-0.135l-0.29-0.29
                            c-0.001-0.001-0.002-0.001-0.003-0.002l-0.253-0.252c-0.001-0.001-0.003-0.003-0.005-0.004l-6.884-6.889l7.806-7.807
                            c3.195-3.194,3.195-8.371,0.001-11.565c-3.194-3.192-8.371-3.193-11.564,0l-13.57,13.57c-0.005,0.005-0.011,0.01-0.016,0.015
                            c-0.005,0.005-0.01,0.011-0.015,0.016l-31.2,31.2c-6.412,6.411-16.842,6.409-23.252,0c-3.105-3.105-4.815-7.234-4.815-11.626
                            c0-4.392,1.71-8.521,4.816-11.626l53.852-53.854c2.996-2.995,6.326-5.63,9.905-7.837c8.503-5.256,18.324-8.034,28.401-8.034
                            c7.693,0,15.439,1.67,22.403,4.831c15.842,7.188,34.671,3.839,46.851-8.338l11.383-11.381l66.929,66.929L408.137,240.834z
                            M454.172,214.944l-87.736-87.736l38.087-38.086l87.736,87.736L454.172,214.944z"/>
                        </g>
                      </g>
                      <g>
                        <g>
                          <circle cx="462.41" cy="183.11" r="8.177"/>
                        </g>
                      </g>
                      <g>
                        <g>
                          <circle cx="53.567" cy="191.189" r="8.177"/>
                        </g>
                      </g>
                    </svg>
                    <h4>Trust &amp; Experience</h4>
                    <div className="text-lead text-color-light">
                      As property owners ourselves, we at Vacation.Rentals are
                      well versed in the vacation rental industry. You can trust
                      that we will provide you with the marketing tools and
                      resources you need most when listing your properties.
                    </div>
                  </div>
                  <div className="col-md-4 text-center hand-icn space-5">
                    {/* <i className="icon icon-host-guarantee icon-kazan icon-size-3" /> */}
                    <svg viewBox="0 -4 512.00011 512" className="icon-host-guarantee"><path d="m399.953125 235.191406c0-.910156.046875-135.199218.046875-135.199218l-200-99.992188-200 100v132.464844c-.078125 82.953125 41.382812 160.4375 110.441406 206.398437l89.558594 59.679688 68.992188-45.957031c37.289062 47.765624 101.703124 65.066406 157.90625 42.414062 56.207031-22.652344 90.621093-79.78125 84.371093-140.054688-6.253906-60.277343-51.660156-109.125-111.316406-119.761718zm-199.953125 244.152344-80.679688-53.777344c-64.613281-42.996094-103.402343-115.492187-103.320312-193.101562v-122.578125l184-92 184 92v123.464843c-2.65625-.160156-5.289062-.40625-8-.40625s-5.351562.246094-8 .40625c0-.296874 0-113.597656 0-113.597656l-168-83.992187-168 84v112.703125c-.058594 72.253906 36.054688 139.738281 96.199219 179.773437l71.800781 47.839844 52.335938-34.871094c2.238281 4.882813 4.765624 9.628907 7.566406 14.210938zm46.351562-69.367188-46.351562 30.878907-62.917969-41.925781c-3.105469-2.074219-6.113281-4.25-9.082031-6.480469v-71.503907h-16v58.078126c-8.78125-8.140626-16.8125-17.058594-24-26.640626v-46.488281c.003906-11 7.484375-20.589843 18.152344-23.269531l54.253906-13.601562c1.742188 17.347656 14.527344 31.558593 31.59375 35.121093v32.800781h16v-32.800781c17.066406-3.558593 29.847656-17.773437 31.585938-35.121093l35.613281 8.945312c-32.46875 35.707031-43.460938 86.003906-28.847657 132zm-86.351562-241.03125h22.113281c12.347657-.015624 24.542969-2.75 35.71875-8h2.167969l20 26.664063v33.335937l-26.664062 20h-26.671876l-26.664062-20zm-15.335938-16c1.621094-10.03125 8.007813-18.652343 17.136719-23.121093 17.695313-7.875 37.632813-9.128907 56.175781-3.535157l1.839844 2.65625h12.183594c4.417969 0 8 3.582032 8 8v24l-12-16h-13.886719l-1.6875.839844c-9.417969 4.691406-19.792969 7.144532-30.3125 7.160156zm79.335938 100v12c0 13.253907-10.746094 24-24 24s-24-10.746093-24-24v-12l5.335938 4h37.328124zm16-.3125v-11.6875l16-12v-92c0-13.257812-10.746094-24-24-24h-5.320312c-11.574219-7.035156-40.390626-8.457031-60.800782-2.074218-22.886718 5.621094-38.695312 26.519531-37.878906 50.074218v8h16v60l16 12v11.648438l-57.742188 14.519531c-17.796874 4.441407-30.277343 20.441407-30.257812 38.78125v21.601563c-15.765625-29.191406-24.015625-61.851563-24-95.03125v-102.816406l152-76 152 76v102.816406c0 .917968-.054688 1.832031-.0625 2.742187-23.332031 4.171875-45.15625 14.394531-63.296875 29.648438zm136 236.3125c-66.273438 0-120-53.726562-120-120 0-66.277343 53.726562-120 120-120s120 53.722657 120 120c-.074219 66.242188-53.757812 119.921876-120 120zm0 0"/><path d="m416 136.945312h96v16h-96zm0 0"/><path d="m416 168.945312h64v16h-64zm0 0"/><path d="m416 200.945312h32v16h-32zm0 0"/><path d="m346.542969 363.289062-28.277344-28.28125-45.257813 45.25 73.535157 73.535157 124.449219-124.449219-45.257813-45.246094zm0 67.878907-50.910157-50.910157 22.632813-22.625 28.277344 28.277344 79.199219-79.199218 22.632812 22.625zm0 0"/></svg>
                    <h4>Convenience</h4>
                    <div className="text-lead text-color-light">
                      Your time is priceless. Listing with Vacation.Rentals
                      saves your valuable time, allowing you to focus on what’s
                      most important: Making sure your guests have the best
                      experience possible
                    </div>
                  </div>
                  <div className="col-md-4 text-center hand-icn space-5">
                    {/* <i className="icon icon-lock icon-kazan icon-size-3" /> */}
                    <svg className="icon-lock" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: "new 0 0 512 512"}}>
                      <g>
                        <g>
                          <g>
                            <path d="M230.792,354.313l-6.729,60.51c-0.333,3.01,0.635,6.031,2.656,8.292c2.021,2.26,4.917,3.552,7.948,3.552h42.667
                              c3.031,0,5.927-1.292,7.948-3.552c2.021-2.26,2.99-5.281,2.656-8.292l-6.729-60.51c10.927-7.948,17.458-20.521,17.458-34.313
                              c0-23.531-19.135-42.667-42.667-42.667S213.333,296.469,213.333,320C213.333,333.792,219.865,346.365,230.792,354.313z
                              M256,298.667c11.76,0,21.333,9.573,21.333,21.333c0,8.177-4.646,15.5-12.125,19.125c-4.073,1.979-6.458,6.292-5.958,10.781
                              l6.167,55.427h-18.833l6.167-55.427c0.5-4.49-1.885-8.802-5.958-10.781c-7.479-3.625-12.125-10.948-12.125-19.125
                              C234.667,308.24,244.24,298.667,256,298.667z"/>
                            <path d="M437.333,192h-32v-42.667C405.333,66.99,338.344,0,256,0S106.667,66.99,106.667,149.333V192h-32
                              C68.771,192,64,196.771,64,202.667v266.667C64,492.865,83.135,512,106.667,512h298.667C428.865,512,448,492.865,448,469.333
                              V202.667C448,196.771,443.229,192,437.333,192z M128,149.333c0-70.583,57.417-128,128-128s128,57.417,128,128V192h-21.333
                              v-42.667c0-58.813-47.854-106.667-106.667-106.667S149.333,90.521,149.333,149.333V192H128V149.333z M341.333,149.333V192
                              H170.667v-42.667C170.667,102.281,208.948,64,256,64S341.333,102.281,341.333,149.333z M426.667,469.333
                              c0,11.76-9.573,21.333-21.333,21.333H106.667c-11.76,0-21.333-9.573-21.333-21.333v-256h341.333V469.333z"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <h4>Exposure</h4>
                    <div className="text-lead text-color-light">
                      Get the word out and showcase your property to our large
                      community of guests, giving you the exposure you need to
                      fill your vacancies.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default NewRoom
