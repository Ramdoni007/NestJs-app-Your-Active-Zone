import { ArgumentMetadata, flatten, Injectable, PipeTransform, Type, UnprocessableEntityException, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value === null) return value;
    if (!metatype || !this.toValidate(metatype)) return value;
    const object: any = plainToInstance(metatype,value)
    const errors = await validate(object, { 
      whitelist: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: true,
    });

    if(errors.length > 0) {
      const flattened  = this.flattenValdiationErrors(errors);
      throw new UnprocessableEntityException({
        message: 'Unprocessable Entity',
        errors: flattened
      })
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const primitives: Function[] = [String, Boolean, Number, Array, Object];
    return !primitives.includes(metatype);
  }

  private flattenValdiationErrors(errors: ValidationError[]) {
    const out: Array<{ field: string, message: string }> = [];
    const walk = (err: ValidationError) => {
      if (err.constraints) {
        for (const key in err.constraints) {
          if (Object.prototype.hasOwnProperty.call(err.constraints, key)) {
            out.push({ field: err.property, message: err.constraints[key] });
          }
        }
      }
      if (err.children?.length)err.children.forEach(walk);
    }
    errors.forEach(walk);
    return out;
  }
}
