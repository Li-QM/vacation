import React from "react";
import { Link } from 'react-router-dom';
import moment from "moment";
import { ReactSpinner } from "react-spinning-wheel";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

import DateRangePicker from "react-daterange-picker";

import Wishlist from "./Wishlist";
// import { openChatBoxAction } from '../../../../actions/chatmodule/chatmoduleActions';

import { listingDetailService } from "services/listingDetail";
import { alertService } from "services/alert";
import { getCookie } from "services/config";

import "moment/locale/zh-cn";
import "moment/locale/en-gb";

import "rc-calendar/assets/index.css";
import "react-spinning-wheel/dist/style.css";
import "react-daterange-picker/dist/css/react-calendar.css";

import "./booking.scss";

const user_id = getCookie('user_id');
const is_loged_in = getCookie('is_loged_in');
const now = moment();
now.locale("en-gb").utcOffset(0);

const stateDefinitions = {
  available: {
    color: null,
    label: "Available"
  },
  booked: {
    color: "#ffd200",
    label: "booked"
  },
  unavailable: {
    selectable: false,
    color: "#78818b",
    label: "Unavailable"
  }
};

class Booking extends React.Component {
  constructor(props) {
    super(props);
    const today = moment();
    this.state = {
      room_id: this.props.room_id,
      startValue: null,
      endValue: null,
      startOpen: false,
      endOpen: false,
      checkin: null,
      checkout: null,
      number_of_guests: 1,
      is_pricing: false,
      price_result: {},
      is_chat_modal_open: false,
      message: "",
      chat_history: [],
      isLogedIn: is_loged_in,
      isRangeCalendaropen: false,
      value: moment.range(today.clone(), today.clone()),
      calendar_data: [],
      is_bin_enable: this.props.user_details.is_bin_enable
    };
    this.onStartOpenChange = this.onStartOpenChange.bind(this);
    this.onEndOpenChange = this.onEndOpenChange.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
    this.onEndChange = this.onEndChange.bind(this);
    this.disabledStartDate = this.disabledStartDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePriceCalculate = this.handlePriceCalculate.bind(this);
    this.openChatModal = this.openChatModal.bind(this);
    this.onRequestBook = this.onRequestBook.bind(this);
    this.onBookItNow = this.onBookItNow.bind(this);
    this.onToggleCalendarOpen = this.onToggleCalendarOpen.bind(this);
    this.onSelectDateRange = this.onSelectDateRange.bind(this);
    this.onSelectDateRangeStart = this.onSelectDateRangeStart.bind(this);
    this.onSendMailOwner = this.onSendMailOwner.bind(this);
  }

  componentDidMount() {
    listingDetailService.getUnavailableCalendarInRoom(this.props.room_id)
      .then(res => {
        if (res) {
          this.setState({
            calendar_data: res
          });
        } else {
          alertService.showError('Get room calendar');
        }
      });
  }

  openChatModal() {
    if (this.state.isLogedIn === 'true') {
      if (this.props.user_details.id !== user_id) {
        // axios.get("/ajax/chat/getContactId/" + this.props.user_details.id + "/" + user_id)
        //   .then(result => {
        //     const contactID = result.data;
        //     this.props.openChatBoxAction(contactID);
        //   });
      } else {
        alertService.showError("This is your listing.", '');
      }
    } else {
      // open login modal
    }
  }
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState(
      {
        [name]: value,
        is_pricing: true
      },
      () => {
        this.handlePriceCalculate();
      }
    );
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
    let checkin = value[0];
    this.setState({
      checkin: checkin,
      startOpen: false,
      is_pricing: true,
      endOpen: true
    });
    this.handlePriceCalculate();
  }

  onEndChange(value) {
    let { checkin, checkout, number_of_guests } = this.state;
    checkout = value[1];
    this.setState({
      checkout: checkout,
      is_pricing: true
    });
    listingDetailService.getPriceCalculation(checkin, checkout, number_of_guests, this.props.room_id)
      .then(res => {
        if (res) {
          this.setState({
            price_result: res,
            is_pricing: false
          });
        } else {
          this.setState({ is_pricing: false });
        }
      });
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
  handlePriceCalculate() {
    let { checkin, checkout, number_of_guests } = this.state;
    if (checkin !== null && checkout !== null) {
      listingDetailService.getPriceCalculation(checkin, checkout, number_of_guests, this.props.room_id)
        .then(res => {
          if (res) {
            this.setState({
              price_result: res,
              is_pricing: false
            });
          } else {
            this.setState({
              is_pricing: false
            });
          }
        });
    }
  }
  onRequestBook() {
    if (this.state.isLogedIn === 'true') {
      if (this.props.user_details.id !== user_id) {
        let { checkin, checkout, number_of_guests } = this.state;
        let request_user_id = user_id;
        if (checkin !== null && checkout !== null) {
          listingDetailService.fetchRequestBooking(checkin, checkout, number_of_guests, this.props.room_id, request_user_id)
            .then(res => {
              if (res) {
                if (res.status === "success") {
                  alertService.showSuccess(res.message, '');
                } else {
                  alertService.showError(res.message, '');
                }
              } else {
                alertService.showError("Not request to book successfully.", '');
              }
            });
        } else {
          alertService.showError("Please enter Check In/Check Out.", '');
        }
      } else {
        alertService.showError("This is your listing", '');
      }
    } else {
      alertService.showError("You can request after Login", '');
    }
  }

  onBookItNow() {
    if (this.state.isLogedIn === 'true') {
      if (this.props.user_details.id !== user_id) {
        let { checkin, checkout } = this.state;

        if (checkin !== null && checkout !== null) {
          let url = `https://manage.bookingautomation.com/booking.php?propid=${
            this.props.user_details.prop_id
          }&type=0&referer=BookingButton&checkin=${checkin.format(
            "YYYY-MM-DD"
          )}&checkout=${checkout.format("YYYY-MM-DD")}`;
          window.open(url, "_blank");
        }
      } else {
        alertService.showError("This is your listing", '');
      }
    } else {
      alertService.showError("You can request after Login");
    }
  }
  onToggleCalendarOpen() {
    this.setState({
      isRangeCalendaropen: !this.state.isRangeCalendaropen
    });
  }
  onSelectDateRangeStart(value, states) {
    document.getElementById("checkin").value = value.format("MM-DD-YYYY");
  }
  onSelectDateRange(value, states) {
    this.setState({ value, states }, () => {
      this.setState({
        isRangeCalendaropen: false,
        checkin: this.state.value.start,
        checkout: this.state.value.end,
        is_pricing: true
      });

      listingDetailService.getPriceCalculation(this.state.value.start, this.state.value.end, this.state.number_of_guest, this.props.room_id)
        .then(res => {
          if (res) {
            this.setState({
              price_result: res,
              is_pricing: false
            });
          } else {
            alertService.showError('Not calculate price successfully.', '');
            this.setState({ is_pricing: false });
          }
        });
    });
  }
  onSendMailOwner() {
    listingDetailService.sendMailOwner(this.props.room_id).then(res => {
      alertService.showSuccess('Send owner mail');
    });
  }
  render() {
    let accommodates_array = [];
    let calc_accomodates = 1;
    if (this.props.room_detail.accommodates > 1) {
      calc_accomodates = this.props.room_detail.accommodates;
    }
    for (let ii = 1; ii <= calc_accomodates; ii++) {
      accommodates_array.push( <option value={ii} key={ii}> {ii} </option> );
    }

    let dateRanges = [];
    dateRanges =
      this.state.calendar_data &&
      this.state.calendar_data.map((calendar, index) => {
        return {
          state: calendar.status === "Not available" ? "unavailable" : "booked",
          range: moment.range(
            moment(calendar.start_date, "YYYY-MM-DD"),
            moment(calendar.end_date, "YYYY-MM-DD")
          )
        };
      });

    return (
      <div className="col-lg-4 col-sm-12">
        <form onSubmit={this.handleSubmit}>
          <div
            id="book_it"
            className="display-subtotal"
            style={{ top: "-1px" }}
          >
            <div className="panel book-it-panel">
              <div className="panel-body panel-light">
                <div className="form-fields">
                  <div className="row row-condensed space-1">
                    <div className="col-md-9 col-sm-12 lang-chang-label">
                      <div className="row row-condensed">
                        <div className="col-sm-6 space-1-sm lang-chang-label">
                          <label htmlFor="checkin">
                            <font style={{ verticalalign: "inherit" }}>
                              <font style={{ verticalalitge: "inherit" }}>
                                Check in
                              </font>
                            </font>
                          </label>
                          <input
                            className="checkin ui-datepicker-target hasDatepicker w-100"
                            name="checkin"
                            placeholder="Check In"
                            readOnly
                            id="checkin"
                            value={
                              this.state.checkin
                                ? this.state.checkin.format("MM-DD-YYYY")
                                : ""
                            }
                            required
                            onClick={this.onToggleCalendarOpen}
                          />
                        </div>
                        <div className="col-sm-6 space-1-sm">
                          <label htmlFor="checkout">
                            <font style={{ verticalAlign: "inherit" }}>
                              <font style={{ verticalAlign: "inherit" }}>
                                Check out
                              </font>
                            </font>
                          </label>
                          <input
                            className="checkin ui-datepicker-target hasDatepicker w-100"
                            name="checkout"
                            placeholder="Check Out"
                            readOnly
                            id="checkout"
                            value={
                              this.state.checkout
                                ? this.state.checkout.format("MM-DD-YYYY")
                                : ""
                            }
                            required
                            onClick={this.onToggleCalendarOpen}
                          />
                        </div>
                        {this.state.isRangeCalendaropen && (
                          <div
                            className="datepickerOverlay"
                            onClick={() =>
                              this.setState({ isRangeCalendaropen: false })
                            }
                          ></div>
                        )}
                        {this.state.isRangeCalendaropen && (
                          <DateRangePicker
                            firstOfWeek={1}
                            numberOfCalendars={1}
                            selectionType="range"
                            minimumDate={new Date()}
                            stateDefinitions={stateDefinitions}
                            defaultState="available"
                            showLegend={true}
                            value={this.state.value}
                            onSelectStart={this.onSelectDateRangeStart}
                            onSelect={this.onSelectDateRange}
                            dateStates={dateRanges}
                            singleDateRange={true}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 book_select">
                      <label htmlFor="number_of_guests">
                        <font style={{ verticalAlign: "inherit" }}>
                          <font style={{ verticalAlign: "inherit" }}>
                            Guests
                          </font>
                        </font>
                      </label>
                      <div className="select select-block">
                        <select
                          id="number_of_guests"
                          name="number_of_guests"
                          onChange={this.handleChange}
                          value={this.state.number_of_guests}
                        >
                          {accommodates_array}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="js-book-it-status">
                  <div className="js-book-it-enabled clearfix">
                    {this.state.is_pricing ? <ReactSpinner /> : null}
                    {this.state.price_result.status === "Available" ? (
                      <div
                        className="js-subtotal-container book-it__subtotal panel-padding-fit"
                        style={{}}
                      >
                        <table className="table table-bordered price_table">
                          <tbody>
                            <tr>
                              <td className="pos-rel room-night">
                                <span className="lang-chang-label"> $</span>
                                <span
                                  className="lang-chang-label"
                                  id="rooms_price_amount_1"
                                  value
                                >
                                  {this.state.price_result.base_rooms_price}
                                </span>{" "}
                                <span className="lang-chang-label"> x </span>
                                <span id="total_night_count" value>
                                  {this.state.price_result.total_nights}
                                </span>{" "}
                                Night
                                <i
                                  id="service-fee-tooltip"
                                  rel="tooltip"
                                  className="icon icon-question"
                                  title="Average nightly rate is rounded"
                                />
                              </td>
                              <td>
                                <span className="lang-chang-label">$</span>
                                <span id="total_night_price" value>
                                  {this.state.price_result.total_night_price}
                                </span>
                              </td>
                            </tr>
                            <tr
                              className="early_bird booking_period text-beach"
                              style={{ display: "none" }}
                            >
                              <td>
                                <span className="booked_period_discount" value> 0 </span>
                                % early bird discount
                              </td>
                              <td>
                                $
                                <span className="booked_period_discount_price" value>
                                  0
                                </span>
                              </td>
                            </tr>
                            <tr className="last_min booking_period text-beach" style={{ display: "none" }}>
                              <td>
                                <span className="booked_period_discount" value> 0 </span>
                                % last min discount
                              </td>
                              <td>
                                $
                                <span className="booked_period_discount_price" value> 0 </span>
                              </td>
                            </tr>
                            <tr className="weekly text-beach" style={{ display: "none" }} >
                              <td>
                                <span id="weekly_discount" value> 0 </span>
                                % weekly price discount
                              </td>
                              <td>
                                $
                                <span id="weekly_discount_price" value> 0 </span>
                              </td>
                            </tr>
                            <tr className="monthly text-beach" style={{ display: "none" }}>
                              <td>
                                <span id="monthly_discount" value> 0 </span>
                                % monthly price discount
                              </td>
                              <td>
                                - $
                                <span id="monthly_discount_price" value> 0 </span>
                              </td>
                            </tr>
                            <tr className="long_term text-beach" style={{ display: "none" }} >
                              <td>
                                <span id="long_term_discount" value> 0 </span>
                                % length of stay discount
                              </td>
                              <td>
                                -$
                                <span id="long_term_discount_price" value> 0 </span>
                              </td>
                            </tr>
                            {this.state.price_result.additional_guest ? (
                              <tr className="additional_price">
                                <td>
                                  Additional Guest fee{" "}
                                  <i
                                    rel="tooltip"
                                    className="icon icon-question"
                                    title="If reservation is for more than 6 guests, a $0 fee per additional guest will be applied."
                                  />
                                </td>
                                <td>
                                  $
                                  <span id="additional_guest" value>
                                    {this.state.price_result.additional_guest}
                                  </span>
                                </td>
                              </tr>
                            ) : null}

                            {this.state.price_result.security_fee ? (
                              <tr
                                className="security_price"
                                style={{ display: "table-row" }}
                              >
                                <td>
                                  Security fee{" "}
                                  <i
                                    id="service-fee-tooltip"
                                    rel="tooltip"
                                    className="icon icon-question"
                                    title="This is the security deposit amount charged by the host.  Please see the host's, cancellation/refund policy for additional terms"
                                  />
                                </td>
                                <td>
                                  $
                                  <span id="security_fee" value>
                                    {this.state.price_result.security_fee}
                                  </span>
                                </td>
                              </tr>
                            ) : null}

                            <tr
                              className="cleaning_price"
                              style={{ display: "table-row" }}
                            >
                              <td>Cleaning fee</td>
                              <td>
                                $
                                <span id="cleaning_fee" value>
                                  {this.state.price_result.cleaning_fee}
                                </span>
                              </td>
                            </tr>

                            {this.state.price_result.additional
                              ? this.state.price_result.additional.map(
                                  (additional, index) => {
                                    return (
                                      <tr
                                        key={index}
                                        className="cleaning_price"
                                        style={{ display: "table-row" }}
                                      >
                                        <td>{additional.label}</td>
                                        <td>
                                          $
                                          <span id="cleaning_fee" value>
                                            {additional.price}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )
                              : null}
                            <tr
                              className="taxes_price"
                              style={{ display: "table-row" }}
                            >
                              <td>
                                Taxes{" "}
                                <i
                                  id="taxes-fee-tooltip"
                                  rel="tooltip"
                                  className="icon icon-question"
                                  title="Tax Charges"
                                />
                              </td>
                              <td>
                                $
                                <span id="total_taxes_pay" value>
                                  {this.state.price_result.total_taxes_pay}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Total </td>
                              <td>
                                <span className="lang-chang-label">$</span>
                                <span id="total" value>
                                  {this.state.price_result.total}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    {this.state.price_result.status &&
                    this.state.price_result.status === "Not available"
                      ? this.state.price_result.error
                      : null}
                    <div className="js-book-it-btn-container row-space-top-2 ">
                      <button
                        type="button"
                        id="request_book_btn"
                        className="js-book-it-btn btn btn-large btn-block btn-primary"
                        onClick={this.onRequestBook}
                      >
                        <span className="book-it__btn-text ">
                          <font style={{ verticalAlign: "inherit" }}>
                            <font style={{ verticalAlign: "inherit" }}>
                              Request to Book
                            </font>
                          </font>
                        </span>
                      </button>
                      <input
                        type="hidden"
                        name="instant_book"
                        defaultValue="request_to_book"
                      />
                    </div>
                    {this.state.is_bin_enable &&
                    this.state.is_bin_enable === 1 &&
                    this.props.user_details.api_key &&
                    this.props.user_details.api_key !== "" &&
                    this.props.user_details.prop_id &&
                    this.props.user_details.prop_id !== "" &&
                    this.props.user_details.prop_key &&
                    this.props.user_details.prop_key !== "" &&
                    this.props.user_details.ota_password &&
                    this.props.user_details.ota_password !== "" ? (
                      <div className="js-book-it-btn-container row-space-top-2 ">
                        <button
                          type="button"
                          id="request_book_btn"
                          className="js-book-it-btn btn btn-large btn-block btn-success"
                          onClick={this.onBookItNow}
                        >
                          <span className="book-it__btn-text ">
                            <font style={{ verticalAlign: "inherit" }}>
                              <font style={{ verticalAlign: "inherit" }}>
                                Book it now
                              </font>
                            </font>
                          </span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel wishlist-panel">
              <div className="panel-body panel-light">
                <Wishlist roomId={this.props.room_id} />
                <div id="contact_wrapper" className="row-space-top-3 text-center">
                  <Link to="#" onClick={this.onSendMailOwner}>
                    {" "}
                    Contact host{" "}
                  </Link>
                </div>
                <div className="other-actions  text-center">
                  <div className="social-share-widget space-top-3 p3-share-widget">
                    <span className="share-title text-center">
                      <font style={{ verticalAlign: "inherit" }}>
                        <font style={{ verticalAlign: "inherit" }}>Share:</font>
                      </font>
                    </span>

                    <div className="text-center">
                      <div className="d-inline-block">
                        <FacebookShareButton url={document.location.href}>
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                      </div>
                      <div className="d-inline-block">
                        <TwitterShareButton url={document.location.href}>
                          <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   ...state
// });

// const mapDispatchToProps = dispatch => ({
// openChatBoxAction: contactID => dispatch(openChatBoxAction(contactID))
// // renderStopSidebarAction : () => dispatch(renderStopSidebarAction)
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Booking);
export default Booking;
    