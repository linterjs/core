import { createFormat, FormatFunction } from "./format";
import { createLint, LintFunction } from "./lint";
import { LinterAdapter, loadedLinterAdapterPromises } from "./linter-adapter";
import { loadLinterProvidersFromFile } from "./linter-providers";

// XXX: Create a new instance of Linter to load/reload registered
// linter providers from file
export default class Linter {
  format: FormatFunction = createFormat(loadedLinterAdapterPromises.get(this));
  lint: LintFunction = createLint(loadedLinterAdapterPromises.get(this));

  // TODO: Support config/options
  constructor() {
    const linterProviders = loadLinterProvidersFromFile();
    const linterAdapters = new Set<Promise<LinterAdapter>>();
    for (const { linterFactory } of linterProviders.values()) {
      linterAdapters.add(Promise.resolve(linterFactory()));
    }
    loadedLinterAdapterPromises.set(this, linterAdapters);
  }
}
