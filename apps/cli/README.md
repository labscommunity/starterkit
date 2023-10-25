# Create Arweave App

The quickest way to start building your Next.js Arweave application is by using `create-arweave-app`, which sets up everything for you.

## Usage

### Interactive

To scaffold an Arweave app interactively, run the following command based on your package manager of choice:

### npm

```bash
npx create-arweave-app@latest
# or
npm create arweave-app@latest
```

### yarn

```bash
yarn create arweave-app
```

### pnpm

```bash
pnpm create arweave-app@latest
```

### bun

```bash
bunx create-arweave-app@latest
# or
bun create arweave-app@latest
```

During the interactive setup, you'll be prompted for your project's name and other configuration options. Provide your choices to create a new Arweave application.

### Non-interactive

For a non-interactive setup, use command line arguments. You can view available options with:

```bash
create-arweave-app --help
```

```bash
Usage: create-arweave-app [dir] [options]

A CLI for creating full-stack Arweave web applications

Arguments:
  dir                         The name of the application, as well as the name of the directory to create

Options:
  --noGit                     Explicitely tell the CLI to not initialize a new git repo in the project (default: false)
  --noInstall                 Explicitely tell the CLI to not run the package manager's install command (default: false)
  -y, --default               Bypass the CLI and Use default options to bootstrap a new Arweave app. Note: Default options can be overridden by user-provided options. (default: false)
  -l, --language <type>       Initialize project as a Typescript or JavaScript project (choices: "typescript", "javascript", "ts", "js", default: "typescript")
  -i, --import-alias <alias>  Explicitly tell the CLI to use a custom import alias (default: "@/")
  --appRouter [boolean]       Explicitly tell the CLI to use the new Next.js app router (default: true)
  -v, --version               Display the version number
  -h, --help                  display help for command
```

You can quickly scaffold an Arweave app using `create-arweave-app` with default options by running:

```bash
npx create-arweave-app@latest -y
# or
yarn create arweave-app -y
# or
pnpm create arweave-app@latest -y
# or
bunx create-arweave-app@latest -y
```

You can also quickly scaffold by overriding the default options by passing the other options as well:

```bash
npx create-arweave-app@latest my-arweave-app --noGit --default
# or
yarn create arweave-app my-arweave-app --noGit --default
# or
pnpm create arweave-app@latest my-arweave-app --noGit --default
# or
bunx create-arweave-app@latest my-arweave-app --noGit --default
```
