import { Moment, MomentInput, unitOfTime } from 'moment';
import { DateRange } from 'moment-range';

export interface Operation {
  key: string;

  getEndDate: (
    unit: unitOfTime.DurationConstructor,
    startDate: MomentInput
  ) => Moment

  getRange: (
    unit: unitOfTime.DurationConstructor
  ) => DateRange;

  isOperation: (
    range: DateRange,
    unit: unitOfTime.DurationConstructor
  ) => boolean
}
