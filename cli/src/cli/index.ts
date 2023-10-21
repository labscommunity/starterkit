import * as p from "@clack/prompts";
import { Command } from "commander";

import { CLI_NAME, DEFAULT_APP_NAME } from "@/constants.js";
import { getVersion } from "@/utils/getCliVersion.js";
import { getUserPkgManager } from "@/utils/getUserPkgManager.js";
import { validateAppName, validateImportAlias } from "@/utils/validation.js";

interface CliResults {
  appName: string;
  flags: {
    noGit: boolean;
    noInstall: boolean;
    default: boolean;
    language: string;
    importAlias: string;
    appRouter: boolean;
  };
}

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
    language: "typescript",
    importAlias: "@/",
    appRouter: false,
  },
};

export const runCli = async (): Promise<CliResults> => {
  const cliResults = defaultOptions;

  const program = new Command()
    .name(CLI_NAME)
    .description("A CLI for creating full-stack Arweave web applications")
    .argument("[dir]", "The name of the application, as well as the name of the directory to create")
    .option("--noGit", "Explicitely tell the CLI to not initialize a new git repo in the project", false)
    .option("--noIntall", "Explicitely tell the CLI to not run the package manager's install command", false)
    .option("-y, --default", "Bypass the CLI and use all default options to bootstrap a new arweave app", false)
    .option("-l, --language <type>", "Initialize project as a Typescript project", defaultOptions.flags.language)
    .option(
      "-i, --import-alias",
      "Explicitly tell the CLI to use a custom import alias",
      defaultOptions.flags.importAlias
    )
    .option(
      "--appRouter [boolean]",
      "Explicitly tell the CLI to use the new Next.js app router",
      (value) => !!value && value !== "false"
    )
    .version(getVersion(), "-v, --version", "Display the version number")
    .parse(process.argv);

  const cliProvidedAppName = program.args[0];
  if (cliProvidedAppName) {
    cliResults.appName = cliProvidedAppName;
  }

  cliResults.flags = program.opts();

  if (cliResults.flags.default) {
    return cliResults;
  }

  const pkgManager = getUserPkgManager();

  const project = await p.group(
    {
      ...(!cliProvidedAppName && {
        name: () =>
          p.text({
            message: "What will your project be called?",
            defaultValue: cliProvidedAppName,
            validate: validateAppName,
          }),
      }),
      language: () => {
        return p.select({
          message: "Will you be using TypeScript or JavaScript?",
          options: [
            { value: "typescript", label: "TypeScript" },
            { value: "javascript", label: "JavaScript" },
          ],
          initialValue: "typescript",
        });
      },
      appRouter: () => {
        return p.confirm({
          message: "Would you like to use Next.js App Router?",
          initialValue: false,
        });
      },
      ...(!cliResults.flags.noGit && {
        git: () => {
          return p.confirm({
            message: "Should we initialize a Git repository and stage the changes?",
            initialValue: !defaultOptions.flags.noGit,
          });
        },
      }),
      ...(!cliResults.flags.noInstall && {
        install: () => {
          return p.confirm({
            message: `Should we run '${pkgManager}` + (pkgManager === "yarn" ? `'?` : ` install' for you?`),
            initialValue: !defaultOptions.flags.noInstall,
          });
        },
      }),
      importAlias: () => {
        return p.text({
          message: "What import alias would you like to use?",
          defaultValue: defaultOptions.flags.importAlias,
          placeholder: defaultOptions.flags.importAlias,
          validate: validateImportAlias,
        });
      },
    },
    {
      onCancel() {
        process.exit(1);
      },
    }
  );

  return {
    appName: project.name ?? cliResults.appName,
    flags: {
      ...cliResults.flags,
      appRouter: project.appRouter ?? cliResults.flags.appRouter,
      noGit: !project.git ?? cliResults.flags.noGit,
      noInstall: !project.install ?? cliResults.flags.noInstall,
      importAlias: project.importAlias ?? cliResults.flags.importAlias,
      language: project.language ?? cliResults.flags.language,
    },
  };
};
