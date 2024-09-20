import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import  moment from 'moment';

@ValidatorConstraint({ name: 'IsStartTimeInFuture', async: false })
export class IsStartTimeInFuture implements ValidatorConstraintInterface {
  validate(startTime: string, args: ValidationArguments) {
    // Check if the time is in the format 'YYYY-MM-DD HH:mm A'
    const start = moment(startTime, 'YYYY-MM-DD HH:mm A', true);
    if (!start.isValid()) {
      return false; // Invalid date format
    }

    const now = moment(); // Current date and time
    return start.isSameOrAfter(now); // Start time must be now or later
  }

  defaultMessage(args: ValidationArguments) {
    return 'Start time must be in the future and in the format YYYY-MM-DD HH:mm A';
  }
}
