import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from 'src/controllers/create-account.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from 'env'

@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService],
  imports: [
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
