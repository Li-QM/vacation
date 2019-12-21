import * as dateFns from "date-fns";
import moment from 'moment';

const dateFormat1 = "YYYY-MM-DD";
const dateFormat = "MM/DD/yyyy";

class Utils {
  static _ = Utils._ == null ? new Utils() : this._

  // date string to date as MM/DD/yyyy.
  parseDateStr(dateStr) {
    return dateFns.parse(dateStr, dateFormat, new Date())
  }

  formatDate(date) {
    return dateFns.format(date, dateFormat);
  }

  // date string to date as yyyy-MM-DD.
  parseYmdDateStr(dateStr) {
    return dateFns.parse(dateStr, dateFormat1, new Date())
  }
  
  formatYmdDate(date) {
    return dateFns.format(date, dateFormat1);
  }

  formatDay(date) {
    return dateFns.format(date, 'D');
  }

  formatMonth(date) {
    return dateFns.format(date, 'MMM');
  }

  formatYear(date) {
    return dateFns.format(date, 'YYYY');
  }

  formatWeekDayFormat(date) {
    return dateFns.format(date, 'ddd');
  }

  // date to formated date string.
  momentUtcFormatDate(date) {
    return moment.utc(date).format(dateFormat)
  }

  startOfMonth(date) {
    return dateFns.startOfMonth(date)
  }

  endOfMonth(date) {
    return dateFns.endOfMonth(date)
  }

  startOfWeek(date) {
    return dateFns.startOfWeek(date)
  }

  endOfWeek(date) {
    return dateFns.endOfWeek(date)
  }

  subDays(date, days) {
    return dateFns.subDays(date, days);
  }
}

export default Utils;
