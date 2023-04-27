import moment from 'moment';
import momentTz from 'moment-timezone';
// import timezones from './timezones';

/**
 * Formats given date string
 * Will convert date to local timezone first
 *
 * @param date {string}
 * @param utc {boolean}
 * @param format {string}
 * @returns {string}
 */
const format = ({ date, utc = false, format = 'D MMM YYYY' } = {}) => {
  return moment(date).local().format(format);
};

/**
 * Formats a given date range
 * @param from
 * @param to
 */
const formatRange = ({ from, to, utc = false } = {}) => {
  const fromMoment = moment(from).local();
  const toMoment = moment(to).local();

  // year is different
  if (toMoment.diff(fromMoment, 'years') > 0) {
    return `${fromMoment.format('Do MMM')} - ${toMoment.format('Do MMM YYYY')}`;
  }
  // year is the same, month is different
  if (toMoment.diff(fromMoment, 'months') > 0) {
    return `${fromMoment.format('Do MMM')} - ${toMoment.format('Do MMM YYYY')}`;
  }
  // year is the same, month is the same, day is different
  if (toMoment.diff(fromMoment, 'days') > 0) {
    return `${fromMoment.format('Do')} - ${toMoment.format('Do MMM YYYY')}`;
  }
  // year is the same, month is the same, day is the same
  return `${fromMoment.format('ha')} - ${toMoment.format('ha Do MMM YYYY')}`;
};

const localTz = momentTz.tz.names();

// all possible timezones
const timezones = localTz.map((tz) => {
  return {
    value: tz,
    label: 'GMT ' + momentTz.tz(tz).format('Z') + ' ' + tz,
  };
});

const UTC_OFFSET_OPTIONS = timezones.sort((a, b) => {
  if (a.label > b.label) return -1;
  if (a.label < b.label) return 1;
  return 0;
});
// const UTC_OFFSET_OPTIONS = timezones;

export default {
  format,
  formatRange,
  UTC_OFFSET_OPTIONS,
};
