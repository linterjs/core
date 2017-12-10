export class DuplicateLinterError extends Error {
  public message = `Linter "${this.linter}" is already registered.`;

  public constructor(public linter: string) {
    super();
  }
}

export class NoLintersError extends Error {
  message = "No linters registered. Please install a linter adapter package.";
}
