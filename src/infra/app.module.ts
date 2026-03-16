import { AuthModule } from '@/infra/auth/auth.module'
import { envSchema } from '@/infra/env'
import { HttpModule } from '@/infra/http/http.module'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      validate(config) {
        return envSchema.parse(config)
      },
    }),
  ],
})
export class AppModule {}
