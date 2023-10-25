import path from "path";
import { fileURLToPath } from "url";

export const PKG_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../");

export const DEFAULT_APP_NAME = "my-arweave-app";
export const CLI_NAME = "create-arweave-app";
