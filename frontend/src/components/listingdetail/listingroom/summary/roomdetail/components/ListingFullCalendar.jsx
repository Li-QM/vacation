import React from 'react';
import { Link } from 'react-router-dom';
import dateFns from 'date-fns';

import ListingMonthCalendar from './ListingMonthCalendar';

import { listingDetailService } from 'services/listingDetail';

import './ld_calendar.scss';

class ListingFullCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_date: new Date(),
      end_date: dateFns.addMonths(new Date(), 3),
      full_mode: false,
      unavailable_calendar: {
        day_position: [],
        day_types: [],
        self_days: [],
        unavailable_dates: []
      }
    };
    this.handleChangeMonth = this.handleChangeMonth.bind(this);
    this.handleChangeViewMode = this.handleChangeViewMode.bind(this);
  }
  componentDidMount() {
    listingDetailService.getUnavailableCalendarWithSeasonal(this.props.room_id, '')
      .then(res => {
        this.setState({
          unavailable_calendar: res
        });
      });
    // Axios.post(
    //   `/ajax/rooms/manage-listing/${this.props.room_id}/unavailable_calendar`,
    //   { seasonal_name: '' }
    // ).then(Response => {
    //   // console.log(Response.data)
    //   this.setState({
    //     unavailable_calendar: Response.data
    //   });
    // });
  }
  handleChangeMonth(option) {
    let { current_date, end_date } = this.state;
    if (option === 1) {
      current_date = dateFns.addMonths(current_date, 1);
      end_date = dateFns.addMonths(end_date, 1);
    } else {
      current_date = dateFns.subMonths(current_date, 1);
      end_date = dateFns.subMonths(end_date, 1);
    }

    this.setState({
      current_date: current_date,
      end_date: end_date
    });
  }
  handleChangeViewMode() {
    this.setState({
      full_mode: !this.state.full_mode,
      end_date: this.state.full_mode
        ? dateFns.addMonths(this.state.current_date, 3)
        : dateFns.addMonths(this.state.current_date, 11)
    });
  }
  renderHeader() {
    return (
      <div className="row p-5">
        <div className="pull-left">
          <Link to="#" onClick={() => this.handleChangeMonth(-1)}>Prev</Link>
        </div>
        <div className="col text-center">
          {dateFns.format(this.state.current_date, "MMMM YYYY")} -{" "}
          {dateFns.format(this.state.end_date, "MMMM YYYY")}
          <p>
            {this.state.full_mode ? (
              <Link to="#" onClick={this.handleChangeViewMode}>View small calendar</Link>
            ) : (
              <Link to="#" onClick={this.handleChangeViewMode}>View full calendar</Link>
            )}
          </p>
        </div>
        <div className="pull-right">
          <Link to="#" onClick={() => this.handleChangeMonth(1)}>Next</Link>
        </div>
      </div>
    );
  }

  render() {
    let calendars = [];
    for (
      let month_index = 0;
      month_index <= (this.state.full_mode ? 11 : 3);
      month_index++
    ) {
      calendars.push(
        <ListingMonthCalendar
          calendar_data={this.state.unavailable_calendar}
          room_id={this.props.room_id}
          month_index={month_index}
          current_month={dateFns.addMonths(
            this.state.current_date,
            month_index
          )}
          key={month_index}
        />
      );
    }

    return (
      <div className="ld_calendar ">
        {this.renderHeader()}
        <div className="row">{calendars}</div>
      </div>
    );
  }
}

export default ListingFullCalendar;
