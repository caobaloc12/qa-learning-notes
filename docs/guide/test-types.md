---
title: "Test types: smoke, regression and more"
description: What smoke, sanity, retest and regression prove, how test levels and techniques differ, and how to choose a risk-based suite for a release.
---

# Test types: smoke, regression and more

A test suite is a set of questions, not a checklist of rituals. Smoke asks “is this build testable?”, regression asks “did we break anything?”, acceptance asks “does this meet the need?”. The type follows from the question you need answered now.

## Start from the question

| Question | Test type | Typical trigger |
| --- | --- | --- |
| Is this build worth testing? | Smoke | Every new build or deploy |
| Is this fix correct now? | Retest (confirmation) | After a defect fix |
| Did this change break existing behaviour? | Regression | Before release, after risky changes |
| Does the feature meet its specification? | Functional | Story and acceptance criteria ready |
| Do the components work together? | Integration / contract | Service or component change |
| Does the full user journey work? | End-to-end (E2E) | Pre-release, critical flows |
| Does it meet the business need? | Acceptance (UAT) | Before sign-off |
| Can people actually use it? | Usability, accessibility | Design iterations, pre-release |
| Does it hold under load? | Performance | Capacity or traffic changes |
| Will it be attacked? | Security | Threat surface changes, pre-release |
| Does it work where users are? | Compatibility | Browser and device matrix |
| Did the UI change unintentionally? | Visual regression | UI changes |

## The four most-confused types

| Type | Question | Scope | When | If it fails |
| --- | --- | --- | --- | --- |
| Smoke | Is the build stable enough to test? | Broad, shallow: login, core journeys, key APIs | Every new build or deploy | Reject the build; stop testing |
| Sanity | Does this specific change behave sensibly? | Narrow, deeper: the touched area | After a small fix or change | Fix before wider testing |
| Retest (confirmation) | Is the reported defect gone? | Exactly the failing scenario | After the fix | Reopen the defect |
| Regression | Did existing behaviour break? | Existing critical and impacted areas | After changes, before release | Fix, or accept the risk explicitly |

A few rules keep these four from blurring together:

- Smoke tells you whether to spend testing time; it is not “quick full regression”.
- Sanity is judgement-led; it can be exploratory rather than scripted.
- Retest proves the fix; regression proves nothing else broke. A fix is only done when both pass.
- “Regression” is also a class of defect; the test type exists to protect against that class.

## Levels, types and techniques are different axes

| Axis | Answers | Examples |
| --- | --- | --- |
| Level | Where in the stack | Unit, integration, system, acceptance |
| Type | What kind of check | Smoke, regression, performance, security |
| Technique | How cases are chosen | Equivalence partitioning, boundary values, decision tables, exploratory heuristics |

“Regression testing at the unit level” is meaningful. “Unit is a test type” is not. Keep the axes separate in strategy documents, or teams end up arguing about vocabulary instead of risk.

## The catalogue

Build-level types are covered above; this is the rest of the working set.

| Type | Answers | Typical scope | Evidence |
| --- | --- | --- | --- |
| Functional | Does it meet the specification? | Acceptance criteria, business rules | Case pass/fail against expected results |
| Integration | Do the parts cooperate? | Service boundaries, database, queues, third parties | Request flows, logs, contract checks |
| Contract | Do consumer and provider agree? | Schemas, status codes, events | OpenAPI or Pact verification |
| End-to-end (E2E) | Does the journey work? | UI → API → data, critical paths | Recordings, traces, screenshots |
| Acceptance (UAT) | Does it meet the business need? | Real tasks by real users or business owners | Sign-off, conditions |
| Exploratory | What did we not think of? | Charters and heuristics | Session notes, defects found |
| Usability | Can users succeed without friction? | Key tasks, first-run experience | Findings, task success rates |
| Accessibility | Can everyone use it? | WCAG 2.2 AA, keyboard, screen reader | Violations, manual checks |
| Compatibility | Does it work in their environment? | Browser, OS and device matrix | Matrix results |
| Localization | Do language and locale break it? | Long strings, RTL, formats | Screenshots, locale matrix |
| Visual regression | Did pixels change unexpectedly? | Baselines versus current build | Diffs, intentional approvals |
| Performance | Does it hold under load? | Load, stress, soak, spike | p50/p95/p99, error rate, throughput |
| Security | Can it be exploited? | AuthN/AuthZ, input, secrets, OWASP | Findings by severity, evidence |
| Reliability | Does it recover? | Failover, retries, chaos experiments | Recovery time, error budget |

## How the types stack together

| Level | Runs on | Cost | Speed | Typical role |
| --- | --- | --- | --- | --- |
| Unit | Developer machine, CI | Low | Seconds | Logic |
| Integration / contract | CI | Medium | Minutes | Boundaries |
| API / functional | CI, staging | Medium | Minutes | Service behaviour |
| UI E2E | CI, staging | High | Minutes to hours | Critical journeys |
| Manual exploratory / UAT | Production-like staging | High | Hours to days | Risk discovery, sign-off |

The shape is a heuristic, not a quota. The useful rule: push each check to the cheapest level that can catch the failure, and keep a small, stable E2E set for journeys that carry the business.

## Choosing a suite for a release

1. Smoke on every deploy; block further testing if it fails.
2. Retest fixed defects, then sanity-check the touched area.
3. Regression by impact, not by habit: use the change set, the risk map and recent defects.
4. Run the critical E2E journeys across the agreed environments.
5. Apply non-functional gates according to risk: accessibility every release, performance before major launches, security when the threat surface changes.
6. UAT and sign-off with the business; record conditions and accepted risks.

| Trigger | Minimum set | Exit signal |
| --- | --- | --- |
| Every deploy | Smoke | Build accepted |
| Small fix | Retest + sanity + targeted regression | Fix verified, area stable |
| Feature branch merge | Functional + impacted regression + critical E2E | Story accepted, no new P1/P2 |
| Release candidate | Risk-based full regression + E2E + a11y + performance (if in scope) | Exit criteria met |
| Post-incident fix | Reproduction case, retest, regression around the incident | Incident closed, no recurrence |

## Report what each type proves

| Type | Evidence to capture | What the report should claim |
| --- | --- | --- |
| Smoke | Build ID, checks run, pass/fail | “Build X is testable” or “rejected at smoke” |
| Retest | Original defect ID, scenario | “Fix verified” — not “defect fixed” until regression passes |
| Regression | Scope, areas covered, exclusions | “No regressions in covered areas”; declare the gaps |
| E2E | Journeys, environments, recordings | “Critical journeys pass on the matrix” |
| Accessibility | Tool and manual checks, violations | “No critical violations; keyboard paths pass” |
| Performance | Load model, p50/p95/p99, errors | “Within budget at expected load” |
| Security | Scope, findings, severity | “No open critical or high findings in scope” |
| UAT | Participants, tasks, conditions | “Accepted with conditions: …” |

These evidence formats plug directly into [Writing QA test reports](/guide/qa-test-report); statuses and the severity scale stay the same across every type. For how UI and API evidence differs, see [UI vs API test reports](/guide/ui-vs-api-test-reports).

## Define each type in the strategy

When you introduce a test type into a team process, pin down eight things:

1. The question it answers.
2. The trigger: when it runs.
3. Scope and explicit exclusions.
4. Environment and test data.
5. Entry and exit criteria.
6. Owner and reviewers.
7. Evidence and where it is stored.
8. Reporting: which report section it feeds, and how failures block release.

A type without exit criteria becomes a ritual.

## Common pitfalls

- Running “regression” as a fixed full-suite ritual regardless of change risk.
- Treating smoke as a mini regression, then skipping real regression.
- Closing defects after retest without regression; the fix can break neighbours.
- Using E2E for everything, then blaming the tests for being slow and flaky.
- Silently excluding flaky tests instead of fixing or reporting them.
- Treating UAT as QA's responsibility; it is business acceptance.
- Writing reports that list “tests run” instead of what each type proved.

> **Pick the type by the question. Report the answer, not the activity.**
