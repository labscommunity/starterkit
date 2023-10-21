#!/usr/bin/env node
import path from "path";
import { execa } from "execa";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { logger } from "@/utils/logger.js";
import { runCli } from "@/cli/index.js";
import { getUserPkgManager } from "@/utils/getUserPkgManager.js";
import { renderTitle } from "@/utils/renderTitle.js";
import { parseNameAndPath } from "@/utils/parseNameAndPath.js";
import { createProject } from "@/helpers/createProject.js";
import { getVersion } from "@/utils/getCliVersion.js";
import { initializeGit } from "@/helpers/git.js";
import { installDependencies } from "@/helpers/installDependencies.js";
import { logNextSteps } from "@/helpers/logNextSteps.js";
import { setImportAlias } from "@/helpers/setImportAlias.js";
import { getNpmVersion, renderVersionWarning } from "@/utils/renderVersionWarning.js";

type StarterKitPackageJSON = PackageJson & {
  starterKitMetadata?: {
    initVersion: string;
  };
};

const main = async () => {
  const npmVersion = await getNpmVersion();
  const pkgManager = getUserPkgManager();
  await renderTitle();
  npmVersion && renderVersionWarning(npmVersion);

  const {
    appName,
    flags: { noGit, noInstall, importAlias, appRouter, language },
  } = await runCli();

  const [scopedAppName, appDir] = parseNameAndPath(appName);

  const projectDir = await createProject({
    projectName: appDir,
    scopedAppName,
    importAlias,
    noInstall,
    appRouter,
    language,
  });

  // Write name to package.json
  const pkgJson = fs.readJSONSync(path.join(projectDir, "package.json")) as StarterKitPackageJSON;
  pkgJson.name = scopedAppName;
  pkgJson.starterKitMetadata = { initVersion: getVersion() };

  // ? Bun doesn't support this field (yet)
  if (pkgManager !== "bun") {
    const { stdout } = await execa(pkgManager, ["-v"], {
      cwd: projectDir,
    });
    pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`;
  }

  fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
    spaces: 2,
  });

  // update import alias in any generated files if not using the default
  if (importAlias !== "@/") {
    setImportAlias(projectDir, importAlias);
  }

  if (!noInstall) {
    await installDependencies({ projectDir });
  }

  // Rename _eslintrc.json to .eslintrc.json - we use _eslintrc.json to avoid conflicts with the monorepos linter
  fs.renameSync(path.join(projectDir, "_eslintrc.json"), path.join(projectDir, ".eslintrc.json"));

  if (!noGit) {
    await initializeGit(projectDir);
  }

  await logNextSteps({
    projectName: appDir,
    appRouter,
    noInstall,
    projectDir,
  });

  process.exit(0);
};

main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "Unexpected error. Please open an issue on github: https://github.com/labscommunity/starterkit with the error below:"
    );
    console.log(err);
  }
  process.exit(1);
});
