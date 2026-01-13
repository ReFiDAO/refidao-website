# ReFi DAO 3.0 — Supplemental Plan (from recordings)

**Status:** Draft (transcript-derived)

## Why this document exists

The core ReFi DAO 3.0 docs in this directory describe the baseline transition (2.0 closure → 3.0 options). This supplement captures **additional strategy modules and concrete mechanisms** raised in recorded planning notes, so they can be piloted and validated without rewriting the existing documentation.

- **Canonical baseline**: see [Vision & Strategic Models](vision-strategic-models.md) and [Implementation Plan](implementation-plan.md).
- **Source corpus**: transcripts under `refidao3_transcripts/` (speech-to-text; some terms are mis-transcribed).

## What’s new (delta summary)

- **Publish the delayed 2.0 closure/recap post**: the recordings reference an unpublished recap that was delayed while waiting for a “Return/Regen 2.5” milestone.
- **Governance/onboarding as composable modules**: treat 3.0 as a bundle of strategies that can be combined, then validated with the network.
- **Gardens for role validation/elections**: use Gardens signaling/election mechanics to validate roles.
- **Allowlists → Hats**: use Gardens outcomes to generate allowlists, then mint Hats to the allowlist (Guild.xyz optional).
- **Re-activate Core Stewards via elections**: shift from closed onboarding to network-vetted selection.
- **Proposal-based payouts + cost slim-down**: reduce baseline retainers; route additional work through proposals (on Safe and/or Gardens).
- **Optional treasury delegation pattern (“Cookie Jar”)**: explore bounded spending powers by role.
- **Gardens “General Proposals” pool**: consider adding a pool for general work beyond Local Nodes and Network Initiatives.
- **Macro option: Green Pill Network integration pathway**: explore a phased integration/merge discussion with explicit decision gates.
- **Cohesion**: clarify definitions for Network Members and Contribution Points.

## Proposed pilots (small, reversible, high-signal)

### Pilot A — Gardens-based role validation (start with one role category)

- **Goal**: test whether Gardens-based validation improves legitimacy and reduces gatekeeping overhead.
- **Recommended first scope**: Global Core Contributors/Advisors (capped seats) *or* one defined Global role.
- **Minimum artifacts**:
  - **Role spec** (mandate, term, cap, eligibility)
  - **Election spec** (electorate, application/nominations, voting window)
  - **Ops spec** (how allowlist is produced and how Hats are minted)
  - **Comms pack** (how to apply; how to vote; timeline)
- **Success criteria**:
  - Clear participation baseline (applications + votes)
  - Operationally feasible allowlist→Hats flow
  - No major legitimacy disputes

### Pilot B — Proposal-based payouts (retainer + scoped proposals)

- **Goal**: align spend with clear deliverables while shrinking fixed overhead.
- **Mechanism options**:
  - **Safe-first**: proposals documented; payouts executed via Safe approvals.
  - **Hybrid**: proposals documented; Gardens used only for prioritization or extra-fund requests.
- **Minimum artifacts**:
  - **Payout proposal template** (scope, deliverables, timebox, amount, reporting)
  - **Approval SLA** (who approves; timeline; fallback)
  - **Transparency log** (public ledger of proposals + payouts)

### Pilot C — Decide whether a “General Proposals” Gardens pool is needed

- **Decision gate**: if proposal volume and prioritization pressure exceed what Safe-first can handle.
- **If adopted**: run a constrained pilot (1–3 proposals) with strict scope boundaries.

### Pilot D — Green Pill integration discovery sprint (Phase 0)

- **Goal**: evaluate if deeper integration reduces duplicated ops and increases resilience.
- **Output**: a short scoping memo with decision gates:
  - Phase 0: discovery (overlap, shared services, stakeholder map)
  - Phase 1: joint programs (1–2 collaborative experiments)
  - Phase 2: merge/brand/governance decision (only if Phase 1 succeeds)

### Pilot E — Definitions cohesion (reduce ambiguity)

- **Output**: one-page glossary + decision tree clarifying:
  - Network Member vs Global Contributor/Advisor vs Core Steward
  - What Contribution Points do/don’t influence (elections, access, legitimacy)

## Where this should attach in the existing docs

- **[Vision & Strategic Models](vision-strategic-models.md)**
  - Add a “Governance & Onboarding Mechanics (Strategy Modules)” section (Gardens elections, allowlists→Hats, Core Steward election pipeline).
  - Add a “Green Pill integration pathway” option module (phased, decision-gated).

- **[Closure Checklist](closure-checklist.md)**
  - Add a task to publish the delayed 2.0 closure/recap post.
  - Add tasks for proposal-based payouts and optional cookie-jar exploration.
  - Add a tooling streamlining task (review Guild.xyz and the onboarding toolchain).
  - Add a decision-gated task for a “General Proposals” Gardens pool.

- **[Implementation Plan](implementation-plan.md)**
  - Add “Network Validation Pilots (Week 0–1)” covering Pilots A–E.

## Sources

- `refidao3_transcripts/Rua Demétrio Mathiuso.json` (notes on delayed 2.0 closure recap; composable strategies)
- `refidao3_transcripts/Rua Demétrio Mathiuso 2.json` (Gardens elections, allowlists→Hats, Core Stewards elections, proposal-based payouts, general proposals pool)
- `refidao3_transcripts/Rua Demétrio Mathiuso 3.json` (proposal culture, Green Pill integration pathway, definitions cohesion)















