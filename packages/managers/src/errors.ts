class ManagerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ManagerValidationError";
  }
}
