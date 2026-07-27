# Kontrak Backend: Project Documentation and Improvement Plan

Analysis date: 2026-06-03  
Project: `kontrak-backend`  
Stack: Node.js, TypeScript, Express 5, Microsoft Graph/OneDrive, Puppeteer, ExcelJS, xlsx-populate, Brevo, Zod, Pino.

## 1. Executive Summary

Kontrak Backend is a TypeScript API and scheduled worker for generating labor contracts, addendums, Excel reports, and notification emails from Excel inputs. It supports both manual API usage and automated OneDrive processing.

The project has a good structural direction. The code is split into `api`, `core`, `domain`, `infrastructure`, `shared`, and `config`, TypeScript strict mode is enabled, Zod is used for validation, and the main OneDrive processing flow is centralized in `FileProcessingOrchestrator`.

The main improvement areas are not a full rewrite. The priority should be reliability, security, and maintainability around the critical flow:

```text
Excel file -> validation -> parsing -> document/report generation -> OneDrive upload -> email notification -> original file cleanup
```

## 2. Verified Project Status

Commands run during this analysis:

| Command | Result |
|---|---|
| `npm.cmd run type-check` | Passed |
| `npm.cmd run lint` | Passed with 13 warnings |
| `rg --files -g "*test*" -g "*spec*"` | No test/spec files found |
| `npm.cmd audit --audit-level=low` | Failed due to 8 vulnerabilities |

Current audit summary:

| Severity | Packages |
|---|---|
| High | `axios`, `tmp` |
| Moderate | `brace-expansion`, `nodemailer`, `qs`, `uuid` via `exceljs`, `ws` |

The repository also has existing local changes. This document was created without modifying those files.

## 3. Current Architecture

High-level source layout:

```text
src/
  api/              Express routes, controllers, and middlewares
  config/           App config and basic service container
  core/             Orchestration, processors, and notifications
  domain/           Excel and contract business logic, validators, templates
  infrastructure/   OneDrive, email, browser/Puppeteer adapters
  services/         Legacy or extra service code
  shared/           Constants, utilities, shared types
  types/            Custom type declarations
```

Main entrypoints:

| File | Purpose |
|---|---|
| `src/index.ts` | Starts Express and the OneDrive scheduler |
| `src/app.ts` | Builds the Express application and registers routes |
| `src/server.ts` | Starts the HTTP listener |
| `src/api/routes/index.ts` | Mounts API route groups |
| `src/infrastructure/onedrive/scheduler/onedrive.scheduler.ts` | Runs OneDrive polling |
| `src/infrastructure/onedrive/services/onedrive.service.ts` | Lists files and delegates processing |
| `src/core/orchestration/file-processing.orchestrator.ts` | Coordinates validation, generation, upload, email, and cleanup |

## 4. API Surface

Detected routes:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Root health/info response |
| `GET` | `/api/health` | Basic health check |
| `POST` | `/api/contracts/download-zip` | Generate contract ZIP from employee batch |
| `POST` | `/api/contracts/preview` | Preview one contract PDF |
| `POST` | `/api/excel/upload` | Upload and parse Excel employee data |
| `GET` | `/api/excel/excel-to-image` | Generate image from body data |
| `POST` | `/api/excel/download-lawlife` | Generate Vida Ley Excel |
| `POST` | `/api/excel/download-sctr` | Generate SCTR Excel |
| `POST` | `/api/excel/download-photocheck` | Generate Fotocheck CSV |
| `POST` | `/api/addendum/upload` | Upload and parse addendum Excel |

Validation status:

- `download-zip`, `download-lawlife`, `download-sctr`, and `download-photocheck` use `EmployeeBatchSchema`.
- Excel and addendum uploads validate file type and size through Multer.
- `/api/contracts/preview` currently accepts `req.body` without Zod validation.
- `/api/excel/excel-to-image` is a `GET` endpoint but reads request body data, which is not reliable across clients and proxies.

## 5. Strengths

- Clear layered folder structure.
- TypeScript strict mode is enabled.
- Type-check currently passes.
- Lint currently has warnings only, no blocking errors.
- Zod validates employee and addendum inputs.
- File upload middleware checks extension and MIME type.
- OneDrive storage is abstracted behind storage interfaces.
- The orchestrator coordinates a complex process in one visible place.
- Pino logger is available and used in important paths.
- `BrowserManager` exists for the automated OneDrive flow.

## 6. Highest Priority Improvements

### 6.1. Add automated tests

There are no detected `test` or `spec` files, and `package.json` still has:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

This is the biggest project risk because the backend generates legal/HR documents and performs external side effects.

Recommended first tests:

1. `ValidationService`
   - invalid contract type
   - duplicate DNI
   - missing required fields
   - invalid dates
   - subsidy-specific required fields

2. `ExcelFileValidator`
   - valid Excel extensions
   - invalid extensions
   - invalid MIME types
   - oversized files
   - temporary Office files like `~$file.xlsx`

3. `FileProcessingOrchestrator`
   - full success deletes original file
   - partial failure does not delete original file
   - invalid file sends validation email and deletes input
   - upload failure is reflected in result
   - email failure is included in result

4. API tests with Supertest
   - health endpoint
   - upload without file
   - invalid employee batch
   - contract preview validation once added

Suggested tools: Vitest or Jest, Supertest, and mocks for OneDrive, Brevo, and Puppeteer.

### 6.2. Resolve dependency vulnerabilities

`npm audit` currently reports 8 vulnerabilities:

- High: `axios`, `tmp`
- Moderate: `brace-expansion`, `nodemailer`, `qs`, `uuid`, `ws`

Recommended approach:

1. Create a separate branch for dependency remediation.
2. Run `npm audit fix`.
3. Re-run `npm.cmd run type-check`, `npm.cmd run lint`, and manual document generation smoke tests.
4. Handle forced/breaking upgrades separately, especially `nodemailer` and `exceljs`.

### 6.3. Validate every public request body

Current gaps:

- `POST /api/contracts/preview` does not use `schemaValidatorMiddleware`.
- `GET /api/excel/excel-to-image` reads `req.body`.

Recommended fixes:

- Add a single-employee Zod schema wrapper for preview.
- Convert `/api/excel/excel-to-image` to `POST /api/excel/excel-to-image`.
- Keep the old route temporarily if a frontend already depends on it, but mark it deprecated.

### 6.4. Centralize runtime configuration

Configuration is currently split between `config/index.ts`, `cors.config.ts`, service constructors, hardcoded emails, and direct `process.env` usage.

Recommended fixes:

- Add `src/config/env.schema.ts` with Zod validation.
- Validate environment variables during startup.
- Fail fast when required production variables are missing.
- Add missing variables to `.env.example`.

Variables to add:

```env
SMTP_BREVO_API_KEY=
EMAIL_SENDER=
EMAIL_SENDER_NAME=
EMAIL_SCTR_TO=
EMAIL_SCTR_CC=
EMAIL_SCTR_APE_TO=
EMAIL_SCTR_APE_CC=
ONEDRIVE_CRON_SCHEDULE=
PUPPETEER_TIMEOUT_MS=
```

### 6.5. Remove hardcoded email addresses

Hardcoded recipients and sender values exist in the email/orchestration layer. This makes production behavior harder to audit and risky to change.

Recommended fixes:

- Move report recipients and CC lists into environment variables.
- Move Brevo sender email and name into environment variables.
- Validate email lists at startup.

### 6.6. Close Puppeteer reliably in every path

The automated OneDrive flow uses `BrowserManager`, but `ContractController.previewContractPdf` launches Puppeteer directly and does not close it in a `finally` block.

Recommended fixes:

- Use `BrowserManager` in preview, or wrap direct launch with `try/finally`.
- Add timeouts around page rendering.
- Consider a small browser/page pool if batch generation grows.

### 6.7. Make scheduler behavior configurable

`OneDriveScheduler.start()` defaults to:

```ts
'*/1 * * * *'
```

That means every minute, every day. The comment says the intended schedule is Monday to Friday from 8 to 23 hours.

Recommended fixes:

- Move schedule to `ONEDRIVE_CRON_SCHEDULE`.
- Document timezone: `America/Lima`.
- Add a startup log showing the effective schedule.

## 7. Maintainability Improvements

### 7.1. Reduce orchestrator responsibilities

`FileProcessingOrchestrator` is the most important class, but it does many jobs:

- validates files
- downloads streams
- detects Excel type
- parses Excel
- runs document processors
- chooses output folders
- uploads files
- sends emails
- deletes original files
- builds email HTML
- assembles result objects

Recommended split:

| New component | Responsibility |
|---|---|
| `OutputFolderResolver` | Decide target OneDrive folders |
| `ProcessingResultAssembler` | Combine processor outputs |
| `ReportEmailDispatcher` | Send report emails with attachments |
| `OriginalFileCleanupService` | Apply cleanup policy |
| `StreamBufferService` | Convert and clone streams safely |

Do this gradually. Keep the existing public behavior stable while extracting one responsibility at a time.

### 7.2. Improve dependency injection

Several classes still instantiate dependencies directly with `new`, including controllers and services. This makes unit testing harder.

Recommended fixes:

- Expand `ServiceContainer` or introduce a small dependency factory.
- Inject interfaces into controllers and processors.
- Keep constructors test-friendly.

### 7.3. Standardize naming

Some files and methods contain typos or mixed language:

- `addendum-contract.processort.ts`
- `succes.template.ts`
- `array.utits.ts`
- `sendSuccessNotificacion`

Recommended approach:

- Rename gradually.
- Use re-export compatibility files if needed.
- Avoid large rename-only commits mixed with behavior changes.

### 7.4. Separate binary templates from source code

There are Office binary assets under `src/assets`. If these are runtime templates, they should be treated as product assets, not regular TypeScript source.

Recommended fixes:

- Move templates to `assets/templates` or another explicit runtime asset folder.
- Decide which binary templates should be versioned.
- Update `.gitignore` for `.xlsm`, `.doc`, `.docx`, or keep them intentionally tracked with documentation.

## 8. Security and Operational Hardening

Recommended additions:

- Add request rate limiting for public endpoints.
- Add authentication/authorization if the API is reachable outside a private network.
- Return generic errors in production for unhandled exceptions.
- Keep detailed error data in logs, not API responses.
- Add request IDs/correlation IDs to logs.
- Add structured logs per file processing run.
- Add a readiness endpoint that optionally checks OneDrive/Brevo connectivity.

Current error handler improvement:

- `errorHandler` returns `errors: error.message` for unexpected errors.
- In production, return a generic message and log the full error internally.

## 9. Documentation Still Needed

Recommended documentation files:

| File | Purpose |
|---|---|
| `README.md` | Setup, scripts, local run, project overview |
| `docs/API.md` | Endpoint contracts and examples |
| `docs/CONFIGURATION.md` | Environment variables and deployment settings |
| `docs/ONEDRIVE_FLOW.md` | OneDrive folders, polling, file lifecycle |
| `docs/TEMPLATES.md` | Contract template ownership and update process |
| `docs/TESTING.md` | Test strategy and how to run tests |

## 10. Suggested Roadmap

### Phase 1: Stabilize

- Add validation to `/api/contracts/preview`.
- Convert `/api/excel/excel-to-image` to POST.
- Close Puppeteer with `finally` in manual preview.
- Move hardcoded email settings to environment variables.
- Add `ONEDRIVE_CRON_SCHEDULE`.
- Hide internal error messages in production.

### Phase 2: Test the critical flow

- Install a test runner.
- Add unit tests for validation.
- Add orchestrator tests with mocked storage/email/browser.
- Add API tests for main route behavior.
- Replace the placeholder `npm test` script.

### Phase 3: Security and dependencies

- Run `npm audit fix` in a branch.
- Review breaking dependency upgrades manually.
- Add dependency update checks to CI.
- Add authentication and rate limiting if needed.

### Phase 4: Refactor carefully

- Extract output folder resolution from the orchestrator.
- Extract report email dispatching.
- Formalize dependency injection.
- Standardize filenames and method names.
- Split large template files by document type.

### Phase 5: Operational visibility

- Add correlation IDs.
- Log duration per processing stage.
- Track success/failure counts by document type.
- Add readiness checks.
- Document production deployment and rollback steps.

## 11. Immediate Checklist

- [ ] Add tests for `ValidationService`.
- [ ] Add tests for `FileProcessingOrchestrator`.
- [ ] Replace placeholder `npm test`.
- [ ] Run `npm audit fix` in a branch.
- [ ] Add Zod validation to `POST /api/contracts/preview`.
- [ ] Change `GET /api/excel/excel-to-image` to `POST`.
- [ ] Move hardcoded email sender/recipients to env vars.
- [ ] Add env validation with Zod.
- [ ] Configure scheduler from env.
- [ ] Add `try/finally` around direct Puppeteer usage.
- [ ] Hide internal errors in production responses.
- [ ] Document API request/response examples.

## 12. Recommended First Pull Request

The best first PR should be small and high-value:

1. Add `env.schema.ts`.
2. Move email sender/recipient settings and OneDrive cron schedule to config.
3. Update `.env.example`.
4. Add validation to `/api/contracts/preview`.
5. Add `try/finally` for Puppeteer in preview.
6. Add a few unit tests for `ValidationService`.

This gives immediate safety without changing the document generation engine.
