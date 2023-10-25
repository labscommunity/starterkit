import path from "path";
import { fileURLToPath } from "url";

export const PKG_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../");
export const TITLE_TEXT = `   ___ ___ ___   _ _____ ___     _   _____      _____   ___   _____     _   ___ ___
  / __| _ \\ __| /_\\_   _| __|   /_\\ | _ \\ \\    / / __| /_\\ \\ / / __|   /_\\ | _ \\ _ \\
 | (__|   / _| / _ \\| | | _|   / _ \\|   /\\ \\/\\/ /| _| / _ \\ V /| _|   / _ \\|  _/  _/
  \\___|_|_\\___/_/ \\_\\_| |___| /_/ \\_\\_|_\\ \\_/\\_/ |___/_/ \\_\\_/ |___| /_/ \\_\\_| |_|
  `;
export const DEFAULT_APP_NAME = "my-arweave-app";
export const CLI_NAME = "create-arweave-app";
