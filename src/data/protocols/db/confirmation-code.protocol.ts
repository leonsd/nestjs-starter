export abstract class ConfirmationCode {
  abstract generateConfirmationCode(length: number): string;
}
