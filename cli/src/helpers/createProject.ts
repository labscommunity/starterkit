import fs from "fs";
import path from "path";

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

  // Remove pages/app depending upon appRouter
  if (appRouter) {
    fs.rmSync(path.join(projectDir, "src", "pages"), { recursive: true, force: true });
  } else {
    fs.rmSync(path.join(projectDir, "src", "app"), { recursive: true, force: true });
  }

  return projectDir;
};
