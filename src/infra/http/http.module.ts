import { Module } from '@nestjs/common'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  imports: [DatabaseModule],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
