import * as Moment from 'moment';
import { extendMoment, MomentRangeMethods } from 'moment-range';
import { Operation } from '../operation.model';
export { MomentRangeMethods };

const moment = extendMoment(Moment);

const unitAsDays: Record<Moment.unitOfTime.DurationConstructor, number> = {
  h: 0,
  hour: 0,
  hours: 0,
  m: 0,
  millisecond: 0,
  milliseconds: 0,
  minute: 0,
  minutes: 0,
  ms: 0,
  s: 0,
  second: 0,
  seconds: 0,
  d: 1,
  day: 1,
  days: 1,
  w: 7,
  week: 7,
  weeks: 7,
  M: 30,
  month: 30,
  months: 30,
  Q: 90,
  quarter: 90,
  quarters: 90,
  y: 365,
  year: 365,
  years: 365
};

export const nowOperationFactory = (date: Moment.MomentInput = Date.now()): Operation => ({
  key: 'n',
  getRange: (unit) => {
    return moment.range(
      moment(date).subtract(unitAsDays[unit], 'days'),
      moment(date)
    )
  },
  getEndDate: () => moment(date),
  isOperation: function(range, unit) {
    const compareRange =  this.getRange(unit);

    return compareRange.duration('d') === range.duration('d')
      && compareRange.start.isSame(range.start, unit)
      && compareRange.end.isSame(range.end, unit);
  }
});
