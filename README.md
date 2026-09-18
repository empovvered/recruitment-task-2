# Recruitment task 2

A page with one button, Dodaj dokument, that opens a modal with a form: document type, number, owner's e-mail, a consent
and a note. The form validates, sends the document to a simulated endpoint, shows the request in flight, and ends in
either the accepted document or the reason it was refused, with a retry that keeps what was typed. The whole flow is
operable from the keyboard and readable by assistive technology, which is what the brief grades.

Next.js 16 (App Router), React 19 and Tailwind CSS 4, with react-hook-form and zod for the form, React Query for the
request, and formatting, linting, commit conventions, git hooks and a test runner configured and enforced from the first
commit. See Conventions below.

## Setup

Requires Node.js 22 (22.12.0 or newer) and pnpm 10.22.0. `corepack enable` picks the right pnpm up from the
`packageManager` field.

```bash
pnpm install   # also runs `prepare`, which installs the git hooks
pnpm dev       # http://localhost:3000
```

A plain `npm install` followed by `npm run dev` works too; the dependency ranges are kept compatible with npm's stricter
peer resolution.

The git hooks call `pnpm`. A clone that only has npm can still commit with `HUSKY=0 git commit ...`, or after
`corepack enable`. If git reports that a hook `was ignored because it's not set as executable`, run
`chmod ug+x .husky/*`.

## Seeing it work

The states the task asks for are reachable from the address bar, so none of them needs a code change to demonstrate:

| URL                   | What the submit does                                          |
| --------------------- | ------------------------------------------------------------- |
| `/`                   | accepts the document                                          |
| `/?delay=2000`        | waits two seconds first, so the request in flight can be seen |
| `/?fail=1`            | refuses the document every time                               |
| `/?fail=once`         | refuses the first attempt and accepts the retry               |
| `/?delay=1500&fail=1` | shows the request in flight, then the refusal                 |

The switches work from the page because the form forwards the page's query string to the endpoint. The endpoint can also
be driven without the page:

```bash
curl -i -X POST 'http://localhost:3000/api/documents?fail=once' \
  -H 'content-type: application/json' \
  -H 'X-Submit-Attempt: 1' \
  -d '{"documentType":"id","documentNumber":"ABC 123456","ownerEmail":"anna@example.pl","consent":true,"note":""}'
```

The same call with `X-Submit-Attempt: 2` is accepted, and a body that breaks the contract, say `"ownerEmail":"x"`, is
answered with `400` and the offending field.

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

`POST /api/documents` is what the form submits to. It answers with the delivered fixtures, so loading, success, failure
and retry are a real request rather than a staged state. The scenarios are switches in the query string, so each one is
reachable from a link:

| Request               | Answer                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| `POST /api/documents` | `202 Accepted` with `data/submit-success.json`                                 |
| `?fail=1`             | `422 Unprocessable Content` with `data/submit-error.json`, on every attempt    |
| `?fail=once`          | the error fixture on the first attempt, the success fixture from the second on |
| `?delay=ms`           | waits up to 5000 ms before answering, so the loading state can be seen         |

The attempt is whatever the `X-Submit-Attempt` header says, or 1 when the header is absent, so the endpoint keeps no
state. The body is parsed with the same schema the form validates against, so a body that breaks the contract is
answered with `400` and the offending field.

## Technical decisions

| Decision                                                               | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A route handler as the submit target                                   | The task allows a mock or a simulated request. A real `fetch` to a real endpoint makes loading, success, failure and retry genuine, works after a plain `npm run dev` with nothing else switched on, and deploys as it is. The fixtures are imported statically, so they stay in the server bundle.                                                                                                                                                                                                                                                                                                                                                                                              |
| `422` for the error fixture                                            | The fixture describes a document the backend refused (`VALIDATION_BACKEND`), not a service that is down, and the client still sees a failed response. The fixture carries no status of its own, so this is an assumption.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `202` for the success fixture                                          | The fixture says the document was accepted for verification, not that verification finished.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| The modal is written here, not taken from a library                    | Focus is the graded part: where it lands on open, that Tab and Shift+Tab stay inside, that Escape closes and that it returns to the opening button. A dialog library would own exactly those behaviours, and the brief says a helper library does not take the responsibility for them away. While the modal is open the page behind it is `inert` and Escape and Tab are handled at the document level, so focus cannot leave even after a click on plain text; the close control is the last stop in the Tab order so that the first field is the first. The native `dialog` element was ruled out because jsdom does not implement `showModal`, so the keyboard tests would exercise nothing. |
| A busy button stays focusable                                          | A button that becomes `disabled` while a request is in flight throws focus out of the modal. While loading it is `aria-disabled` and `aria-busy` instead, ignores presses, and keeps the focus it has.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Every field owns its label and its error                               | A field renders its `label` and its `errorMessage` itself and links them to the control through `htmlFor`, `aria-describedby`, `aria-invalid` and `aria-required`; a required field is announced as such but never blocked by the browser's own validation bubble, so the rules the brief describes stay in one place. The association cannot be forgotten at a call site because there is no call site that assembles it.                                                                                                                                                                                                                                                                       |
| One light palette                                                      | The scaffold shipped a dark override that only repainted the page behind components that stayed light. One committed scheme with a few semantic colour tokens is cheaper here than a second set of tokens.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| One schema describes a valid document                                  | The rules the brief lists live in one zod schema in the document contract: required number, required and well-formed e-mail, required consent, a note of at most 200 characters that becomes required for the type Other. The form validates against it and the endpoint parses the body with it, so a rule cannot be true on one side and false on the other.                                                                                                                                                                                                                                                                                                                                   |
| Validation runs on submit, then on change                              | The submit button stays enabled. Pressing it reports every problem at once, each next to its field and linked through `aria-describedby`, and moves focus to the first invalid field; from then on a field is re-checked as it changes. A submit that is disabled until the form is valid gives a keyboard or screen reader user no way to find out what is missing.                                                                                                                                                                                                                                                                                                                             |
| A field comes in two layers                                            | `Input` renders and links a native control; `InputField` connects it to the form through a controller and hands it the error to show. The plain layer stays usable outside a form, and the form layer cannot forget the association because it does not assemble it.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| The modal owns the request                                             | The modal calls the mutation, keeps the form mounted while the request is in flight and swaps it for the accepted document when the answer arrives. Its parent only opens and closes it. The client numbers its attempts per submit and starts over when the modal closes, so the endpoint can refuse the first one only.                                                                                                                                                                                                                                                                                                                                                                        |
| A request in flight is shown and announced                             | The submit button is busy, the cancel button is disabled, a status line says the document is being sent, and Escape and the close control do nothing until the answer arrives, so the dialog cannot be dismissed with a request pending.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| The accepted document replaces the form in the same dialog             | The message, the document id and the request id are read from the answer, and focus moves to the new title so the change of view is read out; closing is the only action left.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| A refused document is shown in place, and the retry is the same button | The message the server sent is rendered as an alert above the buttons, so it is announced when it appears, and the submit button becomes "Spróbuj ponownie". Nothing the user typed is lost, the modal stays open, and the next press sends attempt two, which is what `?fail=once` accepts. The alert clears itself when the retry starts.                                                                                                                                                                                                                                                                                                                                                      |

## Assumptions

- **The document type is not required** and starts as `ID`, so the first interactive element of the modal is a select
  with a value. The option labels are the ones the brief uses.
- **Values are trimmed before validation and submission.** A number made of spaces is a missing number, and the 200
  characters of the note are counted after trimming.
- **The whole modal is one form.** Closing it discards what was typed; reopening it starts from an empty form.
- **The answer carries no HTTP status.** The success fixture is served with `202` and the error fixture with `422`; the
  accepted document shows `message`, `documentId` and `requestId`, the refusal shows `message`, and `code` is not shown
  to the user.
- **A request in flight cannot be abandoned.** Escape, the close control and the cancel button wait for the answer, so
  the dialog never closes on a document whose fate is unknown.
- **The three document types are fixed.** They come from the brief, not from an endpoint, so they are a constant.

## Principles this solution follows

**A rule lives in exactly one place.** The rules the brief lists are one zod schema, and it is the same object on both
sides of the request: the form validates against it and the endpoint parses the body with it, so a rule cannot be true
in the browser and false on the server. The one cross-field rule is written once, on the object, and reported against
the field it concerns:

```ts
.check((context) => {
  if (context.value.documentType === "other" && !context.value.note) {
    context.issues.push({
      code: "custom",
      path: ["note"],
      message: "Dla typu Other notatka jest wymagana.",
      input: context.value.note,
    })
  }
})
```

**Accessibility belongs to the component, not to a later pass.** A field links its own label and error to the control,
so a screen reader hears the name, the requirement, the invalid state and the reason together, and no call site can
forget the wiring because none assembles it:

```tsx
<input
  {...props}
  id={ids.id}
  type={type}
  data-testid={testId}
  disabled={isDisabled}
  aria-required={isRequired || undefined}
  aria-invalid={invalid || undefined}
  aria-describedby={ids.describedBy}
  className={getInputClassNames({ isInvalid: invalid, isDisabled })}
/>
```

The same principle decides the shape of the modal: it owns where focus lands, that it stays, and where it returns,
rather than leaving that to whoever renders it.

**Let the test find the boundary.** The keyboard specs drive the dialog the way a person would, through the
accessibility tree, and two of the defects fixed here were found that way rather than by reading: a focus trap that held
only while focus was inside the panel, and a note error that outlived the rule that produced it once the type changed
back. Both are now covered.

## Where things live

```
src/api/apiActions/documents   the document contract: schema, types, the mutation, its error and the fixtures as mock data
src/api/queryClient.ts         the React Query client factory
src/app/api/documents          the route handler and its test
src/app                        the routes, the root layout and the global stylesheet
src/app/_components            what only the home page uses: the add-document button and its modal
src/components/modal           a dialog that owns its focus: where it lands, that it stays, where it returns
src/components/button          every button, with one disabled and one busy treatment
src/components/form            the form and the field vocabulary: label, field and form error messages, input, select, checkbox, textarea
src/components/icons           the few icons the components need
src/constants                  search param, header and status code names, form limits
src/hooks                      the form hook, the field controller, the mutation hook and the ids a field links its label and error with
src/providers                  the React Query provider the app and every spec are wrapped in
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

## What I would do next, with another 60–90 minutes

1. **A pass with a screen reader and a real browser.** jsdom cannot see `inert`, the scroll lock or whether an alert and
   a new title are actually read out; a VoiceOver walk through `/?fail=once` and one Playwright spec for the keyboard
   flow would cover what the suite cannot.
2. **Announce a field error that appears without a focus move.** On submit the first invalid field is focused, so its
   error is read; an error that appears later, while the user is elsewhere, is linked but silent until the field is
   revisited. A polite live region for field errors, or a short error summary, would close that gap.
3. **Return focus to a named opener.** The modal remembers whatever was focused when it opened, which is the button in
   every keyboard flow; a browser that does not focus buttons on click would leave nothing to return to. An explicit
   opener reference is the robust form.
4. **Pin the npm path.** A `package-lock.json` next to the pnpm lockfile, or an `engines` field, would make a reviewer's
   `npm install` resolve the same versions the tests ran against.
