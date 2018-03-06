import * as Moment from 'moment';
import { unitOfTime } from 'moment';
import { extendMoment } from 'moment-range';
import { lastOperationFactory } from './last.operation';

const moment = extendMoment(Moment);

const mockedDate = moment('2018-02-24');
const lastOperation = lastOperationFactory(mockedDate);

const unitsOfTime: unitOfTime.DurationConstructor[] = ['day', 'week', 'quarter', 'month', 'year'];

describe('lastOperation', () => {

  describe('getRange($unit, $date)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit`, () => {

        it('should work', () => {
          const range = lastOperation.getRange(unit);

          expect(range.start).toEqual(mockedDate.clone().subtract(1, unit).startOf(unit));
          expect(range.end).toEqual(mockedDate.clone().subtract(1, unit).endOf(unit));
        });
      });
    });
  });

  describe('isOperation($range, $unit)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit}' as $unit'`, () => {
        it(`should detect`, () => {
          const range = moment.range(
            mockedDate.clone().subtract(1, unit).startOf(unit),
            mockedDate.clone().subtract(1, unit).endOf(unit)
          );

          expect(lastOperation.isOperation(range, unit)).toBeTruthy();
        });
      });
    })
  });

});
