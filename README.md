# Recruitment task 2

A page with one button, Dodaj dokument, that opens a modal. Next.js 16 (App Router), React 19 and Tailwind CSS 4, with
formatting, linting, commit conventions, git hooks and a test runner configured and enforced from the first commit. See
Conventions below.

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

| Decision                                            | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A route handler as the submit target                | The task allows a mock or a simulated request. A real `fetch` to a real endpoint makes loading, success, failure and retry genuine, works after a plain `npm run dev` with nothing else switched on, and deploys as it is. The fixtures are imported statically, so they stay in the server bundle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `422` for the error fixture                         | The fixture describes a document the backend refused (`VALIDATION_BACKEND`), not a service that is down, and the client still sees a failed response. The fixture carries no status of its own, so this is an assumption.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `202` for the success fixture                       | The fixture says the document was accepted for verification, not that verification finished.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `?fail=once` counted by the client                  | A retry that succeeds is the flow the task describes. The client numbers its attempts in a header, so the endpoint stays stateless and a dev server restart cannot change the outcome.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| The modal is written here, not taken from a library | Focus is the graded part: where it lands on open, that Tab and Shift+Tab stay inside, that Escape closes and that it returns to the opening button. A dialog library would own exactly those behaviours, and the brief says a helper library does not take the responsibility for them away. While it is open the page behind it is `inert` and Escape and Tab are handled at the document level, so focus cannot leave even after a click on plain text, and the close control is the last stop in the Tab order so that the first field is the first. Forty lines of keyboard handling in one place are easier to read and to test than a dependency's configuration. The native `dialog` element was ruled out because jsdom does not implement `showModal`, so the keyboard tests would exercise nothing. |
| A busy button stays focusable                       | A button that becomes `disabled` while a request is in flight throws focus out of the modal. While loading it is `aria-disabled` and `aria-busy` instead, ignores presses, and keeps the focus it has.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Every field owns its label, description and error   | A field renders its `label`, its `description` and its `errorMessage` itself and links them to the control through `htmlFor`, `aria-describedby`, `aria-invalid` and `aria-required`; a required field is announced as such but never blocked by the browser's own validation bubble, so the rules the brief describes stay in one place. The association cannot be forgotten at a call site because there is no call site that assembles it.                                                                                                                                                                                                                                                                                                                                                                 |
| One light palette                                   | The scaffold shipped a dark override that only repainted the page behind components that stayed light. One committed scheme with a few semantic colour tokens is cheaper here than a second set of tokens.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| One schema describes a valid document               | The rules the brief lists live in one zod schema next to the form: required number, required and well-formed e-mail, required consent, a note of at most 200 characters that becomes required for the type Other. The form validates against it, and the endpoint will parse the body with the same schema, so a rule cannot be true on one side and false on the other.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Validation runs on submit, then on change           | The submit button stays enabled. Pressing it reports every problem at once, each next to its field and linked through `aria-describedby`, and moves focus to the first invalid field; from then on a field is re-checked as it changes. A submit that is disabled until the form is valid gives a keyboard or screen reader user no way to find out what is missing.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| A field comes in two layers                         | `Input` renders and links a native control; `InputField` connects it to the form through a controller and hands it the error to show. The plain layer stays usable outside a form, and the form layer cannot forget the association because it does not assemble it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Assumptions

- **The document type is not required** and starts as `ID`, so the first interactive element of the modal is a select
  with a value. The option labels are the ones the brief uses.
- **Values are trimmed before validation and submission.** A number made of spaces is a missing number, and the 200
  characters of the note are counted after trimming.
- **The whole modal is one form.** Closing it discards what was typed; reopening it starts from an empty form.

## Where things live

```
src/api/apiActions/documents   the endpoint's response types, its scenario constants and the fixtures as mock data
src/app/api/documents          the route handler and its test
src/app                        the routes, the root layout and the global stylesheet
src/app/_components            what only the home page uses: the add-document button, its modal, the schema
src/components/modal           a dialog that owns its focus: where it lands, that it stays, where it returns
src/components/button          every button, with one disabled and one busy treatment
src/components/form            the form and the field vocabulary: label, error message, input, select, checkbox, textarea
src/components/icons           the few icons the components need
src/constants                  search param, header and status code names, form limits
src/hooks                      the form hook, the field controller and the ids a field links its label and error with
src/tests                      the render helper, the provider wrapper it uses and the runner setup
src/utils                      the class-name helper
src/types                      domain unions
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
