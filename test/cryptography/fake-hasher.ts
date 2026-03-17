import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements HashComparer, HashGenerator {
  async hash(plainText: string): Promise<string> {
    return `hashed-${plainText}`
  }

  async compare(plainText: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hashed-${plainText}`
  }
}
