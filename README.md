# NagarSetu — Phase 1 Civic Technology Platform

> *"See a problem. Speak up. Get it moving."*
> *"One report starts a signal. A community makes it visible."*

NagarSetu is a human-centered civic problem reporting platform designed to convert individual citizen complaints into high-priority collective signals for local administration and municipal authorities.

---

## 1. Product Concept

Traditional civic reporting platforms suffer from **fragmentation and silence**: multiple citizens experience the same overflowing garbage container or hazardous road crater, but each files an isolated, uncoordinated ticket. 

**NagarSetu changes this paradigm:**
When a citizen attempts to report a problem, NagarSetu inspects nearby community reports. Instead of creating redundant tickets, citizens can join existing issues ("I'm affected too"). The system aggregates community reports and affected population into a unified civic signal, dynamically raising urgency and routing issues through escalating administrative tiers.

---

## 2. The Civic Feedback Loop

NagarSetu is designed around a continuous 10-step feedback loop:

```
REPORT
  ↓
UNDERSTAND
  ↓
MATCH
  ↓
AGGREGATE
  ↓
MEASURE IMPACT
  ↓
PRIORITIZE
  ↓
ESCALATE
  ↓
TRACK RESPONSE
  ↓
RESOLVE
  ↓
VERIFY
  ↓
FEED RESULT BACK INTO SYSTEM
```

Every user action (filing a report, confirming affected status, adjusting severity) triggers this feedback loop, updating community signal counts, recalculating priority scores, and advancing escalation stages.

---

## 3. Graph Model (Civic Ecosystem Graph)

Internally, NagarSetu models the civic ecosystem as a relationship graph:

### Nodes:
- **Person**: Citizens, commuters, faculty, local residents.
- **Problem**: Categorized civic issues (Garbage, Roads, Water, Streetlights, Drainage, Safety, Public Property).
- **Location**: Neighborhood landmarks, GPS coordinates, public grids.
- **Evidence**: Photos, timestamps, severity scale.
- **Community**: Aggregate affected residents & commuters.
- **Authority**: College Administration, Municipal Corporation.
- **Status**: Lifecycle status (`reported` → `confirmed` → `escalated` → `acknowledged` → `action_started` → `resolved` → `community_verified`).

### Relationships (Triples):
- `Person` ──(reported)──► `Problem`
- `Person` ──(affected_by)──► `Problem`
- `Person` ──(supports)──► `Problem`
- `Problem` ──(located_at)──► `Location`
- `Problem` ──(similar_to)──► `Problem`
- `Problem` ──(affects)──► `Community`
- `Problem` ──(escalated_to)──► `Authority`
- `Authority` ──(responsible_for)──► `Problem`

*(Note: The graph model drives UI relationship visualizations under "Community connections" without overwhelming citizens with technical database terminology).*

---

## 4. Multi-Agent Architecture (`/src/agents`)

Phase 1 establishes the agent orchestration layer in TypeScript modules ready to connect to a future multi-agent backend:

1. **`ReportAgent.ts`**: Takes raw citizen input (title, description, category, location, photo), normalizes data structure, extracts keywords, and assigns initial severity.
2. **`MatchAgent.ts`**: Runs mock semantic matching based on category, keyword token similarity, and location context to detect existing duplicate complaints.
3. **`ImpactAgent.ts`**: Aggregates community report counts, affected population estimates, and affected location radius.
4. **`PriorityAgent.ts`**: Calculates priority score (0–100) using the formula:
   $$\text{Priority} = (35\% \times \text{Reports}) + (40\% \times \text{Affected}) + (20\% \times \text{Severity}) + (5\% \times \text{Time Unresolved})$$
5. **`EscalationAgent.ts`**: Evaluates whether priority score or community scale crosses administrative thresholds (Community → College Administration → Municipal Corporation).
6. **`ResolutionAgent.ts`**: Tracks lifecycle state transitions and updates progress percentage.
7. **`Orchestrator.ts`**: Pipeline coordinator executing the end-to-end agent flow.

---

## 5. Current Phase 1 Limitations

- **No Live Backend/DB**: Phase 1 operates purely in the browser using React Context with `localStorage` persistence.
- **Mock Agents**: Agents are deterministic TypeScript functions without LLM dependency.
- **Simulated Escalation**: Municipal dispatches are simulated within the UI prototype ("Ready for municipal escalation / Demo status").

---

## 6. Future Backend Architecture (Phase 2+)

- **Agents**: FastGraph / LangGraph microservices with LLM semantic matching (embeddings + vector search).
- **Database**: Graph Database (Neo4j / Memgraph) paired with PostgreSQL for persistence.
- **Integrations**: Official municipal API connectors, WhatsApp civic bots, email notifications, government ticketing webhooks.

---

## 7. Demo Flow Walkthrough

1. **HOME DASHBOARD (`/`)**:
   - View Hero and "What's happening around us" aggregate stats.
   - Inspect top **Community Priority** items (#1 Overflowing garbage near Main Gate, P:92).
   - Review **"How a report moves"** civic loop process.
2. **DUPLICATE PROBLEM FLOW (`/report`)**:
   - Click **"Report a Problem"**.
   - Type `"Garbage near Main Gate"`.
   - The **Match Agent** triggers automatically: *"We found a similar problem nearby!"*
   - Click **`[I'm affected too]`**.
   - The system connects you to existing Issue #1 without creating a duplicate.
3. **LIVE LOOP RE-PRIORITIZATION**:
   - Return to Dashboard (`/`).
   - Observe Community Reports increased from 87 → 88, Affected count increased from 1,284 → 1,285.
   - Priority score recalculates dynamically.
4. **DEMO SIMULATION CONTROLS**:
   - Open the **Demo Controls** drawer (bottom left).
   - Click **"+100 Affected"** or **"Escalate Issue"**.
   - Watch the priority score rise, escalation level change, and ranking update in real time.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Context State & LocalStorage
- Lucide Icons
