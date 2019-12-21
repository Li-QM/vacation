import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import DatePicker from "react-datepicker";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import dateFns from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import BookingCalendar from 'components/rooms/calendar/BookingCalendar';
import RatePanel from 'components/rooms/calendar/RatePanel';
import ManageRoomHeader from "components/rooms/ManageRoomHeader";
import {roomsService} from 'services/rooms';
import {alertService} from 'services/alert';

import Utils from 'shared/Utils';

import 'react-datepicker/dist/react-datepicker.css';
import 'assets/styles/rooms/room_calendar.scss';

class RoomCalendar extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      open_modal: false,
      open_export_modal: false,
      open_import_modal: false,

      edit_reservation: false,
      edit_reservation_index: false,
      edit_season: false,
      edit_season_index: false,
      edit_blocked: false,
      edit_blocked_index: false,
      edit_daily: false,
      edit_daily_index: false,

      edit_reservation_id: null,
      edit_season_id: null,
      edit_blocked_id: null,
      edit_prices_id: null,

      startDate: new Date(),
      endDate: new Date(),
      reservation_name: '',
      reservation_price: 0,
      reservation_guests: 1,
      reservation_notes: '',
      // ---------------- : '',
      seasonal_name: '',
      seasonal_price: 0,
      seasonal_guests: 1,
      seasonal_week: 0,
      seasonal_month: 0,
      seasonal_weekend: 0,
      seasonal_minimum_stay: 0,
      // ----------------- : '',
      unavailable_name: '',

      daily_price: 0,

      room_id: null,
      unavailable_dates: {},
      month_calendar_data: {},

      //=========ical state
      ical_name: '',
      ical_url: '',
      currentMonth: new Date(),

      //========= yes no modal
      open_yesno_mdl: false,
      alert_title: '',
      alert_content: '',
      alert_type: '',
      alert_index: null,
      alert_value: null,
      on_removing: false,

      on_saving: false,
    }
    this.onSelectedRange = this.onSelectedRange.bind(this)
    this.openReservationModal = this.openReservationModal.bind(this)
    this.closeReservationModal = this.closeReservationModal.bind(this)
    this.handleStartDatePickerChange = this.handleStartDatePickerChange.bind(this)
    this.handleEndDatePickerChange = this.handleEndDatePickerChange.bind(this)
    this.handleChangeModal = this.handleChangeModal.bind(this)

    this.handleBookingBlocked = this.handleBookingBlocked.bind(this)
    this.handleBookingReservation = this.handleBookingReservation.bind(this)
    this.handleBookingSeasonal = this.handleBookingSeasonal.bind(this)

    this.handleExportCalendar = this.handleExportCalendar.bind(this)
    this.handleImportCalendar = this.handleImportCalendar.bind(this)
    this.handeImportCalendarAction = this.handeImportCalendarAction.bind(this)

    this.bookingCalendarInit = this.bookingCalendarInit.bind(this)

    //
    this.handleEditSeasonal = this.handleEditSeasonal.bind(this)
    this.handleRemoveSeasonal = this.handleRemoveSeasonal.bind(this)
    this.handleEditReservation = this.handleEditReservation.bind(this)
    this.handleRemoveReservation = this.handleRemoveReservation.bind(this)
    this.handleEditBlocked = this.handleEditBlocked.bind(this)
    this.handleRemoveBlocked = this.handleRemoveBlocked.bind(this)

    this.handleRemoveModal = this.handleRemoveModal.bind(this)
  }

	componentDidMount () {
    this.bookingCalendarInit();
	}
	
  bookingCalendarInit () {
    const room_id = this.props.match.params.room_id;

    roomsService.getUnAvailableCalendar(room_id).then(res => {
      if (res) {
        this.setState({unavailable_dates: res});
      } else {
        alertService.showError('Get unavailable calendar');
      }
    });

    roomsService.getSeasonalCalendar(room_id).then(res => {
      if (res) {
        this.setState({seasonal_calendar: res});
      } else {
        alertService.showError('Get seasonal calendar');
      }
    });

    const year = dateFns.getYear(this.state.currentMonth);
    const month = dateFns.getMonth(this.state.currentMonth) + 1;

    roomsService.getCalendarData(room_id, year, month).then(res => {
      if (res) {
        this.setState({month_calendar_data: res});
      } else {
        alertService.showError('Get calendar data');
      }
    });
    // roomsService.getUnAvailableCalendar(room_id, year, month).then(res => {
    //   // this.setState({daily_calendar: res});
    // });
  }
  handleExportCalendar () {
    this.setState({
      open_export_modal: true
    })
  }
  handleImportCalendar () {
    this.setState({
      open_import_modal: true
    })
  }
  handeImportCalendarAction (e) {
    e.preventDefault()

    const room_id = this.props.match.params.room_id;
    const req = {
      url: this.state.ical_url, 
      name: this.state.ical_name,
      req_type: 'check'
    }
    roomsService.importCalendar(room_id, req).then(res => {
      if (res) {
        this.setState({
          open_import_modal: false
        });
        this.bookingCalendarInit();
        alertService.showSuccess('iCal Imported');
      } else {
        alertService.showError('iCal Imported');
      }
    });
  }

  handleBookingBlocked (e) {
    this.setSaveStatus();
    e.preventDefault();

    const room_id = this.props.match.params.room_id;
    let data = {};
    if (this.state.edit_blocked) {
      let blocked_data = this.state.month_calendar_data.not_available_dates[this.state.edit_blocked_index];

      blocked_data.seasonal_name = 
        blocked_data.seasonal_name === '' || 
        blocked_data.seasonal_name === undefined || 
        blocked_data.seasonal_name === null ? 
        "no name" : 
        blocked_data.seasonal_name;

      data = {
        room_id: this.props.match.params.room_id,
        reserveid: blocked_data.reserveid,
        reservation_id: this.state.edit_blocked_id,
        edit_seasonal_name: blocked_data.seasonal_name,
        start_date: Utils._.formatYmdDate(this.state.startDate),
        end_date: Utils._.formatYmdDate(this.state.endDate),
        seasonal_name: this.state.unavailable_name
      };
    }
    else {
      data = {
        room_id: this.props.match.params.room_id,
        reservation_id: 0,
        reserveid: 0,
        edit_seasonal_name: '',
        start_date: Utils._.formatYmdDate(this.state.startDate),
        end_date: Utils._.formatYmdDate(this.state.endDate),
        seasonal_name: this.state.unavailable_name
      };
    }

    roomsService.saveUnavailableDates(room_id, {data}).then(res => {
      if (res && res.success === 'true') {
        this.closeReservationModal();
        this.bookingCalendarInit();
        alertService.showSuccess('Save Booking Blocked', 'Successfully!');
      }
      else {
        let error_message = "";
        Object.keys(res.errors).map((key, index) => {
          return (error_message += res.errors[key] + '<br>');
        })
        alertService.showError('Save Booking Blocked', 'Not Success!');
      }
      this.clearSaveStatus();
    }).catch(() => {
      alertService.showError('Save Booking Blocked', 'Not Success!');
      this.clearSaveStatus();
    });
  }

  handleBookingReservation (e) {
    this.setSaveStatus();
    e.preventDefault();

    const room_id = this.props.match.params.room_id;
    let data = {};

    if (this.state.edit_reservation) {
      let reservation_data = this.state.month_calendar_data.reservation_detail[this.state.edit_reservation_index];
      reservation_data.seasonal_name = 
        reservation_data.seasonal_name === '' || 
        reservation_data.seasonal_name === undefined || 
        reservation_data.seasonal_name === null ? 
        "no name" : 
        reservation_data.seasonal_name;
      
      data = {
        start_date: Utils._.formatYmdDate(this.state.startDate),
        end_date: Utils._.formatYmdDate(this.state.endDate),
        seasonal_name: this.state.reservation_name,
        edit_seasonal_name: reservation_data.seasonal_name,
        notes: this.state.reservation_notes,
        reservation_source: 'Calendar',
        price: this.state.reservation_price ? this.state.reservation_price : 0,
        guests: this.state.reservation_guests ? this.state.reservation_guests : 0,
        reservation_id: this.state.edit_reservation_id,
        reserveid: reservation_data.reserveid,
      };
    }
    else {
      data = {
        start_date: Utils._.formatYmdDate(this.state.startDate),
        reservation_id: 0,
        reserveid: 0,
        end_date: Utils._.formatYmdDate(this.state.endDate),
        seasonal_name: this.state.reservation_name,
        edit_seasonal_name: '',
        notes: this.state.reservation_notes,
        reservation_source: 'Calendar',
        price: this.state.reservation_price !== '' ? this.state.reservation_price : 0,
        guests: this.state.reservation_guests !== '' ? this.state.reservation_guests : 0
      };
    }

    roomsService.saveReservation(room_id, data).then(res => {
      if (res && res.success === 'true') {
        this.closeReservationModal();
        this.bookingCalendarInit();
        alertService.showSuccess('Save Reservation', 'Successfully!');
      }
      else {
        let error_message = "";
        Object.keys(res.errors).map((key, index) => {
          return (error_message += res.errors[key] + '<br>');
        });
        alertService.showError('Save Reservation', 'Not Success!');
      }
      this.clearSaveStatus();
    }).catch(() => {
      alertService.showError('Save Reservation', 'Not Success!');
      this.clearSaveStatus();
    });
  }

  handleBookingSeasonal (e) {
    this.setSaveStatus();
    e.preventDefault();

    const room_id = this.props.match.params.room_id;
    let data = {};

    if (this.state.edit_season) {
      let seasonal_data = this.state.month_calendar_data.seasonal_price_detail[this.state.edit_season_index];
      seasonal_data.seasonal_name = 
        seasonal_data.seasonal_name === '' || 
        seasonal_data.seasonal_name === undefined || 
        seasonal_data.seasonal_name === null ? 
        "no name" : 
        seasonal_data.seasonal_name;

      data = {
        guests: this.state.seasonal_guests,
        created_at: seasonal_data.created_at,
        updated_at: seasonal_data.updated_at,
        id: this.state.edit_season_id,
        notes: null,
        room_id: this.props.match.params.room_id,
        rateId: seasonal_data.rateId,
        edit_seasonal_name: seasonal_data.seasonal_name,
        additional_guest: this.state.seasonal_guests,
        week: this.state.seasonal_week !== '' ? this.state.seasonal_week : 0,
        month: this.state.seasonal_month !== '' ? this.state.seasonal_month : 0,
        weekend: this.state.seasonal_weekend !== '' ? this.state.seasonal_weekend : 0,
        seasonal_name: this.state.seasonal_name,
        price: this.state.seasonal_price !== '' ? this.state.seasonal_price : 0,
        minimum_stay: this.state.seasonal_minimum_stay !== '' ? this.state.seasonal_minimum_stay : 0,
        start_date: Utils._.formatYmdDate(this.state.startDate),
        end_date: Utils._.formatYmdDate(this.state.endDate),
      };
    }
    else {
      data = {
        room_id: this.props.match.params.room_id,
        edit_seasonal_name: this.state.seasonal_name,
        additional_guest: this.state.seasonal_guests,
        rateId: 0,
        id: 0,
        week: this.state.seasonal_week,
        month: this.state.seasonal_month,
        weekend: this.state.seasonal_weekend,
        seasonal_name: this.state.seasonal_name,
        price: this.state.seasonal_price,
        minimum_stay: this.state.seasonal_minimum_stay,
        start_date: Utils._.formatYmdDate(this.state.startDate),
        end_date: Utils._.formatYmdDate(this.state.endDate),
      };
    }

    roomsService.saveSeasonalPrice(room_id, {data}).then(res => {
      if (res && res.success === 'true') {
        this.closeReservationModal();
        this.bookingCalendarInit();
       alertService.showSuccess('Save Seasnal Prices', 'Successfully!');
      } else {
        let error_message = "";
        Object.keys(res.errors).map((key, index) => {
          return (error_message += res.errors[key] + '<br>');
        })
        alertService.showError('Save Seasnal Prices', 'Not Success!');
      }
      this.clearSaveStatus();
    }).catch(error => {
      alertService.showError('Save Seasnal Prices', 'Not Success!');
      this.clearSaveStatus();
    });

  }
  handleStartDatePickerChange (date) {
    this.setState({
      startDate: date
    });
  }
  handleEndDatePickerChange (date) {
    this.setState({
      endDate: date
    });
  }

  onSelectedRange (start_date, end_date) {
    this.setState({
      startDate: start_date,
      endDate: end_date
    })
    this.openReservationModal();
  }

  openReservationModal () {
    this.setState({ open_modal: true });
  }
  closeReservationModal () {
    this.setState({
      open_modal: false,
      edit_season: false,
      edit_blocked: false,
      edit_reservation: false,
      tabIndex: 0
    }, () => {
      this.resetHandler()
    })
  }

  handleChangeModal (e) {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleEditSeasonal (index, value) {
    let seasonal_data = this.state.month_calendar_data.seasonal_price_detail[index];
    this.setState({
      startDate: Utils._.parseDateStr(seasonal_data.start_date),
      endDate: Utils._.parseDateStr(seasonal_data.end_date),
      edit_season: true,
      edit_season_index: index,
      edit_season_id: value,
      open_modal: true,
      tabIndex: 1,

      seasonal_name: seasonal_data.seasonal_name,
      seasonal_price: seasonal_data.price,
      seasonal_guests: seasonal_data.guests,
      seasonal_week: seasonal_data.week,
      seasonal_month: seasonal_data.month,
      seasonal_weekend: seasonal_data.weekend,
      seasonal_minimum_stay: seasonal_data.minimum_stay,
    });
  }
  handleRemoveSeasonal (index, value) {
    const room_id = this.props.match.params.room_id;
    roomsService.deleteSeasonalPrice(room_id, {seasonal_id: value}).then(res => {
      if (res && res.status === 'success') {
        alertService.showSuccess("Remove Seasonal", "Successfully!");
        this.bookingCalendarInit();
      } else {
        alertService.showError("Remove Seasonal", "Not Success!");
      }
      this.closeRemoveModal();
    }).catch(error => {
      this.closeRemoveModal();
      alertService.showError("Remove Seasonal", "Not Success!");
    });
  }

  handleRemoveBlocked (index, value) {
    const room_id = this.props.match.params.room_id;
    const blocked_data = this.state.month_calendar_data.not_available_dates[index];
    const data = {
      season_name: blocked_data.seasonal_name,
      reservation_id: blocked_data.id,
      reserveid: blocked_data.reserveid,
      start_date: blocked_data.start_date,
      end_date: blocked_data.end_date
    };

    roomsService.deleteUnavailableDays(room_id, data).then(res => {
      if (res.success === 'true') {
        alertService.showSuccess("Remove Blocked", "Successfully!");
        this.bookingCalendarInit();
      } else {
        alertService.showError("Remove Blocked", "Not Success!");
      }
      this.closeRemoveModal();
    }).catch(error => {
      this.closeRemoveModal();
      alertService.showError("Remove Blocked", "Not Success!");
    });
  }
  handleEditBlocked (index, value) {
    let blocked_data = this.state.month_calendar_data.not_available_dates[index]
    this.setState({
      tabIndex: 2,
      open_modal: true,
      unavailable_name: blocked_data.seasonal_name,
      edit_blocked: true,
      edit_blocked_index: index,
      edit_blocked_id: value,
      reserveid: blocked_data.reserveid,
      reservation_id: blocked_data.reservation_id,
      startDate: Utils._.parseDateStr(blocked_data.start_date),
      endDate: Utils._.parseDateStr(blocked_data.end_date),
    })
  }

  handleRemoveReservation (index, value) {
    const room_id = this.props.match.params.room_id;
    const reservation_data = this.state.month_calendar_data.reservation_detail[index];
    const data = {
      season_name: reservation_data.seasonal_name,
      reservation_id: reservation_data.id,
      reserveid: reservation_data.reserveid,
      start_date: reservation_data.start_date,
      end_date: reservation_data.end_date
    };

    roomsService.deleteReservation(room_id, data).then(res => {
      if (res.success === true) {
        alertService.showSuccess("Remove Reservation", "Successfully!");
        this.bookingCalendarInit();
      } else {
        alertService.showError("Remove Reservation", "Not Success!");
      }
      this.closeRemoveModal();
    }).catch(error => {
      this.closeRemoveModal();
      alertService.showError("Remove Reservation", "Not Success!");
    });
  }
  handleEditReservation (index, value) {
    let reservation_data = this.state.month_calendar_data.reservation_detail[index]
    this.setState({
      reservation_name: reservation_data.seasonal_name,
      reservation_price: reservation_data.price,
      reservation_guests: reservation_data.guests,
      reservation_notes: reservation_data.notes,
      reserveid: reservation_data.reserveid,
      startDate: Utils._.parseDateStr(reservation_data.start_date),
      endDate: Utils._.parseDateStr(reservation_data.end_date),
      edit_reservation: true,
      open_modal: true,
      tabIndex: 0,
      edit_reservation_id: value,
      edit_reservation_index: index
    });
  }

  closeRemoveModal() {
    this.setState({
      open_yesno_mdl: false,
      on_removing: false
    });
  }
  setRemoveStatus() {
    this.setState({on_removing: true});
  }
  setSaveStatus() {
    this.setState({on_saving: true});
  }
  clearSaveStatus() {
    this.setState({on_saving: false});
  }
  handleRemove () {
    if (this.state.alert_type === 1) {
      this.handleRemoveSeasonal(this.state.alert_index, this.state.alert_value);
    }
    else if (this.state.alert_type === 2) {
      this.handleRemoveReservation(this.state.alert_index, this.state.alert_value);
    }
    else if (this.state.alert_type === 3) {
      this.handleRemoveBlocked(this.state.alert_index, this.state.alert_value);
    }
    this.setRemoveStatus();
  }
  handleRemoveModal(type, index, value) {
    let alert_title = 0;
    let alert_content = '';
    switch (type) {
      case 1:
        alert_title = 'Seasonal';
        alert_content = 'Would you like to remove this Seasonal?';
        break;
      case 2:
        alert_title = 'Reservation';
        alert_content = 'Would you like to remove this Reservation?';
        break;
      case 3:
        alert_title = 'Blocked';
        alert_content = 'Would you like to remove this Blocked?';
        break;
      default:
        break;
    }
    this.setState({ 
      open_yesno_mdl: true,
      alert_title: alert_title,
      alert_content: alert_content,
      alert_type: type,
      alert_index: index,
      alert_value: value,
      on_removing: false
    });
  }
  handleEdit (type, index, value) {
    if (type === 1) {
      this.handleEditSeasonal(index, value);
    }
    else if (type === 2) {
      this.handleEditReservation(index, value);
    }
    else if (type === 3) {
      this.handleEditBlocked(index, value);
    }
  }
  render () {
    let { month_calendar_data } = this.state;
    const seasonal_columns = [
      {
        Header: 'Name',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'seasonal_name', // String-based value accessors!,
        minWidth: 150,
        Cell: props => <div className="w-100">
          <div className="row col-md-12">
            <strong className="mx-auto">{props.value}</strong> </div>
          <div className="row col-md-12"><span className="mx-auto">({Utils._.momentUtcFormatDate(props.original.start_date)} - {Utils._.momentUtcFormatDate(props.original.end_date)})</span></div>
        </div>
      }, {
        Header: 'Nightly',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'price',
        Cell: props => <span className='text-center'>{month_calendar_data && month_calendar_data.rooms_price ? <span dangerouslySetInnerHTML={{ __html: month_calendar_data.rooms_price.currency.symbol }}></span> : '$'}<strong>{props.value}</strong></span> // Custom cell components!
      }, {
        Header: 'Weekly',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'week',
        Cell: props => <span className='text-center'>{month_calendar_data && month_calendar_data.rooms_price ? <span dangerouslySetInnerHTML={{ __html: month_calendar_data.rooms_price.currency.symbol }}></span> : '$'}<strong>{props.value}</strong></span> // Custom cell components!
      }, {
        Header: 'Monthly',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'month',
        Cell: props => <span className='text-center'>{month_calendar_data && month_calendar_data.rooms_price ? <span dangerouslySetInnerHTML={{ __html: month_calendar_data.rooms_price.currency.symbol }}></span> : '$'}<strong>{props.value}</strong></span> // Custom cell components!
      }, {
        Header: 'Min. Stay',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'minimum_stay',
        Cell: props => <span className='text-center'> <strong>{props.value}</strong>Nights</span> // Custom cell components!
      }, {
        Header: 'Action',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'id',
        Cell: props => {
          return <div>
            <Link to="#" className="table_edit" onClick={() => this.handleEditSeasonal(props.index, props.value)}><i className="fa fa-edit"></i></Link>
            <Link to="#" className="delete_details delete_seasonal" onClick={() => this.handleRemoveSeasonal(props.index, props.value)}><i className="fa fa-trash"></i></Link>
          </div>
        }
      }
    ];
    const blocked_columns = [
      {
        Header: 'Date Name',
        minWidth: 300,
        accessor: 'seasonal_name',
        Cell: props => <div className="w-100">
          <div className="row col-md-12">
            <strong className="mx-auto">{props.value}</strong> </div>
          <div className="row col-md-12"><span className="mx-auto">({Utils._.momentUtcFormatDate(props.original.start_date)} - {Utils._.momentUtcFormatDate(props.original.end_date)})</span></div>
        </div>
      },
      {
        Header: 'Action',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'id',
        Cell: props => <div>
          {/* <Link to="#" className="table_edit" onClick={() => this.handleEditBlocked(props.index, props.value)}><i className="fa fa-edit"></i></Link> */}
          {/* <Link to="#" className="delete_details delete_seasonal" onClick={() => this.handleRemoveBlocked(props.index, props.value)}><i className="fa fa-trash"></i></Link> */}
        </div>
      }
    ]
    const reservation_columns = [
      {
        Header: 'Name',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'seasonal_name',
        minWidth: 150,
        Cell: props => <div className="w-100">
          <div className="row col-md-12">
            <strong className="mx-auto">{props.value}</strong> </div>
          <div className="row col-md-12"><span className="mx-auto">({Utils._.momentUtcFormatDate(props.original.start_date)}-{Utils._.momentUtcFormatDate(props.original.end_date)})</span></div>
        </div>
      },
      {
        Header: 'Price',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'price',
        Cell: props => <span className='text-center'>{month_calendar_data && month_calendar_data.rooms_price ? <span dangerouslySetInnerHTML={{ __html: month_calendar_data.rooms_price.currency.symbol }}></span> : '$'}<strong>{props.value}</strong></span> // Custom cell components!
      },
      {
        Header: 'Guests',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'guests'
      },
      {
        Header: 'Nights',
        style: { width: '100%', textAlign: 'center' },
        maxWidth: 150,
        accessor: 'duration'
      },

      {
        Header: 'Action',
        style: { width: '100%', textAlign: 'center' },
        accessor: 'id',
        Cell: props => <div>
          <Link to="#" className="table_edit" onClick={() => this.handleEditReservation(props.index, props.value)}><i className="fa fa-edit"></i></Link>
          <Link to="#" className="delete_details delete_seasonal" onClick={() => this.handleRemoveReservation(props.index, props.value)}><i className="fa fa-trash"></i></Link>
        </div>
      }

		]
		
		const import_calendar_modal = (
			<Modal
				open={this.state.open_import_modal}
				styles={{ modal: { padding: '0px' } }}
				onClose={() => { this.setState({ open_import_modal: false }) }}>
				<div className="panel import-calendar">
					<div className="panel-header">
						<span>Import a New Calendar</span>
						<Link to="#" data-behavior="modal-close" className="modal-close" onClick={() => { this.setState({ open_import_modal: false }) }}>
						</Link>
					</div>
					<div className="panel-body">
						<p style={{ marginBottom: '20px' }}>
							<span>Import other calendars you use and we’ll automatically keep this listing’s availability up-to-date.</span>
						</p>
						<form method="POST" onSubmit={this.handeImportCalendarAction} acceptCharset="UTF-8" name="export" id="feed_import_form" className="ng-pristine ng-valid">
							<div className="content">
                <label style={{ marginBottom: '20px' }}>
                  <p style={{ marginBottom: '10px' }} className="label">
                    <span>Calendar Address (URL)</span>
                  </p>
                  <input type="text" name="ical_url" value={this.state.ical_url} onChange={this.handleChangeModal} placeholder="Paste calendar address (URL) here" className="space-1 " />
                  <span className="text-danger" />
                </label>
                <label style={{ marginBottom: 0 }}>
                  <p style={{ marginBottom: '10px' }} className="label">
                    <span>Name Your Calendar</span>
                  </p>
                  <input type="text" name="ical_name" value={this.state.ical_name} onChange={this.handleChangeModal} placeholder="Custom name for this calendar" className="space-1 " />
                  <span className="text-danger" />
                </label>
              </div>
              
							<div className="d-inline-block" style={{ marginTop: '20px' }}>
								<button id="feed_import_btn" data-prevent-default="true" className="btn btn-primary" ng-disabled="export.$invalid">
									<span>Import Calendar</span>
								</button>
							</div>
						</form>
					</div>
					<div className="loading global-ajax-form-loader" style={{ visibility: 'hidden' }} />
				</div>
			</Modal>
		)

		const export_calendar_modal = (
			<Modal
				open={this.state.open_export_modal}
				styles={{ modal: { padding: '0px' } }}
				onClose={() => { this.setState({ open_export_modal: false }) }}
			>
				<div className="export-calendar panel">
					<div className="panel-header">
						<span>Export Calendar</span>
						<Link data-behavior="modal-close" className="modal-close" to="#" onClick={() => { this.setState({ open_export_modal: false }) }}>
						</Link>
					</div>
					<div className="panel-body">
						<p>
							<span>Copy and paste the link into other ICAL applications</span>
						</p>
						<input type="text" defaultValue={`${window.location.origin}/calendar/ical/${this.props.match.params.room_id}`} readOnly />
					</div>
				</div>
			</Modal>
		)

		const reservation_modal = (
			<Modal
				open={this.state.open_modal}
				styles={{ modal: { padding: '0px' }}}
        className="reservation-modal"
				onClose={() => this.closeReservationModal()}
			>
				<Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
					<TabList className="tabs tabba form-tab-header">
						<h3 className="ml-0">
							Calendar Settings
            </h3>
						<Tab className="tab-item text-lead h5 mylists">Reservation</Tab>
						<Tab className="tab-item text-lead h5 mylists">Seasonal Rates</Tab>
						<Tab className="tab-item text-lead h5 mylists">Blocked</Tab>

					</TabList>
					<TabPanel>
						<div className="seasonal_price">
							<form id="reservation_form_t" data-mode="create" className=" " noValidate="novalidate" onSubmit={this.handleBookingReservation}>
								<div className="ses_time datepicker-wrapper">
									<div className="col-md-6 col-sm-6 col-6 ses_pop row">
										<label className="h6 my-auto">Check in</label>
										<DatePicker
											selected={this.state.startDate}
											onChange={this.handleStartDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1 row">
										<label className="h6 my-auto">Check out </label>
										<DatePicker
											selected={this.state.endDate}
											onChange={this.handleEndDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<span id="check_date_err" className="check_date_err" style={{ display: 'none', color: 'red' }}>Your date is already in another reservation, you can cancel/delete it, select a new range of dates or edit the other reservation.</span>

								</div>
								<div className="ses_time">
									<div className="col-md-12 col-sm-12 col-12 ses_pop1">
										<label className="h6 my-auto">Name   <i rel="tooltip" className="icon icon-question" title="Each reservation name must be unique." /></label>
										<input type="text" id="reservation_name_t" name="reservation_name" value={this.state.reservation_name} onChange={this.handleChangeModal} className="tooltipstered" />
									</div>
									<span id="err_msg" style={{ display: 'none', color: 'red' }}>Reservation name already used</span>
									<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
								</div>
								<div className="ses_time">
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Price </label>
										<div className="pricelist">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="reservation_price_t" name="reservation_price" value={this.state.reservation_price} onChange={this.handleChangeModal} className="  tooltipstered valid " aria-invalid="false" />
										</div>
										<p data-error="price" className="ml-error" />
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Number of Guests <i rel="tooltip" className="icon icon-question" title="Number of guests for the reservation." /></label>
										<div className="pricelist">
											<input type="number" id="reservation_guests_t" name="reservation_guests" value={this.state.reservation_guests} onChange={this.handleChangeModal} className="tooltipstered" />
										</div>
									</div>
								</div>
								<div className="ses_time">
									<div className="col-md-12 col-sm-12 col-12 ses_pop1">
										<label className="h6 my-auto">Note   <i rel="tooltip" className="icon icon-question" title="Add additional notes to your reservation." /></label>
										<textarea id="reservation_note_t" name="reservation_notes" value={this.state.reservation_notes} onChange={this.handleChangeModal} className="tooltipstered" />
									</div>
									<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									<span id="err_msg" style={{ display: 'none', color: 'red' }}>Note required</span>
								</div>
								<div className="btn-group d-flex">
									<div className="col-md-6 col-sm-6 col-6 text-left">
										<Link to="#" className="day_cancel cancel_reservation d-none" id="cancel_reservation_t">Cancel</Link>
									</div>
									<div className="col-md-6 col-sm-6 col-6 d-flex text-right" style={{'alignItems': 'center'}}>
										<button className="day_save" type="submit" id="save_reservation_t" name="save">Save</button>
										<Link to="#" className="day_delete d-none delete_reservation mt-2" id="delete_reservation_t">Delete</Link>
										{
											(this.state.on_saving) ?
											(<div className="spinner-border" role="status"><span className="sr-only">Removing...</span></div>)
											: null
										}
									</div>
								</div>
								<div className="loading global-ajax-form-loader" style={{ visibility: 'hidden' }} />
							</form>
						</div>
					</TabPanel>
					<TabPanel>
						<form id="season_form_t" data-mode="create" className=" " noValidate="novalidate" onSubmit={this.handleBookingSeasonal}>
							<div className="seasonal_price">
								<div className="ses_time datepicker-wrapper">
									<input type="hidden" name="room_id" defaultValue={11475} className="tooltipstered" />
									<div className="col-md-6 col-sm-6 col-6 ses_pop row">
										<label className="h6 my-auto">Start Date </label>
										<DatePicker
											selected={this.state.startDate}
											onChange={this.handleStartDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1 row">
										<label className="h6 my-auto">End Date </label>
										<DatePicker
											selected={this.state.endDate}
											onChange={this.handleEndDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<span id="check_date_err" className="check_date_err" style={{ display: 'none', color: 'red' }}>Your date is already in another season, you can mark it as closed, select a new range of dates or update the other added season.</span>
								</div>
								<div className="ses_time">
									<div className="col-md-12 col-sm-12 col-12 ses_pop1">
										<label className="h6 my-auto">Season Name   <i rel="tooltip" className="icon icon-question" title="Each seasonal name must be unique.  If this is an annual or recurring season, try appending the year to the end of the name (i.e. Summer 2018, Summer 2019, etc" /></label>
										<input type="text" id="season_name_t" name="seasonal_name" value={this.state.seasonal_name} onChange={this.handleChangeModal} className="tooltipstered" />
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<span id="err_msg" style={{ display: 'none', color: 'red' }}>Season name Already used</span>
								</div>
								<div className="ses_time">
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Price </label>
										<div className="pricelist">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="seasonal_price_t" name="seasonal_price" value={this.state.seasonal_price} onChange={this.handleChangeModal} className="tooltipstered" />
										</div>
										<p data-error="price" className="ml-error" />
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Price for extra Guest <i rel="tooltip" className="icon icon-question" title="Extra cost per guest per day" /></label>
										<div className="pricelist">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="seasonal_additional_price_t" name="seasonal_guests" value={this.state.seasonal_guests} onChange={this.handleChangeModal} className="tooltipstered" />

										</div>
									</div>
								</div>
								<div className="ses_time">
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto"> Weekly Price <i rel="tooltip" className="icon icon-question" title="Rate is based on a 7 night stay, each additional night is billed at the standard nightly rate up until the next 7 nights is reached for a single reservation." /></label>
										<div className="pricelist" ng-init="season_data.week=0">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="seasonal_week_t" name="seasonal_week" value={this.state.seasonal_week} onChange={this.handleChangeModal} className="tooltipstered" />
										</div>
										<p data-error="week" className="ml-error" />
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Monthly Price <i rel="tooltip" className="icon icon-question" title="Rate is based on a 30 night stay.  Each additional night is billed at the nightly rate, then weekly rate, until the next 30 nights is reached for a single reservation." /></label>
										<div className="pricelist" ng-init="season_data.month=0">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="seasonal_month_t" name="seasonal_month" value={this.state.seasonal_month} onChange={this.handleChangeModal} className="tooltipstered" />
										</div>
										<p data-error="month" className="ml-error" />
									</div>
								</div>
								<div className="ses_time">
									<div className="col-md-6 col-sm-6 col-6 ses_pop1" >
										<label className="h6 my-auto">Weekend Price <i rel="tooltip" className="icon icon-question" title="Rate charged for weekend reservations.  Please note, if a reservation includes both a weekday & weekend your listing rate will be displayed as an average of the base nightly rate and the weekend rate." /></label>
										<div className="pricelist">
											<div className="price_doller" dangerouslySetInnerHTML={{ __html: this.state.month_calendar_data.rooms_price ? this.state.month_calendar_data.rooms_price.currency.original_symbol : '$' }}></div>
											<input type="text" id="seasonal_weekend_t" name="seasonal_weekend" value={this.state.seasonal_weekend} onChange={this.handleChangeModal} className="tooltipstered" />
										</div>
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1">
										<label className="h6 my-auto">Minimum Stay   <i rel="tooltip" className="icon icon-question" title="Minimum amount of nights required for a reservation" /></label>
										<div className="pricelist">
											<input type="text" id="seasonal_minimum_stay_t" name="seasonal_minimum_stay" value={this.state.seasonal_minimum_stay} onChange={this.handleChangeModal} className="tooltipstered" />
											<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
										</div>
									</div>
								</div>
								<div className="btn-group d-flex">
									<div className="col-md-6 col-sm-6 col-6 text-left">
										<button className={`day_cancel cancel_reservation   d-none `} type="button" id="cancel_season_t">Cancel</button>
									</div>
									<div className="col-md-6 col-sm-6 col-6 d-flex text-right" style={{'align-items': 'center'}}>
										<button className="day_save" type="submit" id="save_season_t" name="save">Save</button>
										<button type="button" className={`    d-none   day_save delete_seasonal mt-2 bg-danger ml-2`} id="delete_season_t">Delete</button>
										{
											(this.state.on_saving) ?
											(<div className="spinner-border" role="status"><span className="sr-only">Removing...</span></div>)
											: null
										}
									</div>
								</div>
								<div className="loading global-ajax-form-loader" style={{ visibility: 'hidden' }} />
							</div>
						</form>
					</TabPanel>

					<TabPanel>
						<form id="unavailable_form_t" data-mode="create" className=" " noValidate="novalidate" onSubmit={this.handleBookingBlocked} >
							<div className="seasonal_price">
								<div className="ses_time datepicker-wrapper">
									<input type="hidden" name="room_id" defaultValue={11475} className="tooltipstered" />
									<div className="col-md-6 col-sm-6 col-6 ses_pop row">
										<label className="h6 my-auto">Start Date </label>
										<DatePicker
											selected={this.state.startDate}
											onChange={this.handleStartDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<div className="col-md-6 col-sm-6 col-6 ses_pop1 row">
										<label className="h6 my-auto">End Date </label>
										<DatePicker
											selected={this.state.endDate}
											onChange={this.handleEndDatePickerChange}
										/>
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<span id="check_date_err" className="check_date_err" style={{ display: 'none', color: 'red' }}>Your date is already in another reservation or blocked date range, you can select a new range of dates or update the other added reservation/blocked date range.</span>
								</div>
								<div className="ses_time">
									<div className="col-md-12 col-sm-12 col-12 ses_pop1">
										<label className="h6 my-auto">Name <i rel="tooltip" className="icon icon-question" title="Each blocked date range must be unique.  Please note:  guests cannot checkin or checkout on the start/end dates of a blocked date range. " /></label>
										<input type="text" id="unavailable_name_t" name="unavailable_name" value={this.state.unavailable_name} onChange={this.handleChangeModal} className="tooltipstered" />
										<div className='col-md-12'> <b className="text-danger">*</b> Required Field</div>
									</div>
									<span id="err_msg" style={{ display: 'none', color: 'red' }}>Season name Already used</span>
								</div>
								<div className="btn-group d-flex">
									<div className="col-md-6 col-sm-6 col-6 text-left">
										<Link to="#" className="day_cancel cancel_reservation d-none" id="cancel_unavailable_t">Cancel</Link>
									</div>
									<div className="col-md-6 col-sm-6 col-6 d-flex text-right" style={{'align-items': 'center'}}>
										<button className="day_save" type="submit" id="save_unavailable_t" name="save">Save</button>
										<Link to="#" className="day_delete d-none delete_not_available mt-2" id="delete_unavailable_t">Delete</Link>
										{
											(this.state.on_saving) ?
											(<div className="spinner-border" role="status"><span className="sr-only">Removing...</span></div>)
											: null
										}
									</div>
								</div>
								<div className="loading global-ajax-form-loader" style={{ visibility: 'hidden' }} />
							</div>
						</form>
					</TabPanel>
				</Tabs>
			</Modal>
		)

		const yes_no_modal = (
			<Modal 
				open={ this.state.open_yesno_mdl } 
				onClose={()=>this.setState({open_yesno_mdl : false})} 
				styles={{ modal : { padding : '0px'} }} 
				center
			>
				<div className="modal-header reservation-remove">
					<h4>{this.state.alert_title}</h4>
				</div>
				<div className="modal-body d-flex reservation-remove">
					<p>{this.state.alert_content}</p>
					{
						(this.state.on_removing) ?
						(<div className="spinner-border" role="status"><span className="sr-only">Removing...</span></div>)
						: null
					}
				</div>
				<div className="modal-footer reservation-remove">
					<button className="btn btn-info btn-cancel" onClick={() => this.setState({open_yesno_mdl : false})}> 
						Cancel 
					</button>
					<button className="btn btn-danger btn-remove" onClick={() => this.handleRemove()}> 
						Remove 
					</button>
				</div>
			</Modal>
		)

    return (
      <div className="room-calendar manage-listing-content-wrapper clearfix">
        {import_calendar_modal}
				{export_calendar_modal}
				{reservation_modal}
				{yes_no_modal}
        <ManageRoomHeader
          title="Listing Availability" 
          descr="Use the calendar below to restrict your listing availability and create custom seasonal pricing for specific dates." 
          />
        <div className="row d-flex m-0" style={{paddingRight: '15px'}}>
          <div className="listing_whole col-md-9" id="js-manage-listing-content">
            <div className="common_listpage">
              <div className="content_right w-100">
                {/* roomId */}
                <Link to={`/rooms/manage/${this.props.match.params.room_id}/terms`} className="right_save" >Next</Link>
                <Link to="#" className="right_save" onClick={this.handleImportCalendar}> Import </Link>
                <Link to="#" className=" right_save_continue" onClick={this.handleExportCalendar}>Export </Link>
                {/* <Link to="/manage/terms" className="right_save_continue" >Next</to> */}
              </div>
              <div >
                <BookingCalendar 
                  parentHandleEdit={this.handleEdit.bind(this)} 
                  resetDateRange={click => this.resetHandler = click} 
                  calendarData={month_calendar_data} 
                  updateCurrentMonth={month => { this.setState({ currentMonth: month }, () => { this.bookingCalendarInit() }) }}
                  seasonal_calendar={this.state.seasonal_calendar} 
                  unavailable_dates={this.state.unavailable_dates}
                  onSelectedRange={(start_date, end_date) => this.onSelectedRange(start_date, end_date)} />
              </div>
            </div>
          </div>
          <div className="col-md-3 import_calander border-left">
            {/* Reservation */}
            <div className="row">
              <div className="p-header-line col-sm-12">
                <FontAwesomeIcon className="book-mark" icon={faBook} />
                <p className="p-title">Reservation </p>
              </div>
              <div className="col-sm-12 p-0">
                <RatePanel
                  data={month_calendar_data && month_calendar_data.reservation_detail ? month_calendar_data.reservation_detail : []}
                  columns={reservation_columns}
                  type={2}
                  handleEdit={this.handleEdit.bind(this)}
                  handleRemove={this.handleRemoveModal.bind(this)}
                  namefield='Name'
                  propertyname='Nights'
                  propertyid='duration'
                />
              </div>
            </div>
            {/* Seasonal Rates */}
            <div className="row">
              <div className="p-header-line col-sm-12">
                <FontAwesomeIcon className="book-mark" icon={faBook} />
                <p className="p-title">Seasonal Rates </p>
              </div>
              <div className="col-sm-12 p-0">
                <RatePanel
                  data={month_calendar_data && month_calendar_data.seasonal_price_detail ? month_calendar_data.seasonal_price_detail : []}
                  columns={seasonal_columns}
                  type={1}
                  handleEdit={this.handleEdit.bind(this)}
                  handleRemove={this.handleRemoveModal.bind(this)}
                  namefield='Seasonal Name'
                  propertyname='Rates'
                  propertyid='price'
                >
                </RatePanel>

              </div>
            </div>
            {/* Blocked */}
            <div className="row">
              <div className="p-header-line col-sm-12">
                <FontAwesomeIcon className="book-mark" icon={faBook} />
                <p className="p-title">Blocked </p>
              </div>
              <div className="col-sm-12 p-0">
                <RatePanel
                  data={month_calendar_data && month_calendar_data.not_available_dates ? month_calendar_data.not_available_dates : []}
                  columns={blocked_columns}
                  type={3}
                  handleRemove={this.handleRemoveModal.bind(this)}
                  handleEdit={this.handleEdit.bind(this)}
                  namefield='Title'
                  propertyname='Days'
                  propertyid='duration'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomCalendar;
