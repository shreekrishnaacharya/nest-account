import {
    ValidationPipe as NestValidationPipe,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class CustomValidationPipe extends NestValidationPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            // Transform the incoming value into a class instance
            const object = plainToClass(metadata.metatype, value);
            // console.log(object, "hello")
            if (typeof object !== "object") {
                return object
            }
            // Validate the transformed object
            const errors = await validate(object);

            // If there are validation errors, throw a BadRequestException with the formatted error response
            if (errors.length > 0) {
                const formattedErrors = {};
                errors.forEach(error => {
                    const propertyName = error.property;
                    Object.entries(error.constraints).forEach(([key, message]) => {
                        if (!formattedErrors[propertyName]) {
                            formattedErrors[propertyName] = [];
                        }
                        formattedErrors[propertyName].push(message);
                    });
                });
                throw new BadRequestException({
                    message: 'Bad Request',
                    statusCode: 400,
                    errors: formattedErrors,
                });
            }

            return object;
        } catch (error) {
            // Handle errors other than validation errors
            throw error;
        }
    }
}
