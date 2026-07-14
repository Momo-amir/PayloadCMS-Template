import Path from "path";
import fs from "fs";
import os from "os";
import Command from "./Command";
import { discover } from "./discovery";
import { generate } from "./generate";
import { selectFeatures } from "./select";

interface Config {
  blockDirectory: string;
}

const dirname = import.meta.dirname;

const rootFlag = process.argv.find((a) => a.startsWith("--root="))?.slice("--root=".length);
const root = rootFlag ? Path.resolve(rootFlag) : Path.resolve(dirname, "../../");
const winPrefix = (os.platform() == "win32" ? "file://" : "");
const configPath = winPrefix + Path.resolve(root, ".cli/config.json");
const config: Config = await import(configPath);
const exportsPath = Path.resolve(root, config.blockDirectory, "exports.ts");

Command.register(
  new Command("create:block")
    .setDescription("Create a new block")
    .setSyntax("<BlockName>")
    .setCallback((keyArgs, blockName) => {
      if (!blockName) {
        console.error("No block name provided");
        process.exit(1);
      }
      const blockDir = Path.resolve(root, config.blockDirectory, blockName);
      const templateDir = Path.resolve(dirname, "../templates/block");
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




Command.register(
  new Command("list")
    .setDescription("List discoverable features (blocks + collections)")
    .setCallback(() => {
      const d = discover(root);
      const byGroup = new Map<string, typeof d.blocks>();
      for (const b of d.blocks) {
        const g = b.override.group ?? "Ungrouped";
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g)!.push(b);
      }
      console.log(`\nBlocks (${d.blocks.length}):`);
      for (const [group, blocks] of [...byGroup].sort()) {
        console.log(`  ${group}`);
        for (const b of blocks.sort((a, z) => a.slug.localeCompare(z.slug))) {
          const tags = [
            b.registeredIn === "blocksFeature" ? "inline" : null,
            b.showOnPage ? null : "sub-block",
            b.children.length ? `container(${b.children.map((c) => c.slug).join(",")})` : null,
            b.override.requiresCollections?.length ? `needs:${b.override.requiresCollections.join(",")}` : null,
            b.override.requiresPlugins?.length ? `plugins:${b.override.requiresPlugins.length}` : null,
          ].filter(Boolean);
          console.log(`    - ${b.slug.padEnd(24)} ${tags.length ? `[${tags.join(" ")}]` : ""}`);
        }
      }
      console.log(`\nCollections (${d.collections.length}):`);
      for (const c of d.collections) console.log(`    - ${c.symbol}`);
      console.log();
    })
);

Command.register(
  new Command("generate")
    .setDescription("Generate a new site: keep selected blocks, prune the rest")
    .setSyntax("--out=<dir> [--blocks=<slug,...>] [--dry-run]  (omit --blocks for interactive)")
    .setCallback(async (keyArgs) => {
      const dryRun = keyArgs["dry-run"] === true;
      const out = typeof keyArgs.out === "string" ? keyArgs.out : "";
      const blocksArg = typeof keyArgs.blocks === "string" ? keyArgs.blocks : "";
      let keepBlockSlugs = blocksArg.split(",").map((s) => s.trim()).filter(Boolean);
      const collectionsArg = typeof keyArgs.collections === "string" ? keyArgs.collections : "";
      let keepCollectionSlugs: string[] | undefined = collectionsArg
        ? collectionsArg.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

      if (!dryRun && !out) {
        console.error("Provide --out=<dir> (or use --dry-run to preview).");
        process.exit(1);
      }

      // Interactive selection when --blocks is not supplied.
      if (keepBlockSlugs.length === 0) {
        const sel = await selectFeatures(root);
        if (!sel) {
          console.error("Aborted.");
          process.exit(1);
        }
        keepBlockSlugs = sel.keepBlockSlugs;
        keepCollectionSlugs = sel.keepCollectionSlugs;
      }
      if (keepBlockSlugs.length === 0) {
        console.error("No blocks selected — nothing to generate.");
        process.exit(1);
      }

      const outDir = out ? Path.resolve(root, out) : "";
      if (outDir && fs.existsSync(outDir) && fs.readdirSync(outDir).length > 0) {
        console.error(`Output dir not empty: ${outDir}`);
        process.exit(1);
      }

      const plan = generate({ root, outDir, keepBlockSlugs, keepCollectionSlugs, dryRun });

      console.log(`\n${dryRun ? "DRY RUN — plan only" : `Generated at ${outDir}`}`);
      console.log(`\nKept blocks (${plan.keptBlocks.length}): ${plan.keptBlocks.join(", ")}`);
      console.log(`\nPruned blocks (${plan.prunedBlocks.length}): ${plan.prunedBlocks.join(", ") || "(none)"}`);
      console.log(`\nFolders removed:`);
      for (const f of plan.prunedFolders) console.log(`  - ${f}`);
      console.log(`\nRegistration edits:`);
      for (const e of plan.registrationEdits) console.log(`  - ${e.file}: remove ${e.symbols.join(", ")}`);
      if (plan.containerChildEdits.length) {
        console.log(`\nContainer child prunes:`);
        for (const e of plan.containerChildEdits)
          console.log(`  - ${e.containerConfig}: remove children ${e.removeChildSlugs.join(", ")}`);
      }
      if (plan.prunedCollections.length) {
        console.log(`\nPruned collections (${plan.prunedCollections.length}):`);
        for (const c of plan.prunedCollections)
          console.log(`  - ${c.slug}${c.conflicts.length ? ` [conflicts: ${c.conflicts.join(", ")}]` : ""}`);
      }
      if (plan.warnings.length) {
        console.log(`\nWarnings:`);
        for (const w of plan.warnings) console.log(`  ! ${w}`);
      }
      if (!dryRun) {
        console.log(`\nNext: cd ${out} && yarn install && yarn generate:types`);
      }
      console.log();
    })
);

Command.register(
  new Command("manifest")
    .setDescription("Validate feature discovery + overrides")
    .setSyntax("validate")
    .setCallback((_keyArgs, sub) => {
      if (sub !== "validate") {
        console.error("Usage: yarn cli manifest validate");
        process.exit(1);
      }
      const d = discover(root);
      const errors: string[] = [];
      const collSlugs = new Set([...d.collections.map((c) => c.slug), ...d.pluginCollections]);
      for (const b of d.blocks) {
        const abs = Path.resolve(root, b.configPath);
        if (!fs.existsSync(abs)) errors.push(`${b.slug}: config path missing (${b.configPath})`);
        for (const need of b.override.requiresCollections ?? []) {
          if (!collSlugs.has(need)) errors.push(`${b.slug}: requiresCollections "${need}" not a known collection`);
        }
        if (b.override.onlyInside && !d.blocks.some((x) => x.slug === b.override.onlyInside)) {
          errors.push(`${b.slug}: onlyInside "${b.override.onlyInside}" is not a known block`);
        }
      }
      if (errors.length) {
        console.error(`\nmanifest validate: ${errors.length} problem(s):`);
        for (const e of errors) console.error(`  ✗ ${e}`);
        process.exit(1);
      }
      console.log(`\nmanifest validate: OK — ${d.blocks.length} blocks, ${d.collections.length} collections, no problems.\n`);
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