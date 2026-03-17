import { Either, left, right } from '@/core/either'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

import { Injectable } from '@nestjs/common'

interface authenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    token: string
  }
>

@Injectable()
export class authenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encryptor: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: authenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) return left(new WrongCredentialsError())

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) return left(new WrongCredentialsError())

    const token = await this.encryptor.encrypt({ sub: student.id.toString() })

    return right({ token })
  }
}
