/* eslint-disable no-undef */
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import fsPromises from "fs/promises";
import { glob } from "glob";
import { execa } from "execa";

const WORKSPACE_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../", "../");
const WEB_DIR = path.join(WORKSPACE_ROOT, "apps", "web");
const TEMPLATE_DIR = path.join(WORKSPACE_ROOT, "cli", "template", "next");
const TYPESCRIPT_DIR = path.join(TEMPLATE_DIR, "typescript");
const JAVASCRIPT_DIR = path.join(TEMPLATE_DIR, "javascript");
const COMMON_DIR = path.join(TEMPLATE_DIR, "common");
const TEXT_TO_REPLACE = "// COMMENT-TO-REPLACE";

const filesToCopy = [
  { src: "src", dst: TYPESCRIPT_DIR },
  { src: "tsconfig.json", dst: TYPESCRIPT_DIR },
  { src: "public", dst: COMMON_DIR },
  { src: "scripts", dst: COMMON_DIR },
  { src: ".eslintrc.json", dst: COMMON_DIR, rename: "_eslintrc.json" },
  { src: ".gitignore", dst: COMMON_DIR, rename: "_gitignore" },
  { src: "components.json", dst: COMMON_DIR },
  { src: "next.config.js", dst: COMMON_DIR },
  { src: "package.json", dst: COMMON_DIR },
  { src: "postcss.config.js", dst: COMMON_DIR },
  { src: "README.md", dst: COMMON_DIR },
  { src: "tailwind.config.js", dst: COMMON_DIR },
];

// Remove "// COMMENT-TO-REPLACE" comments from files written before.
async function removeComments(filePaths) {
  await Promise.all(
    filePaths.map(async (file) => {
      try {
        let content = await fsPromises.readFile(file, "utf8");
        content = content
          .split("\n")
          .map((line) => (line.trim() === TEXT_TO_REPLACE ? "" : line))
          .join("\n");
        await fsPromises.writeFile(file, content);
      } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
      }
    })
  );
}

export async function convertTsxToJsx(srcDir, destDir) {
  try {
    const tsxFiles = await glob(path.join(srcDir, `/**/*.{ts,tsx}`), {
      ignore: path.join(srcDir, `/node_modules/**`),
    });

    // Process tsx files
    await Promise.all(
      tsxFiles.map(async (file) => {
        let content = await fsPromises.readFile(file, "utf8");
        content = content
          .split("\n")
          .map((line) => (line.trim() === "" ? TEXT_TO_REPLACE : line))
          .join("\n");
        await fsPromises.writeFile(file, content);
      })
    );

    // Compile tsx files to jsx
    await execa("npx", `tsc --jsx preserve -t esnext --outDir ${destDir} --noEmit false`.split(" "), {
      cwd: srcDir,
      stdout: "ignore",
    });

    const jsxFiles = await glob(path.join(destDir, `/**/*.{js,jsx}`), {
      ignore: path.join(destDir, `/node_modules/**`),
    });

    // Remove "// COMMENT-TO-REPLACE" lines from tsx and jsx files
    await removeComments([...tsxFiles, ...jsxFiles]);

    const filesToDelete = ["tsconfig.tsbuildinfo", "types", "tailwind.config.js"];

    await Promise.all(
      filesToDelete.map(async (file) => {
        await fsPromises.rm(path.join(destDir, file), { recursive: true, force: true });
      })
    );

    // Run prettier on javascript files
    await execa("npx", `prettier --write ${destDir}`.split(" "), {
      stdout: "ignore",
    });
  } catch (error) {
    console.error(`Error processing files: ${error.message}`);
  }
}

(async () => {
  //----------------------------------------------------------------
  //---------------------- TYPESCRIPT ------------------------------
  //----------------------------------------------------------------

  // Empty directory if exists or create the directory
  fs.emptyDirSync(TYPESCRIPT_DIR);
  fs.emptyDirSync(COMMON_DIR);

  // Copy files from web app to typescript and common directories
  for (const { src, dst, rename } of filesToCopy) {
    const srcPath = path.join(WEB_DIR, src);
    const dstPath = path.join(dst, rename ? rename : src);
    fs.copySync(srcPath, dstPath);
  }

  // Rename _pages to pages
  fs.renameSync(path.join(TYPESCRIPT_DIR, "src", "_pages"), path.join(TYPESCRIPT_DIR, "src", "pages"));

  // Move styles from src to common directory
  fs.moveSync(path.join(TYPESCRIPT_DIR, "src", "styles"), path.join(COMMON_DIR, "styles"), {
    overwrite: true,
  });

  //----------------------------------------------------------------
  //----------------------- JAVSCRIPT ------------------------------
  //----------------------------------------------------------------

  // Empty directory if exists or create the directory
  fs.emptyDirSync(JAVASCRIPT_DIR);

  // Convert TSX to JSX
  await convertTsxToJsx(WEB_DIR, JAVASCRIPT_DIR);

  // Remove .next directory
  fs.removeSync(path.join(JAVASCRIPT_DIR, ".next"));
  fs.removeSync(path.join(JAVASCRIPT_DIR, "src", "types"));

  // Rename _pages to pages
  fs.renameSync(path.join(JAVASCRIPT_DIR, "src", "_pages"), path.join(JAVASCRIPT_DIR, "src", "pages"));

  // Create jsconfig file
  fs.writeFileSync(
    path.join(JAVASCRIPT_DIR, "jsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          paths: {
            "@/*": ["./src/*"],
          },
        },
      },
      null,
      2
    )
  );
})();
