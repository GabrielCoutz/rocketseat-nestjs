import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import z from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const emailAlreadyInUse = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (emailAlreadyInUse) throw new ConflictException('Email already in use')

    const hashedPassword = await bcrypt.hash(password, 8)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { user }
  }
}
