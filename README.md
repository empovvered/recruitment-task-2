# Recruitment task 2

Next.js 16 (App Router), React 19 and Tailwind CSS 4, with formatting, linting, commit conventions, git hooks and a test
runner configured and enforced from the first commit. See Conventions below. Nothing task-specific lives here yet.

## Setup

Requires Node.js 22 (22.12.0 or newer) and pnpm 10.22.0. `corepack enable` picks the right pnpm up from the
`packageManager` field.

```bash
pnpm install   # also runs `prepare`, which installs the git hooks
pnpm dev       # http://localhost:3000
```

A plain `npm install` followed by `npm run dev` works too; the dependency ranges are kept compatible with npm's stricter
peer resolution.

If git reports that a hook `was ignored because it's not set as executable`, run `chmod ug+x .husky/*`.

## Available commands

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Start the development server on port 3000                 |
| `pnpm build`        | Production build                                          |
| `pnpm start`        | Serve the production build                                |
| `pnpm lint`         | Run ESLint over the repository                            |
| `pnpm lint:fix`     | Run ESLint and apply every autofix                        |
| `pnpm format`       | Rewrite the tree with Prettier                            |
| `pnpm format:check` | Fail if anything is not Prettier-formatted                |
| `pnpm typecheck`    | Generate Next's route types, then type-check with no emit |
| `pnpm test`         | Run the test suite once                                   |
| `pnpm test:watch`   | Run the test suite in watch mode                          |

## Where things live

```
src/app        the routes, the root layout and the global stylesheet
src/tests      the render helper, the provider wrapper it uses and the runner setup
typings        ambient types shared by the whole project
```

Files sit next to what they serve, with the suffix saying what they are: `.types`, `.utils`, `.queries`, `.schema`,
`.constants`, `.test`. Imports use the bare aliases declared in `tsconfig.json` (`components/...`, `hooks/...`,
`tests`), not relative paths across directories.

## Conventions

### Commits and branches

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope)?: subject`, where
`type` is one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test` or `ci`. This is enforced by commitlint in the
`commit-msg` hook, so a malformed message is rejected before the commit is created.

Branch names must be `main`, `develop`, or `feature|bugfix|hotfix|release|chore/<name>`. This is checked in
`pre-commit`.

### Code style

Prettier owns formatting: no semicolons, double quotes, 120 columns, trailing commas, and Tailwind classes sorted by
`prettier-plugin-tailwindcss`. ESLint layers the Next.js core-web-vitals and TypeScript presets on top, and adds
`prettier/prettier`, sorted imports, `@stylistic` blank-line rules, `type` over `interface`, and a ban on `any`.

Two hooks keep this honest: `pre-commit` runs lint-staged (`pnpm typecheck`, plus `eslint --fix` and `prettier --write`
over the staged files only), and `pre-push` runs `pnpm typecheck` and `pnpm lint` over the whole repository.

### Tests

Vitest with Testing Library and jsdom. Specs are named `<name>.test.ts(x)` and sit next to the code they cover. Import
`render` and the queries from `tests` rather than from Testing Library directly, so every component under test is
wrapped in the same providers the app wraps it in.
