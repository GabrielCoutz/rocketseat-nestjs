import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body) {
    const emailAlreadyInUse = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (emailAlreadyInUse) throw new ConflictException('Email already in use')

    const user = await this.prisma.user.create({
      data: body,
    })

    return { user }
  }
}
