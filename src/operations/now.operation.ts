import * as Moment from 'moment';
import { extendMoment, MomentRangeMethods } from 'moment-range';
import { Operation } from '../operation.model';
export { MomentRangeMethods };

const moment = extendMoment(Moment);

export const nowOperationFactory = (date: Moment.MomentInput = Date.now()): Operation => ({
  key: 'n',
  getRange: (unit) => {
    return moment.range(
      moment(date).subtract(1, unit),
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
