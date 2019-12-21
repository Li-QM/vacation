import React from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/dashboard.scss';
import 'assets/styles/pages/dashboard/reservation.scss';

class Reservation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current_reservation: true,
      page_data: []
    };
  }

  componentDidMount() {
    dashboardService.getRoomReservation().then(res => {
      if (res) {
        this.setState({
          page_data: res.page_data
        });
      } else {
        alertService.showError('Get room reservation');
      }
    });

    this.handleDecline = this.handleDecline.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDeclineSubmit = this.handleDeclineSubmit.bind(this);
    this.handleAcceptSubmit = this.handleAcceptSubmit.bind(this);
  }

  handleViewAllReservations(e) {
    e.preventDefault();
    dashboardService.getRoomReservation("?all=1").then(res => {
      if (res) {
        this.setState({
          page_data: res.page_data,
          current_reservation: true
        });
      } else {
        alertService.showError('Get room reservation');
      }
    });
  }

  handleViewUpcomingReservations(e) {
    e.preventDefault();
    dashboardService.getRoomReservation().then(res => {
      if (res) {
        this.setState({
          page_data: res.page_data,
          current_reservation: true
        });
      } else {
        alertService.showError('Get room reservation');
      }
    });
  }

  handleAcceptSubmit(e, index) {
    e.preventDefault();
    const id = this.state.page_data.reservations[index].id;
    const data = {
      message: e.target.message.value,
      tos_confirm: e.target.tos_confirm.value
    };
    dashboardService.acceptReservation(id, data).then(res => {
      if (res && res.data.status === 'success') {
        let page_data = this.state.page_data;
        page_data.reservations[index].status = "Accepted";
        this.setState({
          page_data: page_data,
          current_reservation: true
        });
      } else {
        alertService.showError('Accept reservation');
      }
    });
  }

  handleDeclineSubmit(e, index) {
    e.preventDefault();

    const id = this.state.page_data.reservations[index].id;
    const data = {
      decline_reason: e.target.decline_reason.value,
      decline_reason_other: e.target.decline_reason_other.value,
      decline_message: e.target.decline_message.value,
      all: this.state.current_reservation ? 0 : 1
    };
    dashboardService.declineReservation(id, data).then(res => {
      if (res && res.data.status === "success") {
        this.setState({
          page_data: res.data.page_data,
          current_reservation: true
        });
      } else {
        alertService.showError('Decline reservation');
      }
    });
  }

  handleAccept(index) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui bg-primary p-4 text-white">
            <h2>Accept this request</h2>
            <div>
              {/* <h5>Are you sure that you want to decline this reservation?</h5> */}
              <form
                acceptCharset="UTF-8"
                onSubmit={event => {
                  this.handleAcceptSubmit(event, index);
                  onClose();
                }}
                id="cancel_reservation_form"
                method="post"
                name="cancel_reservation_form"
              >
                <div className="panel-body p-0">
                  <label htmlFor="message" className="row-space-top-2">
                    Type optional message to guest
                  </label>
                  <textarea cols={40} id="message" name="message" rows={4} />
                  <input
                    type="hidden"
                    name="id"
                    id="reserve_code"
                    defaultValue
                  />
                  <div className="row">
                    <div className="col-1 row-space-top-2">
                      <input
                        id="tos_confirm"
                        name="tos_confirm"
                        type="checkbox"
                        value="0"
                      />
                    </div>
                    <div className="col-11">
                      <label className="label-inline" for="tos_confirm">
                        By checking this box, I agree to the
                        <Link to="#">Terms of Service</Link>.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="panel-footer">
                  <input type="hidden" name="decision" defaultValue="decline" />
                  <button className="btn btn-danger" onClick={onClose}>
                    Close
                  </button>
                  <button className="btn btn-success ml-4" type="submit">
                    Yes, I will Accept!
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
    });
  }
  handleDecline(index) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui bg-primary p-4 text-white">
            <h2>Decline this request</h2>

            <div>
              <h5>Are you sure that you want to decline this reservation?</h5>

              <form
                acceptCharset="UTF-8"
                onSubmit={event => {
                  this.handleDeclineSubmit(event, index);
                  onClose();
                }}
                id="cancel_reservation_form"
                method="post"
                name="cancel_reservation_form"
              >
                <div className="panel-body p-0">
                  <div id="decline_reason_container">
                    <p>
                      Help us improve your experience. What's the main reason
                      for declining this inquiry
                    </p>
                    <p>
                      <strong>
                        Your response is not shared with the guest.
                      </strong>
                    </p>
                    <div className="select">
                      <select id="decline_reason" name="decline_reason">
                        <option value="dates_not_available">
                          Dates are not available
                        </option>
                        <option value="not_comfortable">
                          I do not feel comfortable with this guest
                        </option>
                        <option value="not_a_good_fit">
                          My listing is not a good fit for the guest’s needs
                          (children, pets, etc.)
                        </option>
                        <option value="waiting_for_better_reservation">
                          I’m waiting for a more attractive reservation
                        </option>
                        <option value="different_dates_than_selected">
                          The guest is asking for different dates than the ones
                          selected in this request
                        </option>
                        <option value="spam">This message is spam</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div
                      id="decline_reason_other"
                      className="hide row-space-top-2"
                    >
                      <label htmlFor="decline_reason_other">
                        Why are you declining
                      </label>
                      <textarea
                        id="decline_reason_other"
                        name="decline_reason_other"
                        rows={2}
                      />
                    </div>
                  </div>
                  <label htmlFor="decline_message" className="row-space-top-2">
                    Type optional message to guest
                  </label>
                  <textarea
                    cols={40}
                    id="decline_message"
                    name="decline_message"
                    rows={4}
                  />
                  <input
                    type="hidden"
                    name="id"
                    id="reserve_code"
                    defaultValue
                  />
                </div>
                <div className="panel-footer">
                  <input type="hidden" name="decision" defaultValue="decline" />
                  <button className="btn btn-danger" onClick={onClose}>
                    Close
                  </button>
                  <button className="btn btn-success ml-4" type="submit">
                    Yes, I will Decline!
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      }
    });
  }

  render() {
    let reservation_rows = [];
    if (this.state.page_data.reservations) {
      reservation_rows = this.state.page_data.reservations.map(
        (reservation, index) => {
          return (
            <tr className="reservation" key={index}>
              <td>
                <span className="label label-expired">
                  {reservation.status}
                </span>
              </td>
              <td>
                {reservation.dates_subject}
                <br />
                <Link to="#" locale="en"> {reservation.rooms.name}</Link>
                <br />
                {reservation.rooms_address.address_line_1}
                {reservation.rooms_address.city !== ""
                  ? reservation.rooms_address.city + ","
                  : null}
                <br />{" "}
                {reservation.rooms_address.state !== ""
                  ? reservation.rooms_address.state + ","
                  : null}
                <br />
                {reservation.rooms_address.postal_code !== ""
                  ? reservation.rooms_address.postal_code
                  : null}
              </td>
              <td>
                <div className="media va-container reserve">
                  <Link to="#" className="pull-left media-photo media-round">
                    <img
                      width={50}
                      height={50}
                      title={reservation.users.full_name}
                      src={reservation.user_profile_picture}
                      alt={reservation.users.full_name}
                    />
                  </Link>
                  <div className="va-top">
                    <Link to="#" className="text-normal">{reservation.users.full_name}</Link>
                    <br /> {reservation.users.primary_phone_number}
                    <br /> {reservation.users.email}
                  </div>
                </div>
              </td>
              <td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: reservation.currency.symbol
                  }}
                />
                {reservation.grand_total} total
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <Link to="#" className="btn btn-outline-primary btn-sm">
                      Contact Customer
                    </Link>
                  </li>
                  {reservation.status === "Pending" && (
                    <li className="mb-1">
                      <Link to="#"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => this.handleDecline(index)}
                      >
                        Decline
                      </Link>
                    </li>
                  )}
                  {reservation.status === "Pending" && (
                    <li className="mb-1">
                      <Link to="#"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => this.handleAccept(index)}
                      >
                        Accept
                      </Link>
                    </li>
                  )}
                  {/* <li><Link to="#">Message History</Link></li> */}
                </ul>
              </td>
            </tr>
          );
        }
      );
    }

    return (
      <div className="aside-main-content">
        <div className="side-cnt">
          <div className="head-label">
            <h4>
              {this.state.current_reservation
                ? "Upcoming Reservations"
                : "All Reservations"}
            </h4>
            <button type="button" className="btn btn-outline-light btn-sm">
              Print
              <FontAwesomeIcon className="before-space" icon={faPrint} />
            </button>
          </div>
          <div className="aside-main-cn">
            <div className="your-res_">
              <div className="table-responsive reservationsMY table_style1">
                <table
                  className="table panel-body space-1"
                  style={{ backgroundColor: "white" }}
                >
                  <tbody>
                    <tr>
                      <th>Status</th>
                      <th>Dates and Location</th>
                      <th>Guest</th>
                      <th>Details</th>
                    </tr>
                    {
                      reservation_rows
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4}>
                        <div>
                          {this.state.current_reservation === true ? (
                            <p>View all reservations</p>
                          ) : (
                            <p>View upcoming reservations</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reservation;
