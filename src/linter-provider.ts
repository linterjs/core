import { oneLine } from "common-tags";
import readPkgUp = require("read-pkg-up");
import requireRelative = require("require-relative");
import {
  LinterProviderLoadError,
  ModuleNotLinterProviderError,
  NoLinterProvidersError,
} from "./errors";
import { LinterFactory } from "./linter-adapter";
import { logger } from "./logger";

export interface LinterProvider {
  factory: LinterFactory;
  name: string;
  supportedExtensions: string[];
}

interface LinterProviderModule {
  default: LinterProvider;
}

function isLinterProviderModule(
  linterProviderModule: any,
): linterProviderModule is LinterProviderModule {
  return (
    linterProviderModule.default &&
    typeof linterProviderModule.default.factory === "function"
  );
}

export function loadLinterProvidersFromFile(): Set<LinterProvider> {
  const { pkg: packageJson = {} } = readPkgUp.sync({ normalize: false });

  const {
    dependencies = {},
    devDependencies = {},
    optionalDependencies = {},
  } = packageJson;

  const linterProviderModuleNames = Object.keys({
    ...dependencies,
    ...devDependencies,
    ...optionalDependencies,
  }).filter(
    dependency =>
      dependency.startsWith("@linter/provider-") ||
      dependency.startsWith("linter-provider-") ||
      (dependency.startsWith("@") && dependency.includes("/linter-provider-")),
  );

  const loadedlinterProviders = linterProviderModuleNames.reduce(
    (loadedLinterProviderAccumulator, linterProviderModuleName) => {
      let linterProviderModule: LinterProviderModule | undefined;
      try {
        linterProviderModule = requireRelative(linterProviderModuleName);
      } catch (error) {
        logger.debug(oneLine`
          Could not import "${linterProviderModuleName}",
          is it properly installed?
        `);
        logger.trace(error);

        if (!optionalDependencies[linterProviderModuleName]) {
          logger.debug(
            "Linter provider module is not optional, throwing error",
          );
          throw new LinterProviderLoadError(linterProviderModuleName);
        }
      }

      if (
        linterProviderModule &&
        isLinterProviderModule(linterProviderModule)
      ) {
        loadedLinterProviderAccumulator.add(linterProviderModule.default);
      } else if (linterProviderModule) {
        throw new ModuleNotLinterProviderError(linterProviderModuleName);
      }

      return loadedLinterProviderAccumulator;
    },
    new Set<LinterProvider>(),
  );

  if (loadedlinterProviders.size === 0) {
    const error = new NoLinterProvidersError();
    logger.debug(error.message);
    throw error;
  }

  return loadedlinterProviders;
}

// XXX: Add more functionality, enable/disable linters?
