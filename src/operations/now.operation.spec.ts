import * as Moment from 'moment';
import { unitOfTime } from 'moment';
import { extendMoment } from 'moment-range';
import { nowOperationFactory } from './now.operation';

const moment = extendMoment(Moment);

const mockedDate = moment('2018-02-24');
const nowOperation = nowOperationFactory(mockedDate);

const unitsOfTime: { unit: unitOfTime.DurationConstructor, days: number }[] = [
  { unit: 'day', days: 1 },
  { unit: 'week', days: 7 },
  { unit: 'quarter', days: 90 },
  { unit: 'month', days: 30 },
  { unit: 'year', days: 365 }
];

describe('nowOperation', () => {

  describe('getRange($unit, $date)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit.unit}' as $unit`, () => {

        it('should work', () => {
          const range = nowOperation.getRange(unit.unit);

          expect(range.start).toEqual(mockedDate.clone().subtract(unit.days, 'days'));
          expect(range.end).toEqual(mockedDate.clone());
        });
      });
    });
  });

  describe('isOperation($range, $unit)', () => {

    unitsOfTime.forEach(unit => {
      describe(`with '${unit.unit}' as $unit'`, () => {
        it(`should detect`, () => {
          const range = moment.range(
            mockedDate.clone().subtract(unit.days, 'days'),
            mockedDate.clone()
          );

          expect(nowOperation.isOperation(range, unit.unit)).toBeTruthy();
        });
      });
    })
  });

});
