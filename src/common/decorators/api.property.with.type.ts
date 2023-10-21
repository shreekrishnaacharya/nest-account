import { ApiProperty } from "@nestjs/swagger";

export function ApiPropertyWithType<T>(
  type: new (...args: any[]) => T
): PropertyDecorator {
  return ApiProperty({ type: type, isArray: true });
}
