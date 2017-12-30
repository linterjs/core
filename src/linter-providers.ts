import { oneLine } from "common-tags";
import { readFileSync, writeFileSync } from "fs";
import { EOL } from "os";
import { resolve } from "path";
import { NoLintersError } from "./errors";
import { LinterFactory } from "./linter-adapter";
import { logger } from "./logger";

export interface LinterProvider {
  linterFactory: LinterFactory;
  name: string;
}

export const registeredLinterProvidersFilePath = resolve(
  `${__dirname}/../.registered-linters`
);

export function deregisterLinterProvider(
  linterProviderModuleName: string
): void {
  const fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
  const newFileContent = fileContent
    .trim()
    .split(";")
    .filter(x => x)
    .filter(name => name !== linterProviderModuleName)
    .join(";");
  writeFileSync(
    registeredLinterProvidersFilePath,
    newFileContent + EOL,
    "utf8"
  );
}

export function loadLinterProvidersFromFile(): Set<LinterProvider> {
  let fileContent = "";
  try {
    fileContent = readFileSync(
      registeredLinterProvidersFilePath,
      "utf8"
    ).trim();
  } catch (error) {
    logger.debug("There was an error reading the registered linters file.");
    logger.trace(error);
  }
  const linterProviderModuleNames = fileContent.split(";").filter(x => x);

  const loadedlinterProviders = linterProviderModuleNames.reduce(
    (linterProviderAccumulator, linterProviderModuleName) => {
      try {
        const {
          linterProvider
        }: {
          linterProvider: LinterProvider;
        } = require(linterProviderModuleName);
        linterProviderAccumulator.push(linterProvider);
      } catch (error) {
        logger.warn(oneLine`
          Could not import "${linterProviderModuleName}",
          is it properly installed?
        `);
      }
      return linterProviderAccumulator;
    },
    [] as LinterProvider[]
  );

  if (loadedlinterProviders.length === 0) {
    const error = new NoLintersError();
    logger.error(error.message);
    throw error;
  }

  return new Set(loadedlinterProviders);
}

export function registerLinterProvider(linterModuleName: string): void {
  const fileContent = readFileSync(
    registeredLinterProvidersFilePath,
    "utf8"
  ).trim();
  let linterProviderModuleNames = new Set(
    fileContent.split(";").filter(x => x)
  );

  if (linterModuleName === "@linter/prettier") {
    linterProviderModuleNames = new Set([
      linterModuleName,
      ...linterProviderModuleNames.values()
    ]);
  } else {
    linterProviderModuleNames.add(linterModuleName);
  }

  const newContent = [...linterProviderModuleNames.values()].join(";");
  writeFileSync(registeredLinterProvidersFilePath, newContent + EOL, "utf8");
}

// XXX: Add more functionality, enable/disable linters?
