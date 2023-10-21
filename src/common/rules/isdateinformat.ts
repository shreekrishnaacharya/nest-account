import { registerDecorator } from "class-validator";

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
  const test = text.trim();
  return test != null && test != "";
}
