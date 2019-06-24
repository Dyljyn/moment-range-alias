import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { lastOperationFactory, nowOperationFactory, thisOperationFactory } from './operations';
import { RangeAlias, UnitOfTimeChar } from './range-alias';

const moment = extendMoment(Moment);

describe('RangeAlias', () => {
  const currentDate = moment('2018-02-24');
  const supportedUnits: UnitOfTimeChar[] = ['w', 'M', 'Q', 'y'];

  it('should instantiate', () => {
    const rangeAlias = new RangeAlias();

    expect(rangeAlias).toBeTruthy();
  });

  it('should order units from largest to smallest', () => {
    const rangeAlias = new RangeAlias(['w', 'y', 'M']);

    expect(rangeAlias.unitOfTimes).toEqual(['y', 'M', 'w'] as UnitOfTimeChar[]);
  });

  it('should add a single operation', () => {
    const rangeAlias = new RangeAlias()
      .addOperation(thisOperationFactory());

    expect(rangeAlias.operations.length).toBe(1);
  });

  it('should add multiple operations', () => {
    const rangeAlias = new RangeAlias()
      .addOperation(thisOperationFactory())
      .addOperations(
        lastOperationFactory(),
        nowOperationFactory()
      );

    expect(rangeAlias.operations.length).toBe(3);
  });

  it('should set the operations', () => {
    const rangeAlias = new RangeAlias()
      .addOperation(thisOperationFactory())
      .setOperations(lastOperationFactory());

    expect(rangeAlias.operations.length).toBe(1);
  });

  describe('getRange()', () => {
    let rangeAlias: RangeAlias;

    beforeEach(() => {
      rangeAlias = new RangeAlias(supportedUnits)
        .addOperation(thisOperationFactory(currentDate));
    });

    it(`should work with all supported units`, () => {
      supportedUnits.forEach(unit => {
        const range = rangeAlias.getRange('t' + unit);

        const compareRange = moment.range(
          currentDate.clone().startOf(unit),
          currentDate.clone().endOf(unit)
        );

        expect(range).toEqual(compareRange, `Range didn't match for unit '${unit}'`);
      })
    });

    describe('max date', () => {
      it('should respect a max date within range', () => {
        const maxDate = moment('2018-02-20');
        const startOfWeek = currentDate.clone().startOf('w');
        const endOfWeek = currentDate.clone().endOf('w');

        const range = rangeAlias.getRange('tw', maxDate) as DateRange;

        expect(range).toBeDefined();
        expect(range.start).toEqual(startOfWeek);
        expect(range.end).not.toEqual(endOfWeek);
        expect(range.end).toEqual(maxDate);
      });

      it('should respect a max date before range', () => {
        const maxDate = moment('2018-02-01');

        const range = rangeAlias.getRange('tw', maxDate) as DateRange;

        expect(range).toBeUndefined();
      });

      it(`should ignore a max date after range`, () => {
        const maxDate = moment('2018-02-30');
        const startOfWeek = currentDate.clone().startOf('w');
        const endOfWeek = currentDate.clone().endOf('w');

        const range = rangeAlias.getRange('tw', maxDate) as DateRange;

        expect(range).toBeDefined();
        expect(range.start).toEqual(startOfWeek);
        expect(range.end).toEqual(endOfWeek);
        expect(range.end).not.toEqual(maxDate);
      });
    });
  });

  describe('getAlias()', () => {
    let rangeAlias: RangeAlias;

    beforeEach(() => {
      rangeAlias = new RangeAlias()
        .addOperations(
          thisOperationFactory(currentDate),
          lastOperationFactory(currentDate)
        );
    });

    it(`should match an operation for all supported units`, () => {
      supportedUnits.forEach(unit => {
        const range = moment.range(
          currentDate.clone().startOf(unit),
          currentDate.clone().endOf(unit)
        );

        const alias = rangeAlias.getAlias(range);

        expect(alias).toBeDefined(`Alias was not defined for unit '${unit}'`);
        expect(alias).toEqual('t' + unit);
      })
    });

    describe('max date', () => {
      it('should match with a max date within range', () => {
        const range = moment.range(
          moment('2018-01-01'),
          currentDate
        );
        const maxDate = currentDate.clone().subtract(2, 'd');

        const alias = rangeAlias.getAlias(range, maxDate);

        expect(alias).toEqual('ty');
      });

      it('should match with a max date before range', () => {
        const range = moment.range(
          currentDate.clone().startOf('y'),
          currentDate.clone().endOf('y'),
        );
        const maxDate = range.start.clone().subtract(5, 'd');

        const alias = rangeAlias.getAlias(range, maxDate);

        expect(alias).toEqual('ty');
      });

      it('should match with a max date after range', () => {
        const range = moment.range(
          currentDate.clone().startOf('y'),
          currentDate.clone().endOf('y'),
        );
        const maxDate = range.end.clone().add(5, 'd');

        const alias = rangeAlias.getAlias(range, maxDate);

        expect(alias).toEqual('ty');
      });
    });
  });

  describe('getAvailableAliases()', () => {
    let rangeAlias: RangeAlias;
    const units: UnitOfTimeChar[] = ['w', 'M'];
    const operations = [
      thisOperationFactory(currentDate),
      lastOperationFactory(currentDate)
    ];

    beforeEach(() => {
      rangeAlias = new RangeAlias(units).addOperations(...operations);
    });

    it('should return all for an infinite range', () => {
      const range = moment.range(<any>undefined, <any>undefined);

      const aliases = rangeAlias.getAvailableAliases(range);

      expect(aliases.length).toBe(units.length * operations.length);
    });

    it('should respect start date', () => {
      const range = moment.range(currentDate.clone().startOf('month'), <any>null);

      const aliases = rangeAlias.getAvailableAliases(range);

      expect(aliases.length).toBe(3);
    });

    it('should respect end date', () => {
      const range = moment.range(<any>null, currentDate.clone());

      const aliases = rangeAlias.getAvailableAliases(range);

      expect(aliases.length).toBe(2);
    });
  });

  describe('extra scenarios', () => {
    it('Extra #1', () => {
      const rangeAlias = new RangeAlias()
        .addOperations(
          thisOperationFactory(moment('2019-06-24')),
          lastOperationFactory(moment('2019-06-24'))
        );

      const range = moment.range(
        moment('2019-01-01').startOf('d'),
        moment('2019-03-31').endOf('d'),
      );

      const max = moment('2019-06-23');

      const alias = rangeAlias.getAlias(range, max);

      expect(alias).toEqual('lQ');
    });
  });
});
