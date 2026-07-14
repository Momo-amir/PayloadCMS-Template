# create-kollab-payload

Generate a Kollab Payload CMS + Next.js client site from the
[`kollab-payload-template`](https://github.com/Momo-amir/PayloadCMS-Template).

> Clones the template over public HTTPS from the GitHub mirror — no SSH or credentials needed. `git`
> and `yarn`/`corepack` must be on your PATH. To fetch from the private Bitbucket origin instead, pass
> `--template-repo=git@bitbucket.org:it-kartellet/kollab-payload-template.git`.

## Usage

```bash
npx create-kollab-payload my-site
```

Interactive block/collection selection runs automatically. To skip the prompts, pass the slugs:

```bash
npx create-kollab-payload my-site --blocks=mediaBlock,cardBlock --collections=posts,categories
```

### What it does

1. `git clone --depth 1 --branch v<version>` the template (the initializer version maps to a template
   git tag).
2. `yarn install` inside the clone (needed to run the copy-then-prune engine).
3. Runs the template's own `.cli` engine (`yarn cli generate`) to copy the template and prune
   everything you didn't select.
4. Cleans generator-only artifacts from your project (keeps `yarn cli create:block`).
5. `git init` a fresh repository.

Then:

```bash
cd my-site
yarn install
yarn generate:types
```

## Flags

| Flag | Default | Purpose |
|---|---|---|
| `--template-ref=<ref>` | `v<initializer version>` | Git tag/branch of the template to clone. |
| `--template-repo=<url>` | GitHub mirror (HTTPS) | Template repo URL. Accepts the private Bitbucket SSH URL or a local `file://` clone for testing. |
| `--blocks=<slug,…>` | interactive | Block slugs to keep (skips the block prompt). |
| `--collections=<slug,…>` | interactive | Optional-collection slugs to keep. |

## Releasing

The initializer's `version` maps to a template git tag `vX.Y.Z`. On a template release, tag the
template and push the tag to the **public GitHub mirror** (the default fetch source), then publish a
matching initializer version:

```bash
# in the template repo
git tag -a vX.Y.Z -m "vX.Y.Z"
git push ghub vX.Y.Z          # ghub = https://github.com/Momo-amir/PayloadCMS-Template
git push origin vX.Y.Z        # also tag private Bitbucket origin
# in this package
npm version X.Y.Z && npm publish --access public
```
