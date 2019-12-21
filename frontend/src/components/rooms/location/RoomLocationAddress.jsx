import React from "react";
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
import Geocode from "react-geocode";
import GooglemapContainer from "components/rooms/location/GooglemapContainer";
import GoogleMapMarkerImage from "assets/images/home_marker.png";
import {roomsService} from 'services/rooms';
import {GOOGLE_MAP_KEY} from 'services/config';
import { alertService } from 'services/alert';

Geocode.setApiKey(GOOGLE_MAP_KEY);
Geocode.enableDebug();

class RoomLocationAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 0,
      address: {
        address_line_1: "",
        address_line_2: "",
        country: "",
        state: "",
        city: "",
        postal_code: "",
        latitude: "",
        longitude: ""
      },
      visible_modal: false,
      countries: [],
      location_step: 0,
      refs: {
        map: undefined
      }
    };
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.handeChangeAddress = this.handeChangeAddress.bind(this);
    this.onMapMounted = this.onMapMounted.bind(this);
    this.onCenterChanged = this.onCenterChanged.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.LocationVerified = this.LocationVerified.bind(this);
  }
  componentDidMount() {
    roomsService.getLocation(this.props.room_id).then(res => {
      if (res) {
        this.setState({
          location: Number(res.location),
          address: res.address,
          countries: res.countries
        });
      }
    });
  }
  prevStep() {
    const { location_step } = this.state;
    this.setState({location_step: location_step - 1});
  }
  nextStep() {
    let { location_step, address } = this.state;
    if (location_step === 0) {
      if (address.postal_code) {
        // 4sOkeanskiy Prospekt, , Vladivostok, Primorskiy kray, RU, 690091
        let temp_address = `${address.address_line_1}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`;

        Geocode.fromAddress(temp_address).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;

            address.latitude = lat;
            address.longitude = lng;

            this.setState({
              address: address,
              location_step: location_step + 1
            });
          },

          error => {
            console.error('geocode from address error.', error);
          }
        );
      }
      else {
        alertService.showWarning("Please input Postal Code!");
      }
    } else {
      this.setState({location_step: location_step + 1});
    }
  }

  LocationVerified() {
    let { address } = this.state;
    let post_data = {
      country: address.country,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      latitude: address.latitude,
      longitude: address.longitude
    };

    roomsService.saveLocation(this.props.room_id, JSON.stringify(post_data)).then(res => {
      if (res) {
        this.setState({
          address: res,
          visible_modal: false,
          location_step: 0,
          location: 1
        });
        this.props.onUpdateSidebar();

        alertService.showSuccess("Verify Location");
      } else {
        alertService.showError("Verify Location");
      }
    });
  }

  closeEditModal() {
    this.setState({
      visible_modal: false,
        location_step: 0
      }
    );
  }

  openEditModal() {
    this.setState({visible_modal: true});
  }

  handeChangeAddress(e) {
    let name = e.target.name;
    let value = e.target.value;
    let address = this.state.address;
    address[name] = value;
    this.setState({address});
  }

  onMapMounted(ref) {
    let refs = this.state.refs;
    refs.map = ref;
    this.setState({refs});
  }

  onCenterChanged() {
    let refs = this.state.refs;
    let center = refs.map.getCenter();
    let address = this.state.address;
    address.latitude = center.lat();
    address.longitude = center.lng();
    this.setState({address});
  }

  render() {
    let country_lists = this.state.countries.map(country => {
      return (
        <option
          value={country.short_name}
          key={country.short_name}>
          {country.long_name}
        </option>
      );
    });

    let modal_body = "";
    if (this.state.location_step === 0) {
      modal_body = (
        <form
          id="js-address-fields-form"
          name="enter_address"
          className="ng-pristine ng-valid"
        >
          <div className="row-space-1">
            <label htmlFor="country">Country</label>
            <div id="country-select">
              <div className="select select-block">
                <select
                  id="country"
                  name="country_code"
                  onChange={this.handeChangeAddress}
                  value={this.state.address.country}
                >
                  {country_lists}
                </select>
              </div>
            </div>
          </div>
          <div id="localized-fields">
            <div className="row-space-1">
              <label htmlFor="address_line_1">Address Line 1</label>
              <input
                type="text"
                placeholder="House name/number + street/road"
                className="focus"
                id="address_line_1"
                name="address_line_1"
                onChange={this.handeChangeAddress}
                value={this.state.address.address_line_1}
                autoComplete="off"
              />
            </div>
            <div className="row-space-1" style={{ display: "none" }}>
              <label htmlFor="address_line_2">Address Line 2</label>
              <input
                type="text"
                placeholder="Apt., suite, building access code"
                className="focus"
                id="address_line_2"
                onChange={this.handeChangeAddress}
                value={this.state.address.address_line_2}
                name="address_line_2"
              />
            </div>
            <div className="row-space-1">
              <label htmlFor="city">City / Town / District</label>
              <input
                type="text"
                className="focus"
                id="city"
                name="city"
                onChange={this.handeChangeAddress}
                value={this.state.address.city}
              />
            </div>
            <div className="row-space-1">
              <label htmlFor="state">State / Province / County / Region</label>
              <input
                type="text"
                className="focus"
                id="state"
                onChange={this.handeChangeAddress}
                value={this.state.address.state}
                name="state"
              />
            </div>
            <div className="row-space-1">
              <label htmlFor="postal_code">ZIP / Postal Code</label>
              <input
                type="text"
                className="focus"
                id="postal_code"
                onChange={this.handeChangeAddress}
                value={this.state.address.postal_code}
                name="postal_code"
              />
            </div>
          </div>
        </form>
      );
    } else if (this.state.location_step === 1) {
      modal_body = (
        <div style={{ height: "300px", width: "300px" }}>
          {" "}
          <GooglemapContainer
            onCenterChanged={this.onCenterChanged}
            onMapMounted={this.onMapMounted}
            lng={this.state.address.longitude}
            lat={this.state.address.latitude}
            isMarkerShown
            onBoundsChanged={console.log("Hello")}
          />
        </div>
      );
    } else {
      modal_body = (
        <address id="address_view" style={{ width: "300px" }}>
          <h5 className="address-line">{this.state.address.address_line_1}</h5>
          <h5 className="address-line">{this.state.address.city}</h5>
          <h5 className="address-line">{this.state.address.state}</h5>
          <h5 className="address-line">{this.state.address.postal_code}</h5>
          <h5 className="address-line">
            {this.state.address.latitude}, {this.state.address.longitude}
          </h5>
        </address>
      );
    }

    return (
      <div
        id="js-location-container"
        className="js-section list_hover clearfix"
      >
        <div className="location_left pull-left">
          <h4>Address</h4>
          <h6>
            While guests can see approximately where your listing is located in
            search results, your exact address is private and will only be shown
            to guests after they book your listing.
          </h6>
          <div className="location_address">
            {this.state.location === 0 ? (
              <button
                id="js-add-address"
                className="btn custom_btn btn-large"
                onClick={this.openEditModal}
              >
                Add Address
              </button>
            ) : (
              <address id="address_view">
                <h5 className="address-line mt-1">
                  {this.state.address.address_line_1}
                </h5>
                <h5 className="address-line mt-1">{this.state.address.city}</h5>
                <h5 className="address-line mt-1">
                  {this.state.address.state}
                </h5>
                <h5 className="address-line mt-1">
                  {this.state.address.postal_code}
                </h5>
              </address>
            )}

            <Modal
              open={this.state.visible_modal}
              onClose={() => this.closeEditModal()}
              center
              styles={{ modal: { padding: "0px" } }}
            >
              <div className="panel ng-scope">
                <div className="panel-header">
                  <Link
                    data-behavior="modal-close"
                    className="modal-close"
                    to="#"
                  />
                  <div className="h4 js-address-nav-heading">
                    Enter Address
                    <br />
                    <small>What is your listing's address?</small>
                  </div>
                </div>
                <div
                  className="flash-container"
                  id="js-flash-error-clicked-frozen-field"
                />
                <div className="panel-body" style={{ minHeight: "300px" }}>
                  {modal_body}
                </div>
                <div className="panel-footer">
                  <div className="force-oneline">
                    {this.state.location_step === 0 ? (
                      <button
                        data-behavior="modal-close"
                        className="btn js-secondary-btn"
                        onClick={this.closeEditModal}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        data-behavior="modal-close"
                        className="btn js-secondary-btn"
                        onClick={this.prevStep}
                      >
                        Prev
                      </button>
                    )}
                    {this.state.location_step === 2 ? (
                      <button
                        id="js-next-btn"
                        className="btn btn-primary js-next-btn"
                        onClick={this.LocationVerified}
                      >
                        Finish
                      </button>
                    ) : (
                      <button
                        id="js-next-btn"
                        className="btn btn-primary js-next-btn"
                        onClick={this.nextStep}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
            <Link
              to="#"
              onClick={this.openEditModal}
              className={
                this.state.location === 0
                  ? "js-edit-address-link edit-address-link hide"
                  : "js-edit-address-link edit-address-link"
              }
            >
              Edit Address
            </Link>
          </div>
        </div>
        <div className="media-photo space-top-sm-3 address-static-map pull-right">
          <div className="location-map-container-v2 empty-map">
            {this.state.location !== 1 ? (
              <div></div>
            ) : (
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?size=570x275&center=${this.state.address.latitude},${this.state.address.longitude}&zoom=16&maptype=roadmap&sensor=false&key=${GOOGLE_MAP_KEY}`}
                className="w-100 h-100"
                alt="map"
              />
            )}
          </div>
          <img
            src={GoogleMapMarkerImage}
            style={{
              width: "34px",
              position: "absolute",
              left: "50%",
              top: "calc(50% - 17px)",
              transform: "translate(-50%, -50%)"
            }}
            alt="map marker"
          />
        </div>
      </div>
    );
  }
}

export default RoomLocationAddress;