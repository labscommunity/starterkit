// script to deploy contract source

import fs from "fs";
import * as esbuild from "esbuild";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import { WarpFactory } from "warp-contracts";
import replace from "replace-in-file";
import path from "path";

(async () => {
  // intiating new warp instance for mainnet
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());

  // read private key file
  // *store with name 'wallet.json' in root direstory of project if needed
  const key = JSON.parse(fs.readFileSync("wallet.json").toString());

  // get absolute path for project directory
  const __dirname = path.resolve();

  await esbuild.build({
    entryPoints: [`contracts/contract.${fs.existsSync("contracts/contract.ts") ? "ts" : "js"}`],
    bundle: true,
    outfile: "contracts-dist/contract.js",
    format: "esm",
  });

  const files = [`./contracts-dist/contract.js`];

  replace.sync({
    files: files,
    from: [/async function handle/g, /export {\n {2}handle\n};\n/g],
    to: ["export async function handle", ""],
    countMatches: true,
  });

  // read contract source logic from 'handle.js' and encode it
  const contractSource = fs.readFileSync(path.join(__dirname, "contracts-dist/contract.js"), "utf-8");

  // function create new contract source
  const newSource = await warp.createSource({ src: contractSource }, new ArweaveSigner(key));
  const newSrcId = await warp.saveSource(newSource);

  // log new function source's transaction id
  console.log("New Source Contract Id: ", newSrcId);
})();
