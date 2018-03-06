import * as Moment from 'moment';
import { extendMoment, MomentRangeMethods } from 'moment-range';
import { Operation } from '../operation.model';
export { MomentRangeMethods };

const moment = extendMoment(Moment);

export const thisOperationFactory = (date = moment()): Operation => ({
  key: 't',
  getRange: (unit) => {
    return moment.range(
      moment(date).startOf(unit),
      moment(date).endOf(unit)
    )
  },
  getEndDate: (unit, startDate) => {
    return moment(startDate).endOf(unit);
  },
  isOperation: function(range, unit) {
    const compareRange =  this.getRange(unit);

    return compareRange.duration('d') === range.duration('d')
      && compareRange.start.isSame(range.start, unit)
      && compareRange.end.isSame(range.end, unit);
  }
});
