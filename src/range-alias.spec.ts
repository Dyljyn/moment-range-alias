import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { lastOperationFactory, nowOperationFactory, thisOperationFactory } from './operations';
import { RangeAlias, UnitOfTimeChar } from './range-alias';

const moment = extendMoment(Moment);

describe('RangeAlias', () => {
  const mockedDate = moment('2018-02-24');
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
      .addOperation(thisOperationFactory(mockedDate));

    expect(rangeAlias.operations.length).toBe(1);
  });

  it('should add multiple operations', () => {
    const rangeAlias = new RangeAlias()
      .addOperation(thisOperationFactory(mockedDate))
      .addOperations(
        lastOperationFactory(mockedDate),
        nowOperationFactory(mockedDate)
      );

    expect(rangeAlias.operations.length).toBe(3);
  });

  it('should set the operations', () => {
    const rangeAlias = new RangeAlias()
      .addOperation(thisOperationFactory(mockedDate))
      .setOperations(lastOperationFactory(mockedDate));

    expect(rangeAlias.operations.length).toBe(1);
  });

  describe('getRange()', () => {
    let rangeAlias: RangeAlias;

    beforeEach(() => {
      rangeAlias = new RangeAlias(supportedUnits)
        .addOperation(thisOperationFactory(mockedDate));
    });

    it(`should work with all supported units`, () => {
      supportedUnits.forEach(unit => {
        const range = rangeAlias.getRange('t' + unit);

        const compareRange = moment.range(
          mockedDate.clone().startOf(unit),
          mockedDate.clone().endOf(unit)
        );

        expect(range).toEqual(compareRange, `Range didn't match for unit '${unit}'`);

      })
    });

    it('should respect a max date within range', () => {
      const maxDate = moment('2018-02-20');
      const range = rangeAlias.getRange('tw', maxDate) as DateRange;

      expect(range).toBeDefined();
      expect(range.start).toEqual(mockedDate.clone().startOf('w'));
      expect(range.end).toEqual(maxDate);
    });

    it('should respect a max date before range', () => {
      const maxDate = moment('2018-02-01');
      const range = rangeAlias.getRange('tw', maxDate) as DateRange;

      expect(range).toBeUndefined();
    });

    it(`should ignore a max date after range`, () => {
      const maxDate = moment('2018-02-30');
      const range = rangeAlias.getRange('tw', maxDate) as DateRange;

      expect(range).toBeDefined();
      expect(range.start).toEqual(mockedDate.clone().startOf('w'));
      expect(range.end).not.toEqual(maxDate);
    });
  });

  describe('getAlias()', () => {
    let rangeAlias: RangeAlias;

    beforeEach(() => {
      rangeAlias = new RangeAlias()
        .addOperations(
          thisOperationFactory(mockedDate),
          lastOperationFactory(mockedDate)
        );
    });

    it(`should match an operation for all supported units`, () => {
      supportedUnits.forEach(unit => {
        const range = moment.range(
          mockedDate.clone().startOf(unit),
          mockedDate.clone().endOf(unit)
        );

        const alias = rangeAlias.getAlias(range);

        expect(alias).toBeDefined(`Alias was not defined for unit '${unit}'`);
        expect(alias).toEqual('t' + unit);
      })
    });

    it('should match with a max date within range', () => {
      const maxDate = moment('2018-08-20');
      const range = moment.range(
        mockedDate.clone().startOf('y'),
        maxDate
      );

      const alias = rangeAlias.getAlias(range, maxDate);

      expect(alias).toEqual('ty');
    });

    it('should match with a max date before range', () => {
      const maxDate = moment('2017-12-24');
      const range = moment.range(
        mockedDate.clone().startOf('M'),
        mockedDate.clone().endOf('M'),
      );

      const alias = rangeAlias.getAlias(range, maxDate);

      expect(alias).toEqual('tM');
    });

    it('should match with a max date after range', () => {
      const maxDate = moment('2018-08-20');
      const range = moment.range(
        mockedDate.clone().subtract(1, 'y').startOf('y'),
        mockedDate.clone().subtract(1, 'y').endOf('y'),
      );

      const alias = rangeAlias.getAlias(range, maxDate);

      expect(alias).toEqual('ly');
    });
  });

  describe('getAvailableAliases()', () => {
    let rangeAlias: RangeAlias;
    const units: UnitOfTimeChar[] = ['w', 'M'];
    const operations = [
      thisOperationFactory(mockedDate),
      lastOperationFactory(mockedDate)
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
      const range = moment.range(mockedDate.clone().startOf('month'), <any>null);

      const aliases = rangeAlias.getAvailableAliases(range);

      expect(aliases.length).toBe(3);
    });

    it('should respect end date', () => {
      const range = moment.range(<any>null, mockedDate.clone());

      const aliases = rangeAlias.getAvailableAliases(range);

      expect(aliases.length).toBe(2);
    });
  });
});
