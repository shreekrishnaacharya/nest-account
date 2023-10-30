import { registerDecorator } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export function IsDateInFormat(format: string) {
  const regex = new RegExp(`^${format}$`);

  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsDateInFormat",
      target: object.constructor,
      propertyName,
      constraints: [format],
      validator: {
        validate(value: any) {
          return regex.test(value);
        },
        defaultMessage() {
          return `The date must be in the format ${format}`;
        },
      },
    });
  };
}



export function IsNotEmptyString(text: string) {
  if (!text) {
    return false
  }
  const test = text.trim();
  return test != null && test != "";
}

export function IsValidEntry(entries: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidEntry",
      target: object.constructor,
      propertyName,
      constraints: [entries],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const entries = args[0]
          let totalDr = 0;
          let totalCr = 0;
          const drLedger = {};
          const crLedger = {};
          entries.drEntry.forEach((e) => {
            totalDr += e.amount;
            drLedger[e.ledger_id] = e.ledger_id;
          });
          entries.crEntry.forEach((e) => {
            totalCr += e.amount;
            crLedger[e.ledger_id] = e.ledger_id;
          });
          if (totalCr != totalDr) {
            return false;
          }
          return true;
        },
        defaultMessage() {
          return `Entries is not a valid entry. Please check guide notes`;
        },
      },
    });
  };
}
