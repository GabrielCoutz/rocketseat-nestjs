import { BadRequestException, PipeTransform } from '@nestjs/common'
import z, { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(z.treeifyError(error))
      }

      throw error
    }
  }
}
