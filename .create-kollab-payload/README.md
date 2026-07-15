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

### Adding a block later

Run from the root of an existing generated project to pull a block (and its file closure) in from
the template:

```bash
npx create-kollab-payload add cardBlock
```

It copies the block folder plus every shared file it imports that the project doesn't already have,
registers it in `src/website/blocks/exports.ts`, and refuses (rather than dangling a `relationTo`) if
the block needs a collection or plugin the project no longer has. Afterwards run
`yarn generate:types && yarn generate:importmap`. Only blocks are supported today — adding
collections/plugins is not yet wired.

### What it does

1. Asks for the project name.
2. Fetches the template at `v<version>` (the initializer version maps to a template git tag). No
   install runs in the clone — the pruning engine is bundled in this package and runs against it.
3. Presents the feature selection screen (skipped when `--blocks` is passed).
4. Copies the template and prunes everything you didn't select, then cleans generator-only artifacts
   (keeps `yarn cli create:block`).
5. Copies `.env.example` → `.env`.
6. Installs dependencies in your project once (unless `--skip-install`) — via `corepack yarn`, a
   host `yarn`, or `npm` as a fallback.
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

## Releasing (automated)

A version lives in **three** places that must stay in lockstep:

| Place | What it is |
|---|---|
| `package.json` `version` | the npm package version |
| **git tag `vX.Y.Z`** | the template snapshot the initializer clones (`git clone --branch vX.Y.Z`) |
| **npm registry** | what `npx` downloads |

The initializer resolves its default template ref as `v<its own version>`. Keeping these three in
sync used to be a manual 9-step dance; it is now driven by **CI on a version-bump commit**.

### To cut a release

```bash
cd .create-kollab-payload
npm version X.Y.Z --no-git-tag-version   # bump only package.json (+ lockfile); no local tag
cd ..
git add .create-kollab-payload/package.json .create-kollab-payload/package-lock.json
git commit -m "create-kollab-payload X.Y.Z"
git push origin main                     # push to Bitbucket as usual
```

That's it. From there:

1. **Bitbucket Pipelines** (`bitbucket-pipelines.yml`, *Mirror to GitHub* step) mirrors `main` + tags
   to the public GitHub repo. Needs repository variables `GITHUB_TOKEN` (a GitHub PAT with `repo`
   scope) and `GITHUB_REPO` (e.g. `Momo-amir/PayloadCMS-Template`).
2. **GitHub Actions** (`.github/workflows/release.yml`) sees the initializer changed, reads the new
   version, and — if tag `vX.Y.Z` doesn't exist yet — builds the package, publishes it to npm via
   **trusted publishing (OIDC)**, then creates and pushes tag `vX.Y.Z` on the commit. No npm token is
   stored: npm verifies the publish came from this repo's `release.yml` workflow. Pushes without a
   version bump are safe no-ops.

> **One caveat:** the Bitbucket `GITHUB_TOKEN` intentionally lacks the `workflow` scope, so the
> mirror step **cannot** push commits that add or change files under `.github/workflows/`. Normal
> commits (source, docs, version bumps) mirror fine; when you edit a workflow file, push that commit
> to GitHub yourself once: `git push ghub main`. After that, Bitbucket-only pushing resumes.

The tag is authored **on GitHub** (where `npx` clones from), so the version→tag→npm contract can't
drift: publishing and tagging happen together in one job, keyed off the single version number.

> One-time setup:
> - **npm** — on the `create-kollab-payload` package, add a Trusted Publisher: GitHub Actions,
>   org/user `Momo-amir`, repo `PayloadCMS-Template`, workflow filename `release.yml`, action
>   `publish`. (No `NPM_TOKEN` secret needed.)
> - **Bitbucket** — set repository variables `GITHUB_TOKEN` (a GitHub PAT with `repo` scope, for the
>   mirror step) and `GITHUB_REPO` (`Momo-amir/PayloadCMS-Template`).
>
> Verify a release landed:
> `git ls-remote --tags https://github.com/Momo-amir/PayloadCMS-Template.git vX.Y.Z` and
> `npm view create-kollab-payload version`.
