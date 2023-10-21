import fs from "fs";
import path from "path";

import { PKG_ROOT } from "@/constants.js";
import { scaffoldProject } from "@/helpers/scaffoldProject.js";
import { getUserPkgManager } from "@/utils/getUserPkgManager.js";

interface CreateProjectOptions {
  projectName: string;
  scopedAppName: string;
  noInstall: boolean;
  importAlias: string;
  language: string;
  appRouter: boolean;
}

export const createProject = async ({
  projectName,
  scopedAppName,
  noInstall,
  appRouter,
  language,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  // Bootstraps the base Next.js application
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    scopedAppName,
    noInstall,
    appRouter,
    language,
  });

  // Select necessary _app,index / layout,page files
  if (appRouter) {
    // Replace next.config
    // fs.copyFileSync(
    //   path.join(PKG_ROOT, "template/extras/config/next-config-appdir.mjs"),
    //   path.join(projectDir, "next.config.mjs")
    // );
  }

  return projectDir;
};
