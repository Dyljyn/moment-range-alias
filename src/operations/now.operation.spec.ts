import * as Moment from 'moment';
import { unitOfTime } from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { nowOperationFactory } from './now.operation';

const moment = extendMoment(Moment);

const mockedDate = moment('2018-02-24');
const nowOperation = nowOperationFactory(mockedDate);

const unitsOfTime: unitOfTime.DurationConstructor[] = ['day', 'week', 'quarter', 'month', 'year'];

describe('nowOperation', () => {

  describe('getRange($unit, $date)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit`, () => {

        it('should work', () => {
          const range = nowOperation.getRange(unit);

          expect(range.start).toEqual(mockedDate.clone().subtract(1, unit));
          expect(range.end).toEqual(mockedDate.clone());
        });
      });
    });
  });

  describe('isOperation($range, $unit)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit'`, () => {
        it(`should detect`, () => {
          const range = moment.range(
            mockedDate.clone().subtract(1, unit),
            mockedDate.clone()
          );

          expect(nowOperation.isOperation(range, unit)).toBeTruthy();
        });
      });
    })
  });

});
