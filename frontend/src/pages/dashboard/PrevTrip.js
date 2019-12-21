import React from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/trip.scss';

class PrevTrip extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      page_data : {
        previous_trips : []
      }
    }
  }
  
  componentDidMount() {
    dashboardService.getOldTripList().then(res => {
      if (res) {
        this.setState({
          page_data : res.page_data
        });
      } else {
        alertService.showError('Get old trip list');
      }
    })
  }

  render() {
    let page_content = [];

    let trips_list = this.state.page_data.previous_trips.map((trip) => {
      return (
        trip.rooms ? 
        (
          <tr key={trip.id}>
            <td>
              <span className="label label-orange label-info">
                <span className={"label-" + trip.status_color}>
                  {trip.status}
                  </span>
              </span>
              <br />
            </td>
            <td className="location">
              <Link to="#"> {trip.rooms ? trip.rooms.name : 'No rooms'} </Link>
              <br/>
              {trip.room_address_city_or_state}
              </td>
            <td className="host"> <Link to="#"> {trip.host} </Link> </td>
            <td className="dates"> {trip.dates_subject} </td>
            <td>
              <ul className="list-unstyled">
                <li className="row-space-1">
                  <Link to="#" className="button-steel"> Message History </Link>
                  <br/>
                  <Link to="#" className="button-steel"> Cancel Request </Link>
                </li>
              </ul>
            </td>
          </tr>
        )
        : null
      );
    })

    page_content.push(
      <div className="panel row-space-4" key='pending_trips'>
        <div className="panel-header">
          Previous Trips
          </div>
        <div className="table-responsive">
          <table className="table panel-body panel-light">
            <tbody>
              <tr>
                <th> Status </th>
                <th> Location </th>
                <th> Host </th>
                <th> Dates </th>
                <th> Options </th>
              </tr>
              {trips_list.length ? trips_list : <tr><td colSpan='100%' className='text-center'>You have no previous trips!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );

    let page_data = page_content ? page_content : '<div>No Data</div>';

    return (<div className="col-md-12 p0">{page_data}</div>);
  }
}

export default PrevTrip;