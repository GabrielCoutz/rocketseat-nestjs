export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
  abstract compare(value: string, encryptedValue: string): Promise<boolean>
}
