import Path from "path";
import fs from "fs";
import os from "os";
import Command from "./Command";

interface Config {
  blockDirectory: string;
}

const dirname = import.meta.dirname;

const root = Path.resolve(dirname, "../../");
const configPath = Path.resolve(root, ".cli/config.json");
const config: Config = await import(configPath);
const winPrefix = (os.platform() == "win32" ? "file://" : "");
const exportsPath = winPrefix + Path.resolve(root, config.blockDirectory, "exports.ts");

Command.register(
  new Command("create:block")
    .setDescription("Create a new block")
    .setSyntax("<BlockName>")
    .setCallback((keyArgs, blockName) => {
      if (!blockName) {
        console.error("No block name provided");
        process.exit(1);
      }
      const blockDir = winPrefix + Path.resolve(root, config.blockDirectory, blockName);
      const templateDir = winPrefix + Path.resolve(dirname, "../templates/block");
      if (fs.existsSync(blockDir)) {
        console.error(`Block directory already exists: ${blockDir}`);
        process.exit(1);
      }
      // Copy all files and folders from templateDir to blockDir
      fs.cpSync(templateDir, blockDir, { recursive: true });

      function recursivelyReplaceInDir(dir: string, vars: {
        [searchValue: string]: string
      }) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = Path.join(dir, entry.name);
          if (entry.isDirectory()) {
            recursivelyReplaceInDir(fullPath, vars);
          } else if (entry.isFile()) {
            let initial = "";
            let content = initial = fs.readFileSync(fullPath, "utf8");
            for (const [searchValue, replaceValue] of Object.entries(vars)) {
              const newContent = content.split(searchValue).join(replaceValue);
              content = newContent;
            }
            if (content === initial) continue;
            console.log(`Updating: ${fullPath}`);
            fs.writeFileSync(fullPath, content, "utf8");
          }
        }
      }

      // Replace variables in all blockDir files
      recursivelyReplaceInDir(blockDir, {
        "{{BLOCK}}": blockName
      });

      // Update exports.ts
      const regex = /(blocks[\s\S]*?:[\s\S]*?\([\s\S]*?\[\s*)([\s\S]*?)(\s*\][\s\S]*?\))/;
      const exportsFile = fs.readFileSync(exportsPath, "utf8");
      const match = exportsFile.match(regex);
      if (!match) {
        console.error("Could not find blocks array in exports.ts");
        process.exit(1);
      }
      let [fullMatch, prefix, existingBlocks, suffix] = match;
      const newBlockImport = `import { ${blockName}Block } from "./${blockName}/config";\n`;
      let newExportsFile = exportsFile;
      if (!existingBlocks.trim().endsWith(",")) {
        existingBlocks += ",";
      }
      if (!existingBlocks.includes(blockName)) {
        newExportsFile = newExportsFile.replace(regex, `${prefix}${existingBlocks}\n    ${blockName}Block,${suffix}`);
      }
      if (!newExportsFile.includes(newBlockImport)) {
        newExportsFile = newBlockImport + newExportsFile;
      }
      if (newExportsFile !== exportsFile) {
        fs.writeFileSync(exportsPath, newExportsFile, "utf8");
        console.log(`Updated exports.ts to include ${blockName}`);
      } else {
        console.log(`exports.ts already includes ${blockName}`);
      }

      console.log(`Block created: ${blockDir}`);
    })
);




// Execute command from process arguments
const rawArgs = process.argv.slice(2);

if (rawArgs.length < 1) {
  console.error("No command provided");
  // Display commands
  Command.executeFromString("help");
  process.exit(0);
} else {
  Command.executeFromString(rawArgs.join(" "));
}