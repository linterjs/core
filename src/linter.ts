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

    const linterAdapters = new Set<Promise<LinterAdapter>>();
    const linterProviders = loadLinterProvidersFromFile();

    for (const { factory } of linterProviders.values()) {
      linterAdapters.add(Promise.resolve(factory()));
    }

    this.format = createFormat(linterAdapters);
    this.lint = createLint(linterAdapters);
  }

  // XXX: Do we need to add functionality to reload providers from file,
  // set config, etc.?
}
