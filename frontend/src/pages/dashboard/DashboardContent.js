import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import { dashboardService } from 'services/dashboard';
import 'assets/styles/pages/dashboard/dashboard.scss';

class DashboardContent extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      user_info: {
        first_name: 'Tourists',
        last_name: ''
      },

      page_data: {
        pending_reservation_count: 0,
        pending_reservations: [],

        pending_trip_count: 0,
        upcoming_trip_count: 0,
        current_trip_count: 0,
        all_trip_count: 0,

        upcoming_reservation_count: 0,
        current_reservation_count: 0,
        listing_count: 0,
        pending_count: 0,
        unreadmessagecount: 0,
        messages: [],

      }
    }
  }

  componentDidMount() {
    dashboardService.getContent().then(res => {
      if (res) {
        this.setState({
          user_info: res.user_info,
          page_data: res.data
        });
      }
    })
  }

  render() {

    const pending_request_title = (
      <span>
        Pending Requests and Inquiries
      </span>
    )

    const notification_title = (
      <span>
        Notifications
        <span className="badge badge-pill badge-secondary">{this.state.page_data.unreadmessagecount}</span>
      </span>
    )

    return (
      <div className="contents">
        <div className="aside-main-content">
          <div className="side-cnt">
            <div className="row">
              <div className="col-md-12">
                <div className="pro-detial">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <div className="user-profile">
                        <img src={this.state.page_data.profile_pic} className="img-responsive" alt="profile" />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h3>Hello, {this.state.user_info.first_name}!</h3>
                      <span>Good Morning!</span>
                      <p>Guess how many nights you've hosted this year?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="profile-tab">
                  <Tabs defaultActiveKey="listing" transition={false}>
                    <Tab eventKey="listing" title="My Listings">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Pending Reservations
                        <span className="badge badge-primary badge-pill">{this.state.page_data.pending_reservation_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Upcoming Reservations
                        <span className="badge badge-primary badge-pill">{this.state.page_data.upcoming_reservation_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Current Reservations
                        <span className="badge badge-primary badge-pill">{this.state.page_data.current_reservation_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Total Listings
                        <span className="badge badge-pill no-pd">{this.state.page_data.listing_count}</span>
                        </li>
                      </ul>
                    </Tab>

                    <Tab eventKey="trips" title="My Trips">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Pending Trips
                        <span className="badge badge-primary badge-pill">{this.state.page_data.pending_trip_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Upcoming Trips
                        <span className="badge badge-primary badge-pill">{this.state.page_data.upcoming_trip_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Current Trips
                        <span className="badge badge-primary badge-pill">{this.state.page_data.current_trip_count}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Total Listings
                        <span className="badge badge-pill no-pd">{this.state.page_data.all_trip_count}</span>
                        </li>
                      </ul>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="aside-main-content">
          <div className="row">
            <div className="col-12">
              <Tabs defaultActiveKey="pending-request" transition={false}>
                <Tab eventKey="pending-request" title={pending_request_title}>
                  <div className="content">
                    <h3>Recent Reservation and Trips</h3>
                    {this.state.page_data.pending_reservations && this.state.page_data.pending_reservations.length === 0 ? <p>You have no reservations!</p> : null}
                    {this.state.page_data.pending_reservations &&
                      this.state.page_data.pending_reservations.map((reservation, index) => {
                        return (
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Reservation
                          <span className="badge badge-primary badge-pill"></span>
                          </li>
                        )
                      })}
                  </div>
                </Tab>

                <Tab eventKey="notifications" title={notification_title}>
                  <div className="content">
                    <h3>Notification </h3>
                    <ul className="list-group list-group-flush" />
                    {this.state.page_data.messages && this.state.page_data.messages.map((message, index) => {
                      if (!message.message) return null;
                      return (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                          <div className="media va-container reserve">
                            <div className="pull-left media-photo media-round">
                              <img width={50} height={50} title="Angie Calfee" src="https://lh4.googleusercontent.com/-AeR3l9kUNTY/AAAAAAAAAAI/AAAAAAAAAAA/AKxrwcYcmOWYb7zFNYV1f0ceyRzs5elcKQ/mo/photo.jpg?sz=225" alt="Angie Calfee" />
                            </div>
                            <div className="va-top">
                              <div className="text-normal">{message.userInfo.full_name}</div>
                              <br />
                              {message.message.message}
                              <br />
                              {/* {moment.utc(message.message.created_at).format(dateFormat)} */}
                            </div>
                          </div>
                          <span className="badge badge-danger badge-pill">{message.count}</span>
                        </li>
                      )
                    })}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardContent;