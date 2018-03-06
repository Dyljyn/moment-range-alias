import * as Moment from 'moment';
import { unitOfTime } from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { thisOperationFactory } from './this.operation';

const moment = extendMoment(Moment);

const mockedDate = moment('2018-02-24');
const thisOperation = thisOperationFactory(mockedDate);

const unitsOfTime: unitOfTime.DurationConstructor[] = ['day', 'week', 'quarter', 'month', 'year'];

describe('thisOperation', () => {

  describe('getRange($unit, $date)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit`, () => {

        it('should work', () => {
          const range = thisOperation.getRange(unit);

          expect(range.start).toEqual(mockedDate.clone().startOf(unit));
          expect(range.end).toEqual(mockedDate.clone().endOf(unit));
        });
      });
    });
  });

  describe('isOperation($range, $unit)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit'`, () => {
        it(`should detect`, () => {
          const range = moment.range(
            mockedDate.clone().startOf(unit),
            mockedDate.clone().endOf(unit)
          );

          expect(thisOperation.isOperation(range, unit)).toBeTruthy();
        });
      });
    })
  });

});
