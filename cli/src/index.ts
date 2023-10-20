#!/usr/bin/env node

import { logger } from "@/utils/logger.js";
import { runCli } from "./cli/index.js";

const main = async () => {
  runCli();
};

main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error("An unknown error has occurred. Please open an issue on github with the below:");
    console.log(err);
  }
  process.exit(1);
});
