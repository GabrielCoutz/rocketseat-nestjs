import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import z from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() currentUser: TokenSchema,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body

    const question = await this.createQuestion.execute({
      authorId: currentUser.sub,
      title,
      content,
      attachmentsIds: [],
    })

    return { question }
  }
}
