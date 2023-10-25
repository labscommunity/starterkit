import * as p from "@clack/prompts";
import { Command, Option } from "commander";

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
    appRouter: true,
  },
};

export const runCli = async (): Promise<CliResults> => {
  let cliResults: CliResults;
  try {
    cliResults = structuredClone(defaultOptions);
  } catch {
    cliResults = JSON.parse(JSON.stringify(defaultOptions));
  }

  const program = new Command()
    .name(CLI_NAME)
    .description("A CLI for creating full-stack Arweave web applications")
    .argument("[dir]", "The name of the application, as well as the name of the directory to create", (value) => {
      if (value !== defaultOptions.appName) {
        const nameValidation = validateAppName(value);
        if (nameValidation) {
          throw new Error(nameValidation);
        }
      }
      return value;
    })
    .option(
      "--noGit",
      "Explicitely tell the CLI to not initialize a new git repo in the project",
      defaultOptions.flags.noGit
    )
    .option(
      "--noInstall",
      "Explicitely tell the CLI to not run the package manager's install command",
      defaultOptions.flags.noInstall
    )
    .option(
      "-y, --default",
      "Bypass the CLI and Use default options to bootstrap a new Arweave app. Note: Default options can be overridden by user-provided options.",
      defaultOptions.flags.default
    )
    .addOption(
      new Option("-l, --language <type>", "Initialize project as a Typescript or JavaScript project")
        .choices(["typescript", "javascript", "ts", "js"])
        .default(defaultOptions.flags.language)
    )
    .option(
      "-i, --import-alias <alias>",
      "Explicitly tell the CLI to use a custom import alias",
      (value) => {
        if (value !== defaultOptions.flags.importAlias) {
          const aliasValidation = validateImportAlias(value);
          if (aliasValidation) {
            throw new Error(aliasValidation);
          }
        }
        return value;
      },
      defaultOptions.flags.importAlias
    )
    .option(
      "--appRouter [boolean]",
      "Explicitly tell the CLI to use the new Next.js app router",
      (value) => !!value && value !== "false",
      defaultOptions.flags.appRouter
    )
    .version(getVersion(), "-v, --version", "Display the version number")
    .parse(process.argv);

  const cliProvidedAppName = program.args[0];
  if (cliProvidedAppName) {
    cliResults.appName = cliProvidedAppName;
  }

  cliResults.flags = program.opts();

  const getLanguage = (language: string) =>
    language === "js" || language === "javascript" ? "javascript" : "typescript";

  cliResults.flags.language = getLanguage(cliResults.flags.language);

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
            defaultValue: cliResults.appName,
            placeholder: cliResults.appName,
            validate: validateAppName,
          }),
      }),
      ...(cliResults.flags.language === defaultOptions.flags.language && {
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
      }),
      ...(cliResults.flags.appRouter === defaultOptions.flags.appRouter && {
        appRouter: () => {
          return p.confirm({
            message: "Would you like to use Next.js App Router?",
            initialValue: true,
          });
        },
      }),
      ...(cliResults.flags.noGit === defaultOptions.flags.noGit && {
        git: () => {
          return p.confirm({
            message: "Should we initialize a Git repository and stage the changes?",
            initialValue: !defaultOptions.flags.noGit,
          });
        },
      }),
      ...(cliResults.flags.noInstall === defaultOptions.flags.noInstall && {
        install: () => {
          return p.confirm({
            message: `Should we run '${pkgManager}` + (pkgManager === "yarn" ? `'?` : ` install' for you?`),
            initialValue: !defaultOptions.flags.noInstall,
          });
        },
      }),
      ...(cliResults.flags.importAlias === defaultOptions.flags.importAlias && {
        importAlias: () => {
          return p.text({
            message: "What import alias would you like to use?",
            defaultValue: defaultOptions.flags.importAlias,
            placeholder: defaultOptions.flags.importAlias,
            validate: validateImportAlias,
          });
        },
      }),
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
      language: getLanguage(project.language ?? cliResults.flags.language),
    },
  };
};
