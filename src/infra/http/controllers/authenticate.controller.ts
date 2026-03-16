import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import z from 'zod'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async authenticate(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials')

    const token = this.jwt.sign({ sub: user.id })

    return { token }
  }
}
