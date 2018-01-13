import { oneLine } from "common-tags";

export class LinterProviderLoadError extends Error {
  message = oneLine`
    There was a problem importing the linter provider module: 
    "${this.linterProviderModuleName}".
  `;

  constructor(private linterProviderModuleName: string) {
    super();
  }
}

export class ModuleNotLinterProviderError extends Error {
  message = oneLine`
    The imported module is not a linter provider: 
    "${this.linterProviderModuleName}"
  `;

  constructor(private linterProviderModuleName: string) {
    super();
  }
}

export class NoLinterProvidersError extends Error {
  message = oneLine`
    No linter providers found.
    Please install at least one linter provider package.
  `;
}
