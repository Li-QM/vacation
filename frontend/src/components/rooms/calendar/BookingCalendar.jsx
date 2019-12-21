import React from "react";
import Utils from 'shared/Utils';
import * as dateFns from "date-fns";

class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      start_date: null,
      end_date: null,
      hover_able: false
    };
    this.onDateClick = this.onDateClick.bind(this);
    this.onHoverDate = this.onHoverDate.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.resetDateRange = this.resetDateRange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleEdit(type, index, value) {
    this.props.parentHandleEdit(type, index, value);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("componenet will receive props");
    // console.log(nextProps);
  }
  componentDidMount() {
    this.props.resetDateRange(this.resetDateRange);
  }
  resetDateRange() {
    this.setState({
      start_date: null,
      end_date: null,
      selectedDate: new Date()
    });
  }
  renderHeader() {
    return (
      <div className="wtbcaption">
        <div className="row">
          <div className="button-group d-flex justify-content-between align-items-center">
            <div className="prev d-flex align-items-center">
              <button onClick={this.prevMonth}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 26 32" className="nav__arrow nav__arrow--left" >
                  <path fill="inherit" d="M16.75 0L2.875 13.875.75 16l2.125 2.125L16.75 32h8.5l-16-16 16-16z"></path>
                </svg>
              </button>
            </div>
            <div className="clnd-date">
              <span className="month">
                {Utils._.formatMonth(this.state.currentMonth)}
              </span>
              <span>&nbsp;&nbsp;</span>
              <span className="year">
                {Utils._.formatYear(this.state.currentMonth)}
              </span>
            </div>
            <div className="next d-flex align-items-center">
              <button onClick={this.nextMonth} className="next">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 26 32" className="nav__arrow nav__arrow--right">
                  <path fill="inherit" d="M.75 0l16 16-16 16h8.5l13.875-13.875L25.25 16l-2.125-2.125L9.25 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  onHoverDate(day) {
    // const dateFormat_1 = "yyyy-MM-DD";
    if (
      this.state.start_date &&
      this.state.hover_able &&
      (!this.props.unavailable_dates ||
        !this.props.unavailable_dates.unavailable_dates ||
        this.props.unavailable_dates.unavailable_dates.indexOf(
          Utils._.formatYmdDate(Utils._.subDays(day, 1))
        ) === -1)
    ) {
      this.setState({
        selectedDate: day,
        end_date: day
      });
    }
  }
  renderDays() {
    // const dateFormat = "ddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="wtbhead" key={i}>
          {Utils._.formatWeekDayFormat(dateFns.addDays(startDate, i))}
        </div>
      );
    }
    return (
      <div className="wtbheading">
        <div className="wtbrow">{days}</div>
      </div>
    );
  }
  renderCells() {
    // const dateFormat_1 = "yyyy-MM-DD";
    const { currentMonth, selectedDate } = this.state;
    const monthStart = Utils._.startOfMonth(currentMonth);
    const monthEnd = Utils._.endOfMonth(monthStart);
    const startDate = Utils._.startOfWeek(monthStart);
    const endDate = Utils._.endOfWeek(monthEnd);
    const unavailable = this.props.unavailable_dates;
    const unavailable_dates = unavailable.unavailable_dates;
    const day_types = unavailable.day_types;
    const day_position = unavailable.day_position;
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    let date_count = 0;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = Utils._.formatDay(day);
        const cloneDay = day;

        if (this.props.calendarData === null) continue;

        let class_name = "wtbcell caldt  align-items-center ",
          checkout_class_name = "reservation-color";
        let indexOfDay = -1,
          isBooked = false,
          isCheckinDay = false,
          isCheckoutDay = false,
          isRangeSelected = false,
          isBlockedCheckout = false;
        let editType = 0,
          editIndex = 0,
          editId = 0,
          checkoutType = 0,
          checkoutIndex = 0,
          checkoutId = 0;
        if (unavailable_dates) {
          indexOfDay = unavailable
            ? unavailable_dates.indexOf(Utils._.formatYmdDate(day))
            : -1;
          isBooked = indexOfDay >= 0 ? true : false;
          isCheckinDay =
            isBooked && day_position[indexOfDay] === "checkin" ? true : false;
          isCheckoutDay =
            (isCheckinDay || !isBooked) &&
            unavailable_dates.indexOf(
              Utils._.formatYmdDate(Utils._.subDays(day, 1))
            ) !== -1
              ? true
              : false;
          isBlockedCheckout = isCheckoutDay && day_types[unavailable_dates.indexOf(Utils._.formatYmdDate(Utils._.subDays(day, 1)))] === "blocked";
          isRangeSelected =
            this.state.start_date &&
            this.state.end_date &&
            ((dateFns.isAfter(day, this.state.start_date) &&
              dateFns.isBefore(day, this.state.end_date)) ||
              dateFns.isSameDay(day, this.state.start_date) ||
              dateFns.isSameDay(day, this.state.end_date));
          class_name =
            class_name +
            (!dateFns.isSameMonth(day, monthStart)
              ? "disabled "
              : dateFns.isSameDay(day, selectedDate)
              ? " selected "
              : "");
          if (isBooked) {
            class_name += " booked " + day_types[unavailable_dates.indexOf(Utils._.formatYmdDate(day))];
            class_name += " " + day_position[unavailable_dates.indexOf(Utils._.formatYmdDate(day))];
            // class_name +=isCheckinDay === true?' checkin ' : ' ';
          } else {
            class_name += " editable ";
          }
          class_name += isCheckoutDay === true ? " display-gradient " : " ";

          if (isBlockedCheckout === true) checkout_class_name = "blocked-color";
          class_name += isRangeSelected === true ? " range_selected " : "";

          let reservation_detail = this.props.calendarData.reservation_detail;
          if (reservation_detail) {
            for (let j = 0; j < reservation_detail.length; j++) {
              let start_date = Utils._.parseDateStr(reservation_detail[j].start_date);
              let end_date = Utils._.parseDateStr(reservation_detail[j].end_date);
              if (
                day.getTime() >= start_date.getTime() &&
                day.getTime() < end_date.getTime()
              ) {
                editIndex = j;
                editId = reservation_detail[j].id;
                editType = 2;
              }
              if (day.getTime() === end_date.getTime()) {
                checkoutIndex = j;
                checkoutId = reservation_detail[j].id;
                checkoutType = 2;
              }
            }
          }

          let not_available_dates = this.props.calendarData.not_available_dates;
          if (not_available_dates) {
            for (let j = 0; j < not_available_dates.length; j++) {
              let start_date = Utils._.parseDateStr(not_available_dates[j].start_date);
              let end_date = Utils._.parseDateStr(not_available_dates[j].end_date);
              if (
                day.getTime() >= start_date.getTime() &&
                day.getTime() < end_date.getTime()
              ) {
                editIndex = j;
                editId = not_available_dates[j].id;
                editType = 3;
              }
              if (day.getTime() === end_date.getTime()) {
                checkoutIndex = j;
                checkoutId = not_available_dates[j].id;
                checkoutType = 3;
              }
            }
          }
        }

        days.push(
          <div className={class_name} key={day} onClick={() => this.onDateClick(Utils._.parseDateStr(cloneDay))} onMouseEnter={() => this.onHoverDate(Utils._.parseDateStr(cloneDay))}>
            <span className="number ">{formattedDate}</span>
            {!isCheckoutDay && (
              <div className="sign" onDoubleClick={() => this.handleEdit(editType, editIndex, editId)}>
                <span className={`seasonal_name ${this.props.seasonal_calendar && this.props.seasonal_calendar.seasonal_days && this.props.seasonal_calendar.seasonal_days.indexOf(Utils._.formatYmdDate(day)) !== -1 ? "" : ""}`}>
                {
                  this.props.calendarData &&
                  this.props.calendarData.calendar_data &&
                  this.props.calendarData.calendar_data[date_count] ? (<strong>{this.props.calendarData.calendar_data[date_count].seasonal_name}</strong>) : ("")
                }
                </span>
                <span className={`seasonal ${this.props.seasonal_calendar && this.props.seasonal_calendar.seasonal_days && this.props.seasonal_calendar.seasonal_days.indexOf(Utils._.formatYmdDate(day)) !== -1 ? "" : ""}`}>
                {
                  this.props.calendarData &&
                  this.props.calendarData.calendar_data &&
                  this.props.calendarData.calendar_data[date_count] ? (
                    <strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.calendarData.calendar_data[
                            date_count
                          ].price_symbol
                        }}
                      ></span>
                      {this.props.calendarData.calendar_data[date_count].price}
                    </strong>
                  ) : (
                    ""
                  )
                }
                </span>
              </div>
            )}
            {
              isCheckoutDay && (
              <div className={`${checkout_class_name} checkout-sign`} onDoubleClick={() => this.handleEdit(checkoutType, checkoutIndex, checkoutId)}>
                <span className={`seasonal_name ${this.props.seasonal_calendar && this.props.seasonal_calendar.seasonal_days && this.props.seasonal_calendar.seasonal_days.indexOf(Utils._.formatYmdDate(Utils._.subDays(day, 1))) !== -1 ? "" : ""}`}>
                  {this.props.calendarData &&
                  this.props.calendarData.calendar_data &&
                  this.props.calendarData.calendar_data[date_count] ? (
                    <strong>
                      {
                        this.props.calendarData.calendar_data[date_count]
                          .prev_seasonal
                      }
                    </strong>
                  ) : (
                    ""
                  )}
                </span>
                {!isBlockedCheckout && (
                  <span
                    className={`seasonal ${
                      this.props.seasonal_calendar &&
                      this.props.seasonal_calendar.seasonal_days &&
                      this.props.seasonal_calendar.seasonal_days.indexOf(
                        Utils._.formatYmdDate(Utils._.subDays(day, 1))
                      ) !== -1
                        ? ""
                        : ""
                    }`}
                  >
                    {/* {this.props.calendarData && this.props.calendarData.calendar_data && this.props.calendarData.calendar_data[date_count] ? <strong><span dangerouslySetInnerHTML={{ __html: this.props.calendarData.calendar_data[date_count].price_symbol }}></span>{this.props.calendarData.calendar_data[date_count].prev_price}</strong> : ''} */}
                  </span>
                )}
              </div>
            )}
            {isCheckinDay && isCheckoutDay && (
              <div
                className="checkin-sign"
                onDoubleClick={() =>
                  this.handleEdit(editType, editIndex, editId)
                }
              >
                <span
                  className={`seasonal_name ${
                    this.props.seasonal_calendar &&
                    this.props.seasonal_calendar.seasonal_days &&
                    this.props.seasonal_calendar.seasonal_days.indexOf(
                      Utils._.formatYmdDate(day)
                    ) !== -1
                      ? ""
                      : ""
                  }`}
                >
                  {this.props.calendarData &&
                  this.props.calendarData.calendar_data &&
                  this.props.calendarData.calendar_data[date_count] ? (
                    <strong>
                      {
                        this.props.calendarData.calendar_data[date_count]
                          .seasonal_name
                      }
                    </strong>
                  ) : (
                    ""
                  )}
                </span>

                <span
                  className={`seasonal ${
                    this.props.seasonal_calendar &&
                    this.props.seasonal_calendar.seasonal_days &&
                    this.props.seasonal_calendar.seasonal_days.indexOf(
                      Utils._.formatYmdDate(day)
                    ) !== -1
                      ? ""
                      : ""
                  }`}
                >
                  {this.props.calendarData &&
                  this.props.calendarData.calendar_data &&
                  this.props.calendarData.calendar_data[date_count] ? (
                    <strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.calendarData.calendar_data[
                            date_count
                          ].price_symbol
                        }}
                      ></span>
                      {this.props.calendarData.calendar_data[date_count].price}
                    </strong>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            )}
            {!isBooked && (
              <span
                className={`daily-price ${
                  this.props.seasonal_calendar &&
                  this.props.seasonal_calendar.seasonal_days &&
                  this.props.seasonal_calendar.seasonal_days.indexOf(
                    Utils._.formatYmdDate(day)
                  ) !== -1
                    ? ""
                    : ""
                }`}
              >
                {this.props.calendarData &&
                this.props.calendarData.calendar_data &&
                this.props.calendarData.calendar_data[date_count] ? (
                  <strong>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.props.calendarData.calendar_data[
                          date_count
                        ].price_symbol
                      }}
                    ></span>
                    {this.props.calendarData.calendar_data[date_count].price}
                  </strong>
                ) : (
                  ""
                )}
              </span>
            )}
          </div>
        );
        day = dateFns.addDays(day, 1);
        date_count++;
      }
      rows.push(
        <div className="wtbrow " key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="wtbbody">{rows}</div>;
  }
  onDateClick(day) {
    if (
      this.props.unavailable_dates &&
      this.props.unavailable_dates.unavailable_dates &&
      this.props.unavailable_dates.unavailable_dates.indexOf(
        Utils._.formatYmdDate(day)
      ) !== -1
    ) {
    } else {
    }

    if (!this.state.start_date || !this.state.hover_able) {
      this.setState({
        selectedDate: day,
        end_date: null,
        start_date: day,
        hover_able: true
      });
    } else {
      if (dateFns.isSameDay(day, this.state.start_date)) {
        this.setState({
          selectedDate: null,
          end_date: null,
          start_date: null,
          hover_able: true
        });
        return;
      }
      if (dateFns.isAfter(day, this.state.start_date)) {
        this.setState({
          selectedDate: day,
          end_date: day,
          hover_able: false
        });
        this.props.onSelectedRange(this.state.start_date, this.state.end_date);
      } else {
        this.setState({
          selectedDate: day,
          end_date: null,
          start_date: day,
          hover_able: true
        });
      }
    }
  }
  nextMonth() {
    this.setState(
      {
        currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
      },
      () => {
        this.props.updateCurrentMonth(this.state.currentMonth);
      }
    );
  }
  prevMonth() {
    this.setState(
      {
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
      },
      () => {
        this.props.updateCurrentMonth(this.state.currentMonth);
      }
    );
  }
  render() {
    return (
      <div className="month-container">
        <div className="calendar-wrap-sm">
          <div className="wtb-sm">
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells()}
          </div>
        </div>
      </div>
    );
  }
}
export default BookingCalendar;
 