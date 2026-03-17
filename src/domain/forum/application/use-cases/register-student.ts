import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'

interface registerStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Pick<Student, 'id' | 'name' | 'email'>
  }
>

@Injectable()
export class registerStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: registerStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const emailAlreadyInUse = await this.studentsRepository.findByEmail(email)

    if (emailAlreadyInUse) return left(new StudentAlreadyExistsError())

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    })
  }
}
