import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Env } from '@/infra/env'
import { ExtractJwt, Strategy } from 'passport-jwt'
import z from 'zod'

export const tokenSchema = z.object({
  sub: z.uuid(),
})

export type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService<Env, true>) {
    const publicKey = config.get<string>('JWT_PUBLIC_KEY', {
      infer: true,
    })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: z.infer<typeof tokenSchema>) {
    return tokenSchema.parse(payload)
  }
}
