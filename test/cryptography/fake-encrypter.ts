import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }

  async compare(value: string, encryptedValue: string): Promise<boolean> {
    const decryptedValue = JSON.parse(encryptedValue)

    return decryptedValue.sub === value
  }
}
