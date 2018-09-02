import { oneLine } from "common-tags";
import readPkgUp = require("read-pkg-up");
import {
  LinterProviderLoadError,
  ModuleNotLinterProviderError,
  NoLinterProvidersError
} from "./errors";
import { LinterFactory } from "./linter-adapter";
import { logger } from "./logger";

export interface LinterProvider {
  factory: LinterFactory;
  name: string;
}

interface LinterProviderModule {
  default: LinterProvider;
}

function isLinterProviderModule(
  linterProviderModule: any
): linterProviderModule is LinterProviderModule {
  return (
    linterProviderModule.default &&
    typeof linterProviderModule.default.linterFactory === "function"
  );
}

export function loadLinterProvidersFromFile(): Set<LinterProvider> {
  const { pkg: packageJson = {} } = readPkgUp.sync({ normalize: false });

  const {
    dependencies = {},
    devDependencies = {},
    optionalDependencies = {}
  } = packageJson;

  const linterProviderModuleNames = Object.keys({
    ...dependencies,
    ...devDependencies,
    ...optionalDependencies
  }).filter(
    dependency =>
      dependency.startsWith("@linter/provider-") ||
      dependency.startsWith("linter-provider-") ||
      (dependency.startsWith("@") && dependency.includes("/linter-provider-"))
  );

  const loadedlinterProviders = linterProviderModuleNames.reduce(
    (linterProviderAccumulator, linterProviderModuleName) => {
      let linterProviderModule: LinterProviderModule | undefined;
      try {
        linterProviderModule = require(linterProviderModuleName);
      } catch (error) {
        logger.debug(oneLine`
          Could not import "${linterProviderModuleName}",
          is it properly installed?
        `);
        logger.trace(error);

        if (!optionalDependencies[linterProviderModuleName]) {
          logger.debug(
            "Linter provider module is not optional, throwing error"
          );
          throw new LinterProviderLoadError(linterProviderModuleName);
        }
      }

      if (
        linterProviderModule &&
        isLinterProviderModule(linterProviderModule)
      ) {
        linterProviderAccumulator.push(linterProviderModule.default);
      } else if (linterProviderModule) {
        throw new ModuleNotLinterProviderError(linterProviderModuleName);
      }

      return linterProviderAccumulator;
    },
    [] as LinterProvider[]
  );

  if (loadedlinterProviders.length === 0) {
    const error = new NoLinterProvidersError();
    logger.debug(error.message);
    throw error;
  }

  return new Set(loadedlinterProviders);
}

// XXX: Add more functionality, enable/disable linters?
