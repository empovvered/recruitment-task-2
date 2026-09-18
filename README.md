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

## The submit endpoint

`POST /api/documents` is what the form will submit to. It answers with the delivered fixtures, so loading, success,
failure and retry are a real request rather than a staged state. The scenarios are switches in the query string, so each
one is reachable from a link:

| Request               | Answer                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| `POST /api/documents` | `202 Accepted` with `data/submit-success.json`                                 |
| `?fail=1`             | `422 Unprocessable Content` with `data/submit-error.json`, on every attempt    |
| `?fail=once`          | the error fixture on the first attempt, the success fixture from the second on |
| `?delay=ms`           | waits up to 5000 ms before answering, so the loading state can be seen         |

The attempt is whatever the `X-Submit-Attempt` header says, or 1 when the header is absent, so the endpoint keeps no
state. The body is not read yet: the submission contract arrives together with the form validation, so the form and the
endpoint will share one schema.

## Technical decisions

| Decision                             | Why                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A route handler as the submit target | The task allows a mock or a simulated request. A real `fetch` to a real endpoint makes loading, success, failure and retry genuine, works after a plain `npm run dev` with nothing else switched on, and deploys as it is. The fixtures are imported statically, so they stay in the server bundle. |
| `422` for the error fixture          | The fixture describes a document the backend refused (`VALIDATION_BACKEND`), not a service that is down, and the client still sees a failed response. The fixture carries no status of its own, so this is an assumption.                                                                           |
| `202` for the success fixture        | The fixture says the document was accepted for verification, not that verification finished.                                                                                                                                                                                                        |
| `?fail=once` counted by the client   | A retry that succeeds is the flow the task describes. The client numbers its attempts in a header, so the endpoint stays stateless and a dev server restart cannot change the outcome.                                                                                                              |

## Where things live

```
src/api/apiActions/documents   the endpoint's response types, its scenario constants and the fixtures as mock data
src/app/api/documents          the route handler and its test
src/app                        the routes, the root layout and the global stylesheet
src/constants                  search param, header and status code names
src/tests                      the render helper, the provider wrapper it uses and the runner setup
typings                        ambient types shared by the whole project
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
