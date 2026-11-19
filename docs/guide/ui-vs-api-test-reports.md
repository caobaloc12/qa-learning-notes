---
title: UI vs API test reports
description: Why UI and API test reports differ at the evidence level while sharing one reporting standard, with coverage matrices and defect examples.
---

# UI and API test reports: same skeleton, different evidence

The template should differ — but not into two unrelated documents. Keep one reporting standard; change what each layer records as environment, coverage, evidence and metrics.

## What stays identical

The outer structure is the decision artifact, and it must look the same in a UI report, an API report and a combined release report:

- Verdict format: Go / No-Go / Go with conditions.
- Status taxonomy: passed, failed, blocked, not run, flaky.
- Severity scale, priority scale and defect ID scheme.
- Section order: metadata → summary → scope → results → defects → risks → recommendation.
- The rule that every failure carries evidence, an owner and a next step.

This follows the standard test-summary-report structure (IEEE 829 / ISO 29119 lineage). Only the content inside the sections changes by layer. The shared skeleton is covered in [Writing QA test reports](/guide/qa-test-report).

## Where the two diverge

| Dimension | UI test report | API test report |
| --- | --- | --- |
| Unit under test | User journey, screen, component state. | Endpoint or operation, contract. |
| Environment block | Browser and version, OS, device, viewport, zoom, locale, network throttling. | Service name and version or image tag, gateway URL, auth scheme and scopes, tenant, DB seed, downstream services or mocks, OpenAPI spec version. |
| Evidence | Annotated screenshot, recording, console errors, HAR. | Request/response pair (redacted), status and body, correlation or trace ID, service logs, schema diff. |
| Coverage | Journeys × browsers/devices; visual states (empty, loading, error); accessibility; i18n. | Operations × methods × status codes; authz matrix; validation and boundaries; contract; idempotency. |
| Key metrics | Cross-browser pass rate, flake rate (first run vs retry), visual diffs, a11y violations, Core Web Vitals. | p50/p95/p99 latency vs budget, error rate by status class, schema-validation failures, spec coverage %. |
| Usual tools | Playwright, Cypress, axe-core, Percy or Chromatic, Lighthouse. | Postman/Newman, REST Assured, Karate, Pact, Schemathesis, k6 or Gatling. |
| What “blocked” usually means | Staging UI down, third-party widget or CAPTCHA, broken test account. | Service or dependency down, token issuer broken, DB seed mismatch, mock drift. |
| Severity drivers | User-blocking flow, data loss on screen, keyboard trap, broken layout. | Data corruption, authz bypass, contract break, core 5xx, latency SLA breach. |

## What a UI report adds

Beyond the shared skeleton, a UI report carries evidence that the environment itself is part of the result.

### Environment matrix (example)

| Browser | Version | OS | Viewport | Result |
| --- | --- | --- | --- | --- |
| Chromium (Chrome 142) | 142 | macOS 15 | 1440×900 | Pass |
| WebKit (Safari 19) | 19 | macOS 15 | 1440×900 | Fail — BUG-456 |
| WebKit (iOS Safari) | 19 | iOS 19 | 390×844 | Not run |

### Journey coverage (example)

| Journey | Chrome | Safari | Firefox | Mobile | A11y |
| --- | --- | --- | --- | --- | --- |
| Sign up / login | Pass | Pass | Pass | Pass | Pass |
| Checkout with discount | Fail (BUG-456) | Fail (BUG-456) | Pass | Not run | Pass |

### Also declare, or mark out of scope

- Visual states: empty, loading, error, partial data, long strings.
- Accessibility: WCAG 2.2 AA, keyboard-only operation, a screen reader, contrast, 200% zoom.
- i18n, RTL and responsive breakpoints.
- Visual regression baselines: which diffs are intentional and which are defects.
- Flake reporting: first-run results separately from retries, because retries mask real bugs.

## What an API report adds

An API report replaces the browser matrix with service state and a contract. Its evidence is the request and response, not the screen.

### Service and contract block (example)

```text
Service: orders-svc 2.14.3 (image sha-3f2a91c)
Base URL: https://staging-api.example.com/orders/v2
Spec: OpenAPI 3.1 @ commit a1b2c3d (diff since last release: 2 new fields)
Auth: OAuth2 client-credentials, scopes [orders:write], tenant=acme
Data: fixtures seed-2025-11-18-a; cleanup run: yes
Dependencies: payment-svc 1.9.2 (real), inventory (mocked v4)
```

### Operation coverage and authz matrix (example)

| Endpoint | Method | Happy | Validation | AuthZ | Schema | Result |
| --- | --- | --- | --- | --- | --- | --- |
| /orders | POST | Pass | 4/5 pass | Pass | Pass | Fail — BUG-401 |
| /orders/{id} | GET | Pass | Pass | Pass | Pass | Pass |

The auth matrix is the API equivalent of cross-browser testing: anonymous / customer / support / admin × every operation → verify 401, 403 or 200.

### Also include

- Contract verification: response schema validated against OpenAPI; breaking changes flagged.
- Idempotency and retries: the same key applied twice, and what the second call returns.
- Data integrity: database state before and after, side effects verified.
- Rate limiting and concurrency: 429 behaviour, race conditions.
- Performance, if in scope: p95/p99 against a per-operation budget.
- Error taxonomy: is a 500 truly 5xx? Do validation errors return 422 or 400 consistently?

::: danger Hard rule
Never include tokens, cookies or PII in request/response evidence. Redact headers and bodies in the report; attach full logs to the ticket only if policy allows.
:::

## Defect entries differ too

Same fields, different evidence. The UI entry proves what a user saw; the API entry proves what the service returned.

### UI defect

```text
BUG-456 — Checkout returns HTTP 500 when cart has discount code
Browser/OS/Viewport: Chrome 142 / macOS 15 / 1440×900
Steps: 1. Add item  2. Apply SAVE10  3. Click "Place order"
Expected: confirmation page; Actual: error toast, spinner
Evidence: screenshot.png, recording.mp4, console-errors.txt, orders.har
Incognito: also fails | Safari: also fails | Mobile: not tested
A11y impact: none | Screen: /checkout
```

### API defect

```text
BUG-401 — POST /orders returns 500 when cart has discount
Service: orders-svc 2.14.3 | Env: staging | Spec: OpenAPI a1b2c3d
Auth: customer JWT, tenant=acme, scope orders:write
Request: POST /api/orders  body: {cartId, code:"SAVE10"}  (headers redacted)
Expected: 201 + Order schema v2
Actual: 500 + {"error":"null_pointer_at_discount.calc"}
Correlation ID: 5f3c9a1e-... | Trace: Jaeger link
Data preconditions: cart 98765 with SAVE10; cleanup confirmed
Downstream: payment-svc 1.9.2 healthy
Repro via curl: yes, 10/10
Impact: all web and mobile checkout flows that use discount codes
```

## Attribute cross-layer failures correctly

A UI test failing does not automatically make it a UI defect. Classify by where the fix belongs.

- **UI test fails because the API returns 500.** The symptom is UI; the root cause is API. Count the defect once, under API, list affected journeys as impact, and have the UI report link to the API defect instead of opening a duplicate.
- **The API fails but the UI handles it gracefully.** One API defect; correct error-state behaviour may be a product requirement, not a bug.
- **The API fails and the UI white-screens, hangs or loses input.** A second, separate UI defect: missing error handling.

Add two fields to every defect — *layer detected* and *root-cause layer* — and aggregate them in the summary:

| Root-cause layer | Open defects | Blocking |
| --- | --- | --- |
| UI | 3 | 1 |
| API | 2 | 2 |
| Shared / infrastructure | 1 | 0 |

## One release report, both layers

Produce one release report with layer sections rather than two top-level reports. Leaders want one verdict; QA needs the separate detail.

```text
1. Release verdict (single, conditions listed)
2. Scope and test layers: UI suites, API suites, what each excluded
3. Results — UI: journey × browser matrix, a11y, visual
4. Results — API: operation × status-code matrix, auth matrix, contract
5. Performance (per layer, if in scope)
6. Defects: one list, tagged by detected layer and root-cause layer
7. Risks, accepted gaps, residual risk by layer
8. Evidence index: /evidence/ui, /evidence/api
```

## Exit criteria differ by layer

### UI exit criteria

- All P0 journeys pass on the agreed browser and device matrix.
- Zero open severity-1 UI defects.
- Zero critical accessibility violations.
- Visual diffs reviewed and intentional.
- Flake rate under the agreed threshold.

### API exit criteria

- 100% of in-scope operations covered with happy path, main negative cases and authz.
- 100% schema validation.
- No open P1.
- p95 within budget.
- Contract diff reviewed and backward compatible across supported versions.
- No secrets found in logs.

## The practical rule

Build one reporting standard with layer-specific modules: shared summary, verdict and defect taxonomy; an environment block, coverage matrices, evidence format and metrics that instantiate differently for UI and API. In an automated pipeline this is a `layer: ui | api` label plus different artifacts per layer, feeding the same report generator.

> **The template differs in content, not in standard.** One skeleton, two evidence languages — and a single verdict a release manager can act on.
