import * as Moment from 'moment';
import { MomentInput } from 'moment';
import { DateRange, extendMoment } from 'moment-range';
import { Operation } from './operation.model';

const moment = extendMoment(Moment);

export class RangeAlias {
  /**
   * The array is ordered from largest unit to smallest
   * This is essential in the calculation of {@link RangeAlias.getAlias}
   *
   * @type {UnitOfTimeChar[]}
   */
  private static supportedUnits: UnitOfTimeChar[] = ['y', 'Q', 'M', 'w', 'd'];

  public readonly unitOfTimes: UnitOfTimeChar[] = RangeAlias.supportedUnits;

  private _operations: Operation[] = [];

  private static withinRange(range: DateRange, insideRange: DateRange): boolean {
    return insideRange.start.isSameOrAfter(range.start)
      && insideRange.end.isSameOrBefore(range.end);
  }

  constructor(unitsOfTime?: UnitOfTimeChar[]) {
    if (unitsOfTime && unitsOfTime.length > 0) {
      /// To enforce only supported units
      /// and maintaining the order from largest to smallest unit
      this.unitOfTimes = RangeAlias.supportedUnits.filter(
        (unit: UnitOfTimeChar) => ~unitsOfTime.indexOf(unit)
      );
    }
  }

  get operations(): Operation[] {
    return this._operations;
  }

  public setOperations(...operations: Operation[]): RangeAlias {
    this._operations = operations;

    return this;
  }

  public addOperation(...operations: Operation[]): RangeAlias {
    this._operations = [...this._operations, ...operations];

    return this;
  }

  public addOperations(...operations: Operation[]): RangeAlias {
    return this.addOperation(...operations);
  }

  public getRange(alias: string, max?: MomentInput): DateRange | undefined {
    const [operator, unit] = alias.split('');

    const operation = this.operations.find(it => it.key === operator);

    if (!operation) {
      return undefined;
    }

    let nextRange = operation.getRange(unit as UnitOfTimeChar);

    if (max) {
      if (nextRange.start.isAfter(max)) {
        return undefined;
      }

      if (nextRange.end.isAfter(max)) {
        nextRange = moment.range(
          nextRange.start,
          Moment.isMoment(max) ? max : moment(max)
        );
      }
    }

    return nextRange;
  }

  public getAlias(range: DateRange, max?: MomentInput): string | undefined {
    let alias: string | undefined = undefined;

    this.unitOfTimes.find(unit => {
      const operation = this.operations.find(op => {
        let compareRange: DateRange = range;

        if (max && range.end.isSameOrAfter(max)) {
          compareRange = moment.range(
            range.start,
            op.getEndDate(unit, range.start)
          );
        }

        return op.isOperation(compareRange, unit);
      });

      if (operation) {
        alias = operation.key + unit
      }

      return !!operation;
    });

    return alias;
  }

  public getAvailableAliases(range: DateRange): string[] {
    return this.unitOfTimes.reduce((aliases, unit) => {
      this.operations.forEach(operation => {
        const operationRange = operation.getRange(unit);

        if (RangeAlias.withinRange(range, operationRange)) {
          aliases = [...aliases, operation.key + unit] as any
        }
      });

      return aliases;
    }, []);
  }
}

export type UnitOfTimeChar = 'd' | 'w' | 'M' | 'Q' | 'y';
