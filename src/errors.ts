import { oneLine } from "common-tags";

export class NoLintersError extends Error {
  message = oneLine`
    No linters registered.
    Please install at least one linter provider package.
    `;
}
