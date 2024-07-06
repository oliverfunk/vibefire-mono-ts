export class ManagerRuleViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ManagerRuleViolation";
  }
}
