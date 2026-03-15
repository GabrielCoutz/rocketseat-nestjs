import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from 'src/controllers/create-account.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from 'env'
import { AuthModule } from 'src/auth/auth.module'
import { AuthenticateController } from 'src/controllers/authenticate.controller'
import { CreateQuestionController } from 'src/controllers/create-question.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
  imports: [
    AuthModule,
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
