import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenSchema } from '@/auth/jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_, req: ExecutionContext) =>
    req.switchToHttp().getRequest().user as TokenSchema,
)
