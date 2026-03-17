import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { hash, compare } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly salt = 8

  async hash(value: string): Promise<string> {
    return hash(value, this.salt)
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue)
  }
}
