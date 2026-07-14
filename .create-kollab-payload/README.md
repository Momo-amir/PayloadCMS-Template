# create-kollab-payload

Generate a Kollab Payload CMS + Next.js client site from the
[`kollab-payload-template`](https://github.com/Momo-amir/PayloadCMS-Template).

> Clones the public template repo over HTTPS — no SSH or credentials needed. `git` and
> `yarn`/`corepack` must be on your PATH. To fetch from the private Bitbucket origin instead, pass
> `--template-repo=git@bitbucket.org:it-kartellet/kollab-payload-template.git`.

## Usage

```bash
npx create-kollab-payload my-site
```

You'll be asked for a project name (if omitted), then presented with a feature catalog — everything
is selected by default; deselect what you don't need. To skip the prompts entirely, pass the slugs:

```bash
npx create-kollab-payload my-site --blocks=mediaBlock,cardBlock --collections=posts,categories
```

### What it does

1. Asks for the project name.
2. Fetches the template at `v<version>` (the initializer version maps to a template git tag) and
   prepares the feature catalog.
3. Presents the feature selection screen (skipped when `--blocks` is passed).
4. Copies the template and prunes everything you didn't select, then cleans generator-only artifacts
   (keeps `yarn cli create:block`).
5. Copies `.env.example` → `.env`.
6. Runs `yarn install` in your project (unless `--skip-install`).
7. Creates the git repo with an initial commit (unless `--skip-git`).

Then:

```bash
cd my-site
yarn generate:types   # regenerate Payload types (needs the DB up)
yarn docker-dev       # start Payload + Postgres on :8890
```

## Flags

| Flag | Default | Purpose |
|---|---|---|
| `--template-ref=<ref>` | `v<initializer version>` | Git tag/branch of the template to clone. |
| `--template-repo=<url>` | Public GitHub template repo (HTTPS) | Template repo URL. Accepts the private Bitbucket SSH URL or a local `file://` clone for testing. |
| `--blocks=<slug,…>` | interactive | Block slugs to keep (skips the selection screen). |
| `--collections=<slug,…>` | interactive | Optional-collection slugs to keep. |
| `--heros=<slug,…>` | interactive | Presentational heros to keep (`highImpact`, `mediumImpact`, `lowImpact`). |
| `--plugins=<slug,…>` | interactive | Payload plugins to keep (`redirects`, `form-builder`, `search`). Pruning cascades to related blocks/collections. |
| `--brand="<name>"` | project name | Site/brand name written into the generated project. |
| `--skip-install` | off | Don't run `yarn install` in the generated project. |
| `--skip-git` | off | Don't `git init` / create the initial commit. |

Set `NO_COLOR=1` to disable colored output.

## Releasing

The initializer's `version` maps to a template git tag `vX.Y.Z`. On a template release, tag the
template and push the tag to the **public GitHub repo** (the default fetch source), then publish a
matching initializer version:

```bash
# in the template repo
git tag -a vX.Y.Z -m "vX.Y.Z"
git push ghub vX.Y.Z          # ghub = https://github.com/Momo-amir/PayloadCMS-Template
git push origin vX.Y.Z        # also tag private Bitbucket origin
# in this package
npm version X.Y.Z && npm publish --access public
```
