import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import CalendarModal from "react-responsive-modal";
import DateRangePicker from "react-daterange-picker";
import RangeCalendar from "rc-calendar/lib/RangeCalendar";
import DatePicker from "rc-calendar/lib/Picker";
import PlacesAutocomplete from "react-places-autocomplete";
import { fitBounds } from "google-map-react/utils";
import InputRange from "react-input-range";
import { ReactSpinner } from "react-spinning-wheel";
import ReactCountryFlag from "react-country-flag";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faListOl } from "@fortawesome/free-solid-svg-icons";

import SearchMap from "./SearchMap";
import ScriptCache from "shared/ScriptCache";
import { GOOGLE_MAP_KEY } from "services/config";
import { searchService } from "services/search";
import { alertService } from "services/alert";

import "react-input-range/lib/css/index.css";
import "react-spinning-wheel/dist/style.css";
import "react-daterange-picker/dist/css/react-calendar.css";
import "moment/locale/zh-cn";
import "moment/locale/en-gb";
import "rc-calendar/assets/index.css";

import "assets/styles/pages/search/search.scss";

import whereIcon from "assets/images/where.svg";
import filterIcon from "assets/images/filter.svg";
import avatarIcon from "assets/images/avatar.svg";
import calendarIcon from "assets/images/calendar.svg";
import houseIcon from "assets/images/house.svg";

const now = moment();
const today = moment();
now.locale("en-gb").utcOffset(0);
const format = "MM-DD-YYYY";
const fullFormat = "MM-DD-YYYY";

class Picker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverValue: [],
      latLng: { lat: 0, lng: 0 }
    };
    this.onHoverChange = this.onHoverChange.bind(this);
  }

  onHoverChange(hoverValue) {
    this.setState({ hoverValue });
  }

  render() {
    const props = this.props;
    const { showValue } = props;
    const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue ? this.state.hoverValue : now}
        onHoverChange={this.onHoverChange}
        type={this.props.type}
        defaultValue={now}
        format={format}
        onChange={props.onChange}
        disabledDate={props.disabledDate}
      />
    );
    return (
      <DatePicker
        open={this.props.open}
        onOpenChange={this.props.onOpenChange}
        calendar={calendar}
        minDate={moment()}
        value={props.value}
      >
        {() => {
          return (
            <input
              className={props.className}
              placeholder={props.placeholder}
              readOnly
              type="text"
              name={props.name}
              value={
                showValue &&
                showValue.format(fullFormat) &&
                showValue.format(fullFormat) !== "Invalid date"
                  ? showValue.format(fullFormat)
                  : ""
              }
            />
          );
        }}
      </DatePicker>
    );
  }
}

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date_range: moment.range(today.clone(), today.clone()),
      // date_range: null,
      startValue: null,
      endValue: null,
      startOpen: false,
      endOpen: false,
      page_data: {},
      is_search_now: false,
      search_result: [],
      page_count: 0,
      current_page: 1,
      last_page: 1,
      total: 1,
      per_page: 1,
      map_view_mode: 0,
      searchOption: "address",
      hover_room: null,
      selected_room: null,
      is_map_move: false,
      is_filter_open: false,
      is_calendar_open: false,
      opened_filter_types: [],
      temp: false,
      search_location: '',
      value4: {
        min: 10,
        max: 5000
      }
    };

    this.onStartOpenChange = this.onStartOpenChange.bind(this);
    this.onEndOpenChange = this.onEndOpenChange.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.disabledStartDate = this.disabledStartDate.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.handleChangeAmenity = this.handleChangeAmenity.bind(this);
    this.handleChangePropertyType = this.handleChangePropertyType.bind(this);
    this.handleChangeGuest = this.handleChangeGuest.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeViewMode = this.handleChangeViewMode.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleResultHover = this.handleResultHover.bind(this);
    this.handleResultLeave = this.handleResultLeave.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleOpenFilter = this.handleOpenFilter.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onSelectDateRange = this.onSelectDateRange.bind(this);
    this.handleOpenMofilterOptions = this.handleOpenMofilterOptions.bind(this);
  }
  componentWillUnmount() {
    // document.getElementById('footer').style.display = 'block'
  }
  componentDidMount() {
    window.requestAnimationFrame(() => {
      new ScriptCache([
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`
      ]).onLoad(() => {
        this.setState({
          gmap_api_loaded: true
        });
      });
    });

    // Set Event listener
    window.addEventListener("resize", this.updateDimensions);

    // Decode the search url
    let decodeUrl = decodeURIComponent(window.location.search)
    let query = decodeUrl.substr(1);
    let params = query.split("&");
    let search_params = {};

    params &&
      params.map(param => {
        let temp_param = param.split("=");
        search_params[temp_param[0]] = temp_param[1];
        return temp_param;
      });

    const init_location = search_params['locations'] ? search_params['locations'].replace(/\+/g, " ") : '';
    const data = {
      amenities: [],
      bathrooms: 0,
      bedrooms: 0,
      beds: 0,
      checkin: search_params["checkin"],
      checkout: search_params["checkout"],
      guest: search_params["guest"],
      instant_book: "0",
      location: init_location,
      map_details: "",
      property_id: "",
      property_type: [],
      room_type: []
    };

    this.setState({
      startValue: moment(search_params['checkin'], fullFormat),
      endValue: moment(search_params['checkout'], fullFormat),
      search_location: init_location
    })

    searchService.searchIndex(data).then(res => {
      if (res) {
        res.checkin = res.checkin ? moment(res.checkin) : null;
        res.checkout = res.checkout ? moment(res.checkout) : null;
        this.setState({
          page_data: res,
          startValue: res.checkin,
          endValue: res.checkout
        });
        this.handleSearch();
      } else {
        alertService.showError('Search');
      }
    });
  }

  handleOpenMofilterOptions(type_name) {
    let opened_filter_types = this.state.opened_filter_types;
    let index_element = opened_filter_types.indexOf(type_name);
    if (index_element === -1) {
      opened_filter_types.push(type_name);
    } else {
      opened_filter_types.splice(index_element, 1);
    }
    this.setState(
      {
        opened_filter_types: opened_filter_types
      },
      () => {
        this.setState({
          temp: !this.state.temp
        });
      }
    );
  }

  onToggle() {
    this.setState({
      is_calendar_open: !this.state.is_calendar_open
    });
  }

  handleOpenFilter() {
    this.setState({
      is_filter_open: !this.state.is_filter_open
    });
  }

  handleResultHover(room_id) {
    this.setState({
      hover_room: room_id
    });
  }

  handleResultLeave(room_id) {
    this.setState({
      hover_room: null
    });
  }

  handleMapChange({ center, zoom, bounds }) {
    if (this.state.is_map_move === true) {
      let location = {
        northEast: { lat: bounds.ne.lat, lng: bounds.ne.lng },
        southWest: { lat: bounds.sw.lat, lng: bounds.sw.lng },
        center: { lat: center.lat, lng: center.lng }
      };
      this.setState(
        {
          location: location,
          searchOption: "mapsearch",
          map_zoom: zoom,
          map_center: center
        },
        () => {
          this.handleSearch();
        }
      );
    } else {
      this.setState({
        is_map_move: true
      });
    }
  }

  handleChangeViewMode(mode) {
    this.setState(
      {
        map_view_mode: mode
      },
      () => {
        this.setState({
          temp: !this.state.temp
        });
      }
    );
  }

  handlePageClick(data) {
    let new_page = data.selected + 1;
    let page_data = this.state.page_data;

    this.setState({ is_search_now: true }, () => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
    });

    const search_data = {
      searchOption: this.state.searchOption,
      amenities: page_data.amenities_selected,
      bathrooms: 0,
      bedrooms: 0,
      beds: 0,
      checkin:
        page_data.checkin &&
        page_data.checkin.format(fullFormat) !== "Invalid date"
          ? page_data.checkin.format(fullFormat)
          : "",
      checkout:
        page_data.checkout &&
        page_data.checkout.format(fullFormat) !== "Invalid date"
          ? page_data.checkout.format(fullFormat)
          : "",
      guest: page_data.guest,
      instant_book: "0",
      location:
        this.state.searchOption === "address"
          ? page_data.meta_title
          : this.state.location,
      map_details: "",
      max_price: page_data.max_price_check,
      min_price: page_data.min_price_check ? page_data.min_price_check : 0,
      property_id: "",
      property_type: page_data.property_type_selected,
      room_type: []
    };

    searchService.searchResult(new_page, search_data).then(res => {
      this.setState({
        search_result: res.data,
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total,
        is_search_now: false,
        is_map_move: this.state.searchOption === "address" ? false : true
      });
    });
  }

  handleSearch() {
    let page_data = this.state.page_data;

    this.setState({
      is_search_now: true
    });

    const data = {
      searchOption: this.state.searchOption,
      amenities: page_data.amenities_selected,
      bathrooms: 0,
      bedrooms: 0,
      beds: 0,
      checkin:
        page_data.checkin &&
        page_data.checkin.format(fullFormat) !== "Invalid date"
          ? page_data.checkin.format(fullFormat)
          : "",
      checkout:
        page_data.checkout &&
        page_data.checkout.format(fullFormat) !== "Invalid date"
          ? page_data.checkout.format(fullFormat)
          : "",
      guest: page_data.guest,
      instant_book: "0",
      location:
        this.state.searchOption === "address"
          ? page_data.meta_title
          : this.state.location,
      map_details: "",
      max_price: page_data.max_price_check,
      min_price: page_data.min_price_check ? page_data.min_price_check : 0,
      property_id: "",
      property_type: page_data.property_type_selected,
      room_type: []
    };

    searchService.searchResult(null, data).then(res => {
      if (res) {
        this.setState({
          search_result: res.data,
          current_page: res.current_page,
          last_page: res.last_page,
          total: res.total,
          is_search_now: false,
          is_map_move: this.state.searchOption === "address" ? false : true
        });
      } else 
      {
        alertService.showError('Search Result');
      }
    });
  }

  handleChangeGuest(e) {
    let page_data = this.state.page_data;
    page_data.guest = e.target.value;
    this.setState({
      page_data: page_data
    });
    this.handleSearch();
  }

  handleChangePropertyType(e) {
    let page_data = this.state.page_data;
    let property_type_selected = page_data.property_type_selected;
    let amenity_index = property_type_selected.indexOf(e.target.value);
    if (amenity_index === -1) {
      property_type_selected.push(e.target.value);
    } else {
      property_type_selected.splice(amenity_index, 1);
    }
    page_data.property_type_selected = property_type_selected;
    this.setState({
      page_data: page_data
    });
    this.handleSearch();
  }

  handleChangeAmenity(e) {
    let page_data = this.state.page_data;
    let amenities_selected = page_data.amenities_selected;
    let amenity_index = amenities_selected.indexOf(e.target.value);
    if (amenity_index === -1) {
      amenities_selected.push(e.target.value);
    } else {
      amenities_selected.splice(amenity_index, 1);
    }
    page_data.amenities_selected = amenities_selected;
    this.setState({
      page_data: page_data
    });
    this.handleSearch();
  }

  onStartOpenChange(startOpen) {
    this.setState({
      startOpen
    });
  }

  onEndOpenChange(endOpen) {
    this.setState({
      endOpen
    });
  }

  onStartChange(value) {
    let page_data = this.state.page_data;
    page_data.checkin = value[0];
    this.setState({
      startValue: value[0],
      startOpen: false,
      endOpen: true,
      page_data: page_data
    });

    this.handleSearch();
  }

  onEndChange(value) {
    let page_data = this.state.page_data;
    page_data.checkout = value[1];
    this.setState({
      endValue: value[1],
      page_data: page_data
    });
    this.handleSearch();
  }

  disabledStartDate(endValue) {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return endValue.diff(startValue, "days") < 0;
  }

  disableDate(date) {
    let selected_date = date;
    let now = moment();
    let diff_day = now.diff(selected_date, "days");

    if (diff_day > 0) {
      return true;
    } else {
      return false;
    }
  }

  handleLocationChange(e) {
    const address = e;
    let page_data = this.state.page_data;
    page_data.meta_title = address;

    return this.setState(
      {
        page_data: page_data,
        is_search_now: true, 
        search_location: address
      },
      () => {
        this.setState({
          is_search_now: false
        });
      }
    );
  }

  handleLocationSelect(e) {
    const address = e;
    let page_data = this.state.page_data;
    page_data.meta_title = address;
    this.setState({ 
      page_data: page_data,
      search_location: address
    }, () => {
      this.handleSearch();
    });
  }

  getDistance(lat1, lat2, lon1, lon2, unit = "K") {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist.toFixed(2);
    }
  }

  getBoundsZoomLevel(nw, se) {
    let mapDim = {};
    if (
      document.getElementById("search_google_map") &&
      document.getElementById("search_google_map").getBoundingClientRect()
        .width !== 0
    ) {
      mapDim = {
        height: document
          .getElementById("search_google_map")
          .getBoundingClientRect().height,
        width: document
          .getElementById("search_google_map")
          .getBoundingClientRect().width
      };
    } else {
      mapDim = {
        height: document
          .getElementById("search_google_map_parent")
          .getBoundingClientRect().height,
        width: document
          .getElementById("search_google_map_parent")
          .getBoundingClientRect().width
      };
    }

    const { zoom } = fitBounds({ nw, se }, mapDim);
    return zoom;
  }

  latRad(lat) {
    var sin = Math.sin((lat * Math.PI) / 180);
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  zoom(mapPx, worldPx, fraction) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onSelectDateRange(value, states) {
    let page_data = this.state.page_data;
    page_data.checkin = value.start;
    page_data.checkout = value.end;
    this.setState(
      {
        date_range: value,
        states: states,
        is_calendar_open: false,
        page_data: page_data
      },
      () => {
        this.handleSearch();
      }
    );
  }

  render() {
    let search_guest_options = [];

    for (let i = 1; i <= 30; i++) {
      search_guest_options.push(
        <option value={i} key={i}>
          {" "}
          {`${i} Guest`}{" "}
        </option>
      );
    }

    let lat_array = [];
    this.state.search_result.map((room, index) => {
      if (room && room.latitude) {
        return lat_array.push(parseFloat(room.latitude));
      }
      return null;
    });
    let lng_array = [];
    this.state.search_result.map((room, index) => {
      if (room && room.longitude) {
        return lng_array.push(parseFloat(room.longitude));
      }
      return null;
    });

    let max_maplatitude = lat_array.length ? Math.max(...lat_array) : 0;
    let min_maplatitude = lat_array.length ? Math.min(...lat_array) : 0;
    let max_maplongitude = lng_array.length ? Math.max(...lng_array) : 0;
    let min_maplongitude = lng_array.length ? Math.min(...lng_array) : 0;

console.log('locations => ', this.state.search_location)
    return (
      <section className="listingsearch_">
        <div className="container-fluid">
          {/* listing-searchbar start */}
          {document.body.clientWidth < 550 ? (
            <CalendarModal
              open={this.state.is_calendar_open}
              styles={{
                modal: { padding: "10px 0px 0px 0px" },
                closeButton: { display: "none" }
              }}
              onClose={() => this.onToggle()}
            >
              <h4 className="text-center">Please choose date range</h4>
              <DateRangePicker
                className="date_range"
                value={this.state.date_range ? this.state.date_range : ''}
                onSelect={this.onSelectDateRange}
                singleDateRange={true}
              />
            </CalendarModal>
          ) : null}
          <div className="listing-searchbar">
            <div className="col-lg-6 col-sm-8">
              <div className="row">
                <div className="col-md-3  col-6">
                  <div className="field-wrapper">
                    <img width="20px" height="20px" src={whereIcon} alt="" />
                    <label className="form-label" htmlFor="where">
                      {" "}
                      Where{" "}
                    </label>
                    {this.state.gmap_api_loaded && (
                      <PlacesAutocomplete
                        value={
                          this.state.search_location
                          // this.state.page_data.meta_title === undefined
                          //   ? ""
                          //   : this.state.page_data.meta_title
                        }
                        onChange={this.handleLocationChange}
                        onSelect={this.handleLocationSelect}
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading
                        }) => (
                          <div className="">
                            <input
                              {...getInputProps({
                                placeholder: "Where do you want to go?",
                                className: "form-in",
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
                                zIndex: "10000",
                                color: "black"
                              }}
                            >
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                const className = suggestion.active
                                  ? "suggestion-item--active"
                                  : "suggestion-item";
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: "#fafafa",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      paddingTop: "10px",
                                      padding: "10px",
                                      borderBottom: "solid 1px gray"
                                    }
                                  : {
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      paddingTop: "10px",
                                      padding: "10px",
                                      borderBottom: "solid 1px gray"
                                    };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style
                                    })}
                                  >
                                    <span>
                                      <i className="fa fa-map-marker"></i>
                                      &nbsp;&nbsp;
                                      {
                                        suggestion.formattedSuggestion.mainText
                                      },{" "}
                                      <small>
                                        {" "}
                                        {
                                          suggestion.formattedSuggestion
                                            .secondaryText
                                        }{" "}
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
                          </div>
                        )}
                      </PlacesAutocomplete>
                    )}
                  </div>
                </div>
                <div className="col-md-3  col-6">
                  <div className="field-wrapper">
                    <img width="20px" height="20px" src={calendarIcon} alt="" />
                    <label className="form-label" htmlFor="checkin">
                      {" "}
                      Check In{" "}
                    </label>
                    {document.body.clientWidth > 550 ? (
                      <Picker
                        type="start"
                        onOpenChange={this.onStartOpenChange}
                        open={this.state.startOpen}
                        showValue={this.state.startValue}
                        disabledDate={date => this.disableDate(date)}
                        value={[this.state.startValue, this.state.endValue]}
                        onChange={this.onStartChange}
                        name="checkin"
                        id="checkin"
                        className="form-in"
                        placeholder="Check In"
                      />
                    ) : (
                      <input
                        readOnly
                        id="checkin"
                        type="text"
                        className="form-in"
                        placeholder="Check In"
                        value={
                          this.state.date_range
                            ? this.state.date_range.start.format("MM-DD-YYYY")
                            : ""
                        }
                        required
                        onClick={this.onToggle}
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-3  col-6">
                  <div className="field-wrapper">
                    <img width="20px" height="20px" src={calendarIcon} alt="" />
                    <label className="form-label" htmlFor="checkout">
                      {" "}
                      Check Out{" "}
                    </label>
                    {document.body.clientWidth > 550 ? (
                      <Picker
                        type="end"
                        open={this.state.endOpen}
                        onOpenChange={this.onEndOpenChange}
                        showValue={this.state.endValue}
                        disabledDate={this.disabledStartDate}
                        value={[this.state.startValue, this.state.endValue]}
                        onChange={this.onEndChange}
                        name='checkout'
                        id="checkout" readOnly="readonly" className="form-in input-large text-truncate input-contrast ui-datepicker-target" placeholder="Check Out"
                      />
                    ) : (
                      <input
                        readOnly
                        id="checkout"
                        type="text"
                        className="form-in"
                        placeholder="Checkout"
                        value={
                          this.state.date_range
                            ? this.state.date_range.end.format("MM-DD-YYYY")
                            : ""
                        }
                        required
                        onClick={this.onToggle}
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-3  col-6">
                  <div className="field-wrapper">
                    <img width="20px" height="20px" src={avatarIcon} alt="" />
                    <label className="form-label" htmlFor="guests">
                      {" "}
                      Guests{" "}
                    </label>
                    <select
                      className="form-in"
                      defaultValue={
                        this.state.page_data.guest
                          ? this.state.page_data.guest
                          : 0
                      }
                      onChange={this.handleChangeGuest}
                    >
                      {search_guest_options}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mt-3 mb-3 pl-4 pr-4">
                <InputRange
                  maxValue={
                    this.state.page_data.max_price
                      ? this.state.page_data.max_price
                      : 5500
                  }
                  minValue={
                    this.state.page_data.min_price
                      ? this.state.page_data.min_price
                      : 0
                  }
                  value={this.state.value4}
                  onChange={value => this.setState({ value4: value })}
                  onChangeComplete={value => {
                    let page_data = this.state.page_data;
                    page_data.min_price_check = value.min;
                    page_data.max_price_check = value.max;
                    this.setState({ page_data }, () => {
                      this.handleSearch();
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6 col-sm-4">
              <div className="listing-more-filter">
                <button onClick={this.handleOpenFilter}>
                  <img width="20px" height="20px" src={filterIcon} alt="" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
          {/* listing-searchbar end */}
          <div className="listing-maplist-button">
            <button
              className="search-listing-button"
              onClick={() => this.handleChangeViewMode(false)}
            >
              {/* <i className="fas fa-list-ol" /> */}
              <FontAwesomeIcon icon={faListOl} />
              List
            </button>
            <button
              className="search-map-button button-active"
              onClick={() => this.handleChangeViewMode(true)}
            >
              <FontAwesomeIcon icon={faMap} /> Map
            </button>
          </div>
          {/* More filter section */}
          <div
            className={`listing-morefilter ${
              this.state.is_filter_open ? "openlisting-filter" : ""
            }`}
          >
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <h3
                  className={
                    this.state.opened_filter_types.indexOf("Property Type") ===
                    -1
                      ? `filtertitleclick`
                      : `filtertitleclick rotatearrow`
                  }
                  onClick={() =>
                    this.handleOpenMofilterOptions("Property Type")
                  }
                >
                  <img width="20px" height="20px" src={houseIcon} alt="" />{" "}
                  Property Type
                </h3>
                <div
                  className={
                    this.state.opened_filter_types.indexOf("Property Type") ===
                    -1
                      ? `listing-morefilter-list`
                      : `listing-morefilter-list filterlist-open`
                  }
                >
                  <ul>
                    {this.state.page_data.property_type_dropdown
                      ? this.state.page_data.property_type_dropdown.map(
                          (property_type, index) => {
                            return (
                              <li key={index}>
                                <label>
                                  <input
                                    type="checkbox"
                                    onChange={this.handleChangePropertyType}
                                    value={property_type.id}
                                  />{" "}
                                  {property_type.name}
                                </label>
                              </li>
                            );
                          }
                        )
                      : null}
                  </ul>
                </div>
              </div>
              {this.state.page_data.amenities_type
                ? this.state.page_data.amenities_type.map((type, index) => {
                    return (
                      <div className="col-md-3 col-6" key={index}>
                        <h3
                          className={
                            this.state.opened_filter_types.indexOf(
                              type.name
                            ) === -1
                              ? `filtertitleclick`
                              : `filtertitleclick rotatearrow`
                          }
                          onClick={() =>
                            this.handleOpenMofilterOptions(type.name)
                          }
                        >
                          {type.name}
                        </h3>
                        <div
                          className={
                            this.state.opened_filter_types.indexOf(
                              type.name
                            ) === -1
                              ? `listing-morefilter-list`
                              : `listing-morefilter-list filterlist-open`
                          }
                        >
                          <ul>
                            {this.state.page_data.amenities.map(
                              (amenity, index) => {
                                if (amenity.type_id === type.id) {
                                  return (
                                    <li key={index}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          onChange={this.handleChangeAmenity}
                                          value={amenity.id}
                                        />{" "}
                                        {amenity.name}
                                      </label>
                                    </li>
                                  );
                                }
                                return null;
                              }
                            )}
                          </ul>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          {/* More filter section */}
          {/* listing-searchbar start */}
          <div className="listing-map-list">
            <div className="row">
              <div
                className={
                  "col-md-7 col-sm-12 " +
                  (this.state.map_view_mode ? "hide_mode" : "view_mode")
                }
              >
                {this.state.is_search_now === false ? (
                  <div className={"listing-list-mainparent "}>
                    {this.state.search_result.map((room, index) => {
                      if (room) {
                        return (
                          <div
                            className="listing-list-main"
                            key={index}
                            onMouseEnter={() => this.handleResultHover(room.id)}
                            onMouseLeave={() => this.handleResultLeave(room.id)}
                          >
                            <div className="listing-left-img">
                              <Link to="#">
                                <img
                                  src={room.featured_image}
                                  width="100%"
                                  height="100%"
                                  alt=""
                                />
                                {room.plan_type === 1 ? (
                                  <div className="list-type">Featured</div>
                                ) : null}
                              </Link>
                            </div>
                            <div className="listing-right-content">
                              <Link to="#">
                                <div className="listing-list-topbar">
                                  <h4>
                                    <img
                                      width="20px"
                                      height="20px"
                                      src={houseIcon}
                                      alt=""
                                    />
                                    {room.name}
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: room.overall_star_rating
                                    }}
                                  ></div>
                                  {room.review_count ? (
                                    <div className="theme-search-results-item-hotel-rating">
                                      <p className="theme-search-results-item-hotel-rating-title">
                                        <b>{room.avg_rating}</b>&nbsp;(
                                        {room.review_count} views)
                                      </p>
                                    </div>
                                  ) : null}
                                  <h6>
                                    <ReactCountryFlag svg code={room.country} />
                                    {room.city} / {room.state}{" "}
                                  </h6>
                                  <p>{room.sub_name}</p>
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/homes/${room.address_url}/${room.id}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    Listing Detail
                                  </button>
                                </div>
                                <div className="listing-list-btmbar">
                                  <div className="listing-price">
                                    <h3>
                                      <span>
                                        {" "}
                                        {room.rooms_price.currency_code ===
                                        "USD"
                                          ? "$"
                                          : room.rooms_price.currency_code}{" "}
                                      </span>
                                      {room.rooms_price.original_night}
                                    </h3>
                                  </div>
                                  <div className="listing-dates"></div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                    <div className="row mt-3"></div>
                  </div>
                ) : (
                  <ReactSpinner />
                )
                //  ) : null
                }
              </div>
              <div
                className={
                  "col-md-5 col-sm-12 " +
                  (!this.state.map_view_mode ? "hide_mode" : "view_mode")
                }
                style={{ height: "73vh" }}
                id="search_google_map_parent"
              >
                {
                  //this.state.page_data.cLat ?
                  <div
                    style={{ height: "68vh" }}
                    className={
                      "list-maparea " +
                      (!this.state.map_view_mode ? "hide_mode" : "view_mode")
                    }
                    id="search_google_map"
                  >
                    {this.state.gmap_api_loaded && (
                      <SearchMap
                        data={this.state.search_result}
                        handleMapChange={this.handleMapChange}
                        defaultCenter={
                          this.state.map_center
                            ? this.state.map_center
                            : {
                                lat:
                                  (max_maplatitude + min_maplatitude) / 2
                                    ? (max_maplatitude + min_maplatitude) / 2
                                    : this.state.page_data.cLat,
                                lng:
                                  (max_maplongitude + min_maplongitude) / 2
                                    ? (max_maplongitude + min_maplongitude) / 2
                                    : this.state.page_data.cLong
                              }
                        }
                        zoom={
                          this.state.search_result.length === 1
                            ? 11
                            : this.state.map_zoom
                            ? this.state.map_zoom
                            : this.state.search_result.length
                            ? this.getBoundsZoomLevel(
                                { lat: max_maplatitude, lng: min_maplongitude },
                                { lat: min_maplatitude, lng: max_maplongitude }
                              )
                            : 11
                        }
                        hover_room={this.state.hover_room}
                      ></SearchMap>
                    )}
                  </div>

                  // : null
                }
              </div>
              <div className="listing-pagination col-md-7">
                <ReactPaginate
                  containerClassName=""
                  previousLabel={"prev"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.last_page}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Search;
