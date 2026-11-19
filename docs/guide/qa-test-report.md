---
title: Writing QA test reports
description: Principles, anatomy, statuses, web UI specifics, defect entries and templates for QA test reports.
---

# How to write a QA test report

A test report exists so someone else can decide — ship, fix first, or stop — with the least possible reading. Web UI testing adds one rule: the environment is part of the result.

<aside class="qa-specimen" aria-label="Sample test summary card">
  <div class="qa-spec-head">
    <span class="qa-spec-label">Test summary · sample</span>
    <span class="qa-spec-build">3f2a91c</span>
  </div>
  <div><span class="qa-vbadge">GO WITH CONDITIONS</span></div>
  <div class="qa-spec-bar" aria-hidden="true">
    <span style="width:92.2%;background:var(--qa-pass)"></span>
    <span style="width:2.6%;background:var(--qa-fail)"></span>
    <span style="width:1.3%;background:var(--qa-warn)"></span>
    <span style="width:3.9%;background:var(--qa-skip)"></span>
  </div>
  <ul class="qa-spec-grid">
    <li><i style="background:var(--qa-pass)"></i>Passed <b>142</b></li>
    <li><i style="background:var(--qa-fail)"></i>Failed <b>4</b></li>
    <li><i style="background:var(--qa-warn)"></i>Blocked <b>2</b></li>
    <li><i style="background:var(--qa-skip)"></i>Skipped <b>6</b></li>
  </ul>
  <div class="qa-spec-foot">Verified on Chrome 142 · Safari 19 · Firefox 143</div>
</aside>

## The principles

Everything below follows from one idea: the report is a decision tool, not a testing diary.

| Principle | In practice |
| --- | --- |
| Audience first | Leadership wants the verdict and the risks in 30 seconds; developers want repro steps and evidence. Put the summary on top, details in appendices. |
| Facts, not adjectives | “Checkout button returns HTTP 500 on submit” beats “checkout is broken”. Quantify: “fails 3/10 attempts”. |
| Reproducible | Anyone with the build ID, environment, account role and steps can reproduce it — or you have written an anecdote, not a defect. |
| Scope-honest | State what was not tested (features, browsers, edge cases, blocked areas). Residual risk is the most valuable section for a decision-maker. |
| Actionable | Every failure carries a severity, an owner or suggested owner, and a next step: fix now, defer, or accept the risk. |
| Consistent | Same template, same ID scheme (TC-123, BUG-456), same severity scale every time. |

## What a summary report contains

Order matters: the reader should reach the verdict before the detail.

1. **Metadata.** Report ID, author, testing window, **build identifier (git SHA or build number)**, environment URL, test data set, and the feature flags that were on.
2. **Executive summary.** Pass, fail and blocked counts, requirement coverage, a **verdict — Go / No-Go / Go with conditions** — and the three to five things the reader must know.
3. **Scope.** In scope, out of scope, and why (risk-based exclusions, blocked dependencies).
4. **Approach.** Manual or automated, test types run (smoke, regression, cross-browser, accessibility, performance), tools and CI links. Link to raw results (Allure, Playwright HTML report, JUnit XML) instead of pasting logs.
5. **Results.** Per feature or requirement, with the status breakdown below. Traceability to tickets and stories lets people judge coverage, not just pass rate.
6. **Defects.** Open bugs sorted by severity, each row linking to its full ticket.
7. **Risks, known issues and deferred items.** What is still broken, and why that is acceptable — or not.
8. **Recommendation.** Explicit, with conditions: “ship if BUG-456 is fixed and the accessibility pass clears before GA”.

### Three report types, kept separate

| Report type | Written when | Purpose |
| --- | --- | --- |
| Defect report | As found, immediately | One bug, one ticket, full reproduction |
| Daily status | During execution | Progress, blockers, new defects — short |
| Summary / sign-off | At exit | Verdict, coverage, risks — decision-oriented |

Mixing the three is the most common reporting failure. A defect buried in a status update, or a verdict buried in a bug list, helps nobody.

## Report statuses properly

Never collapse everything into pass or fail. Each status below is a different fact about the run.

| Status | Meaning |
| --- | --- |
| <span class="qa-badge pass">Passed</span> | Verified against the expected result. |
| <span class="qa-badge fail">Failed</span> | Verified against the expected result; the result differed. |
| <span class="qa-badge warn">Blocked</span> | Could not run: a dependency is broken or the environment is down. |
| <span class="qa-badge skip">Not run / skipped</span> | Out of scope or deprioritized. Must be declared, never implied. |
| <span class="qa-badge flaky">Flaky</span> | Passed and failed across runs; report the rate, not the last result. |

::: warning The number to distrust
“100% passed” is meaningless if 40% of the suite was skipped. Pass rate without coverage is the most misleading metric in QA reporting.
:::

Other metrics worth including: requirement coverage, open defects by severity, defect density per feature, escaped defects, flake rate, and total execution time. Leave out vanity metrics such as the raw number of test cases executed.

## Details that make a web UI report credible

On the web, the environment is part of the result. The same build passes in one browser and fails in another, and a report without the environment cannot say which.

### Environment matrix: always exact

- Browser and version (never “latest Chrome”), operating system, device.
- Viewport and resolution, zoom level, desktop or mobile.
- Locale, timezone, and network throttling for performance or loading issues.
- User role and permissions, feature-flag or A/B bucket, and the data set used.

### Evidence beyond a screenshot

- Annotated screenshot with an arrow on the failing element.
- Short screen recording for dynamic issues (Playwright trace, Loom, QuickTime).
- Browser console errors, verbatim.
- Network tab or HAR file: status codes, payloads, CORS errors.
- Whether it reproduces in incognito, or after clearing cache and cookies.
- Reproduction rate, and whether the failure is intermittent.

### Cover explicitly, or declare out of scope

- Browsers: Chrome, Safari, Firefox, Edge; plus iOS Safari and Android Chrome.
- Responsive breakpoints around each design target.
- Accessibility to WCAG 2.2 AA: keyboard-only navigation, a screen reader (VoiceOver or NVDA), contrast, 200% zoom.
- Localization: long strings and right-to-left layouts where relevant.
- Performance budgets or Core Web Vitals, if in scope.
- Session edge cases: expiry, the back button, refresh, deep links, multiple tabs, slow or offline networks.

## Writing a defect: one per report

The defect entry is the highest-leverage text a QA engineer writes. This is the shape that survives review.

```text
BUG-456 — Checkout returns HTTP 500 when the cart has a discount code
Severity: Critical (blocks purchase) | Priority: P1
Build: 3f2a91c | Env: staging, Chrome 142 / macOS 15 / 1440×900
Role: signed-in customer | Flags: checkout_v2=on

Preconditions: cart has ≥1 item; user holds a valid SAVE10 code
Steps:
  1. Add any item to the cart
  2. Go to /checkout, enter SAVE10, click Apply
  3. Click "Place order"
Expected: order confirmation page, order created
Actual: button spins, then toast "Something went wrong"; Network tab shows
        POST /api/orders → 500 (response body attached)

Evidence: recording.mp4, console-errors.txt, orders.har, screenshot.png
Repro rate: 10/10 | Also fails in incognito: yes | Safari: not tested
```

- Minimal numbered steps: the shortest path to the failure.
- Expected and actual, always both.
- Separate severity (impact: blocker, critical, major, minor, trivial) from priority (urgency to fix).
- No severity inflation. Credibility is a budget you spend once.
- Never “it doesn’t work” without the exact symptom and reproduction rate.

## What to leave out

Each of these costs the reader trust. Drop them before adding anything new.

- “All tests passed” with no scope or build ID.
- Screenshots with no steps or environment.
- Several bugs crammed into one ticket.
- Raw logs pasted instead of linked.
- The ship / no-ship verdict buried on page nine.
- Hedged language (“it seems like…”) where the observed fact and your confidence would do.
- Reporting only the happy path, silently omitting blocked and skipped areas.
- Editing the template after the fact instead of agreeing exit criteria before testing starts.

## Copy, paste, adapt

Two starting points: the release summary below and the defect entry above. Keep the structure; localize the labels.

```text
# Test Summary — <Release> / <Build SHA>
Author · Date · Test window · Environment · Test data · Feature flags

## Verdict: GO / NO-GO / GO WITH CONDITIONS
<2–4 sentences: coverage, worst open issues, the decision needed>

## Results
Passed X | Failed Y | Blocked Z | Not run W | Flaky V
Requirement coverage: N/M (linked list)

## Scope
In: …   Out (why): …

## Open defects
| ID | Severity | Title | Owner | Status |

## Risks / known issues / accepted defects
…

## Evidence
CI run links · screenshots · recordings · HAR files
```

> **The report worth optimizing for:** a release manager skims the top ten lines, trusts the numbers because scope is stated, and can forward one bug link to a developer without asking you a single follow-up question.
