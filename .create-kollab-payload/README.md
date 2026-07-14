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

A version lives in **three** places that must move together:

| Place | What it is | Updated by |
|---|---|---|
| `package.json` `version` | the npm package version | `npm version` |
| **git tag `vX.Y.Z`** | the template snapshot the initializer clones | `git tag` + `git push` |
| **npm registry** | what `npx` downloads | `npm publish` |

The initializer resolves its default template ref as `v<its own version>` — so
`create-kollab-payload@X.Y.Z` runs `git clone --branch vX.Y.Z`. If that tag is missing on the public
GitHub repo, every run fails. **Bumping the version therefore requires creating the matching tag.**

### Steps (run from the template repo root)

```bash
# 1. Bump the package version (no auto git tag — we manage the template tag ourselves)
cd .create-kollab-payload
npm version X.Y.Z --no-git-tag-version
cd ..

# 2. Commit the bump
git add .create-kollab-payload/package.json .create-kollab-payload/package-lock.json
git commit -m "create-kollab-payload X.Y.Z"

# 3. Tag THAT commit — this is the snapshot the initializer clones, so it must include
#    every change you want shipped (tag HEAD, after the bump commit)
git tag -a vX.Y.Z -m "vX.Y.Z"

# 4. Push branch + tag to BOTH remotes (ghub = public GitHub, the default fetch source)
git push ghub  <branch> && git push origin <branch>
git push ghub  vX.Y.Z   && git push origin vX.Y.Z

# 5. Move main forward too (npx clones the tag, but keep main current)
git fetch . <branch>:main
git push ghub main && git push origin main

# 6. Publish to npm (needs `npm login`; prepublishOnly rebuilds dist/)
cd .create-kollab-payload
npm publish --access public
```

Verify the tag is live before publishing:
`git ls-remote --tags https://github.com/Momo-amir/PayloadCMS-Template.git vX.Y.Z`

> Pushing the branch alone is **not** a release — the tag is what the tool consumes, and `npm publish`
> is what puts the new initializer on the registry. Until you publish, `npx` still serves the old version.
