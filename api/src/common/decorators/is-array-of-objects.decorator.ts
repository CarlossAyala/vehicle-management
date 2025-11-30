import { registerDecorator, ValidationOptions } from "class-validator";

export function IsArrayOfObjects(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "is-array-of-objects",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (Array.isArray(value)) {
            return value.every(
              (item) =>
                typeof value === "object" &&
                item !== null &&
                !Array.isArray(item),
            );
          }

          return true;
        },
        defaultMessage() {
          return "$property must be an array of objects (each item must be a non-null object)";
        },
      },
    });
  };
}
