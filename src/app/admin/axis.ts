import * as d3 from 'd3';


const formatMillisecond = d3.timeFormat('.%L');
const formatSecond = d3.timeFormat(':%S');
const formatMinute = d3.timeFormat('%I:%M');
const formatHour = d3.timeFormat('%I %p');
const  formatDay = d3.timeFormat('%a %d');
const  formatWeek = d3.timeFormat('%b %d');
const  formatMonth = d3.timeFormat('%B');
const   formatYear = d3.timeFormat('%Y');

export function MultiFormat(date: any) {
  return (d3.timeSecond(date) < date ? formatMillisecond
    : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
          : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
            : d3.timeYear(date) < date ? formatMonth
              : formatYear)(date);
}


// export const tickFormat = (date, formats, d3) => {
//   if (d3.timeSecond(date) < date) {
//     return d3.timeFormat(formats.milliseconds)(date);
//   }
//
//   if (d3.timeMinute(date) < date) {
//     return d3.timeFormat(formats.seconds)(date);
//   }
//
//   if (d3.timeHour(date) < date) {
//     return d3.timeFormat(formats.minutes)(date);
//   }
//
//   if (d3.timeDay(date) < date) {
//     return d3.timeFormat(formats.hours)(date);
//   }
//
//   if (d3.timeMonth(date) < date) {
//     if (d3.timeWeek(date) < date) {
//       return d3.timeFormat(formats.days)(date);
//     }
//
//     return d3.timeFormat(formats.weeks)(date);
//   }
//
//   if (d3.timeYear(date) < date) {
//     return d3.timeFormat(formats.months)(date);
//   }
//
//   return d3.timeFormat(formats.year)(date);
// };
