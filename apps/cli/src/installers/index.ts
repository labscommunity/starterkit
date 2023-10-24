import { type PackageManager } from "@/utils/getUserPkgManager.js";

export interface InstallerOptions {
  projectDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  appRouter?: boolean;
  projectName: string;
  scopedAppName: string;
  language: string;
}
