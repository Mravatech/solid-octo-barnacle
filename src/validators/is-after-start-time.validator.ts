import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import  moment from 'moment';

@ValidatorConstraint({ name: 'IsAfterStartTime', async: false })
export class IsAfterStartTime implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments) {
    const dto = args.object as any;

    const start = moment(dto.startTime, 'YYYY-MM-DD HH:mm A', true);
    const end = moment(endTime, 'YYYY-MM-DD HH:mm A', true);

    if (!start.isValid() || !end.isValid()) {
      return false; // Invalid date format
    }

    return end.isAfter(start); // End time must be after start time
  }

  defaultMessage(args: ValidationArguments) {
    return 'End time must be after start time and in the format YYYY-MM-DD HH:mm A';
  }
}
