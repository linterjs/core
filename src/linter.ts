import { createFormat, FormatFunction } from "./format";
import { createLint, LintFunction } from "./lint";
import { LinterAdapter } from "./linter-adapter";
import { loadLinterProvidersFromFile } from "./linter-provider";
import { logger, getDefaultLogLevel } from "./logger";

// Create a new instance of Linter to load/reload registered
// linter providers from file
export default class Linter {
  format: FormatFunction;
  lint: LintFunction;

  // TODO: Support config/options
  constructor() {
    logger.setLevel(getDefaultLogLevel());

    const linterAdapterPromisesBySupportedExtensions = new Map<
      string,
      Set<Promise<LinterAdapter>>
    >();
    const linterProviders = loadLinterProvidersFromFile();

    for (const { factory, supportedExtensions } of linterProviders.values()) {
      const linterAdapter = Promise.resolve(factory());

      new Set(supportedExtensions).forEach(extension => {
        const extensionWithDot = extension.includes(".")
          ? extension
          : `.${extension}`;

        const linterAdapters =
          linterAdapterPromisesBySupportedExtensions.get(extensionWithDot) ||
          new Set<Promise<LinterAdapter>>();

        linterAdapters.add(linterAdapter);

        linterAdapterPromisesBySupportedExtensions.set(
          extensionWithDot,
          linterAdapters,
        );
      });
    }

    this.format = createFormat(linterAdapterPromisesBySupportedExtensions);
    this.lint = createLint(linterAdapterPromisesBySupportedExtensions);
  }

  // XXX: Do we need to add functionality to reload providers from file,
  // set config, etc.?
}
