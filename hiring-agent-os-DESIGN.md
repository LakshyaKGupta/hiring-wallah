# Hiring Agent OS — Design Document

**Version:** 1.0  
**Date:** June 2026  
**Status:** Ready for UI Build

---

## 1. Design Philosophy

This is not a HR SaaS tool. It is an intelligence system.

The visual language must communicate: **precision, depth, and autonomous reasoning** — not corporate productivity.

Reference points:
- **Palantir AIP** — dark intelligence, data authority
- **Anduril** — military-grade decisiveness, not friendly
- **Linear** — tight typography, motion that earns trust
- **Not:** Notion, Figma, Greenhouse, Lever, Workday

The design should feel like a **mission control room for hiring** — where every decision is backed by evidence, every score is earned, and the system does the heavy work in view.

---

## 2. Visual Identity

### 2.1 Color Palette

The palette is built around **deep space + electric decisiveness**.

```
Background Deep:     #050A14    (near-black navy — primary canvas)
Background Surface:  #0A1628    (elevated cards, panels)
Background Raised:   #0F2040    (hover state, active cards)

Accent Primary:      #00E5FF    (electric cyan — key actions, scores, active agents)
Accent Secondary:    #7C3AED    (deep violet — secondary emphasis, gradients)
Accent Tertiary:     #10B981    (emerald — Strong Hire, positive signals)

Verdict Colors:
  Strong Hire:       #10B981    (emerald green)
  Consider:          #F59E0B    (amber)
  Reject:            #EF4444    (red)

Devil's Advocate:    #FF3D71    (hot pink-red — adversarial, attention)

Text Primary:        #F0F6FF    (near white)
Text Secondary:      #8BA0C0    (muted blue-grey)
Text Tertiary:       #4A6080    (subtle labels)

Border:              #1A3050    (subtle panel borders)
Glow:                rgba(0, 229, 255, 0.15)  (ambient cyan glow)
```

### 2.2 Typography

**Display:** `Syne` — geometric, wide, confident. Used for hero headlines, verdict labels.  
**Body:** `Inter` — clean, readable, neutral. Used for all body text, descriptions.  
**Mono/Data:** `JetBrains Mono` — agent outputs, JSON previews, scores.  
**Labels/UI:** `Inter` at 500 weight, tight tracking.

```
Display XL:   Syne 700, 72px, letter-spacing -2px
Display L:    Syne 700, 48px, letter-spacing -1px
Heading:      Syne 600, 32px
Subheading:   Inter 600, 20px
Body:         Inter 400, 16px, line-height 1.6
Caption:      Inter 400, 13px, color: Text Tertiary
Mono:         JetBrains Mono 400, 13px
Score:        JetBrains Mono 700, 48px, color: Accent Primary
```

---

## 3. 3D Design System

### 3.1 3D Layers Used

The site uses **React Three Fiber** for background environments and **CSS 3D transforms** for card depth.

**Background Scenes:**
- Landing: Floating neural network of connected nodes (agent graph visualization)
- Recruiter Dashboard: Orbital rings around a central decision core
- Results Page: 3D candidate cards arranged in z-depth ranking order

**CSS 3D Elements:**
- Score cards: `transform: perspective(1000px) rotateX(Xdeg)` — slight tilt on hover
- Agent pipeline: 3D vertical stack of nodes, each stepping forward when active
- Verdict badge: Pops toward viewer with `translateZ(20px)` on reveal

**Particle Systems:**
- Landing hero: Sparse floating particles connected by thin lines (Three.js)
- Active agent: Orbiting glow particles around the active step

---

## 4. Page-by-Page Design

---

### 4.1 Landing Page (`/`)

**Layout:**
```
┌──────────────────────────────────────┐
│  Logo          Recruiter | Candidate │  ← Navbar, transparent
├──────────────────────────────────────┤
│                                      │
│  [3D Neural Net Background]          │
│                                      │
│    Your AI Hiring Committee.         │  ← Syne 700, 72px
│    Always On. Never Biased.          │
│                                      │
│    [Start Hiring]  [Upload Resume]   │  ← Two CTAs
│                                      │
├──────────────────────────────────────┤
│  HOW IT WORKS                        │
│                                      │
│  [Agent Pipeline Visual — animated]  │  ← 6 nodes glow one by one
│                                      │
├──────────────────────────────────────┤
│  FOR RECRUITERS    FOR CANDIDATES    │  ← Two columns
├──────────────────────────────────────┤
│  "Strong Hire. Confidence: 92%"      │  ← Mockup verdict card
└──────────────────────────────────────┘
```

**Hero Animation:**
- Three.js: Floating agent nodes in a graph structure, slowly rotating
- Headline types in with a staggered character animation (Framer Motion)
- Background has a deep gradient aurora effect in navy/violet

---

### 4.2 Recruiter Dashboard (`/recruiter`)

**Layout:**
```
┌──────────────┬───────────────────────┐
│  Sidebar     │  Main Panel           │
│              │                       │
│  My Jobs     │  [Upload JD]          │
│  + New Job   │  ┌─────────────────┐  │
│              │  │ Job Title       │  │
│  Job A  →    │  │ Company         │  │
│  Job B  →    │  │ Description     │  │
│              │  └─────────────────┘  │
│              │                       │
│              │  [Upload Resumes]     │
│              │  Drag & drop zone     │
│              │  (shows file chips)   │
│              │                       │
│              │  [Run Pipeline] →     │
└──────────────┴───────────────────────┘
```

**Agent Pipeline Progress (real-time):**
When pipeline runs, a 3D vertical visualizer appears:
```
● Requirement Analyst    ✓  (green glow)
● Hiring Strategist      ✓  (green glow)
● Resume Investigator    ⟳  (spinning cyan — ACTIVE)
● Candidate Evaluator    ○  (waiting)
● Devil's Advocate       ○
● Hiring Committee       ○
```

Each step shows elapsed time. Active node pulses with particle orbit animation.

---

### 4.3 Evaluation Results (`/recruiter/results/[jobId]`)

**3D Candidate Ranking:**

Candidates arranged as 3D cards stacked by rank — #1 is closest to viewer (highest z), others recede in perspective.

```
[Rank #1 — 92pts — Strong Hire]   ← FRONT, largest
   [Rank #2 — 84pts — Strong Hire]  ← MID
      [Rank #3 — 71pts — Consider]    ← BACK, smallest
         [Rank #4 — 58pts — Reject]     ← FURTHEST
```

Clicking a card brings it to the foreground.

**Per-Card Info:**
```
┌────────────────────────────────┐
│  RAJA SHARMA          92 pts   │  ← Score in JetBrains Mono
│  ─────────────────────────     │
│  🟢 Strong Hire   92% conf     │  ← Verdict badge
│                                │
│  Technical     ██████████ 88   │
│  Product       ████████░░ 82   │
│  Communication ███████░░░ 74   │
│  Leadership    ██████░░░░ 68   │
│                                │
│  ⚠️ 1 DA flag  [View Detail]   │
└────────────────────────────────┘
```

---

### 4.4 Candidate Detail (`/recruiter/candidate/[evalId]`)

**Layout — 3 column on desktop:**

```
┌──────────────┬──────────────────┬──────────────┐
│  PROFILE     │  EVALUATION      │  DA REPORT   │
│              │                  │              │
│  Name        │  Score: 84       │  🔴 CONTESTED│
│  Experience  │                  │              │
│  Skills      │  Per-dimension   │  Leadership  │
│  Projects    │  breakdown       │  claim is    │
│              │  with evidence   │  unsupported │
│              │                  │              │
│              │  ──────────────  │  Risk Level: │
│              │  INTERVIEW Qs    │  Medium      │
│              │                  │              │
│              │  Q1: Walk me...  │  Confidence  │
│              │  Q2: Give me...  │  Adjusted:   │
│              │  Q3: How would   │  -4 points   │
└──────────────┴──────────────────┴──────────────┘
```

**Devil's Advocate Panel:**
- Hot pink/red border
- Animated "CONTESTED" chip
- Each contested claim has a toggle to see original vs counter

---

### 4.5 Candidate Dashboard (`/candidate`)

```
┌──────────────────────────────────────┐
│  YOUR AI APPLICATION STRATEGIST      │
│                                      │
│  Upload your resume.                 │
│  Tell us what you want.              │
│  We'll tell you where you stand.     │
│                                      │
│  [PDF Upload Zone]                   │
│                                      │
│  Target Role: [________________]     │
│                                      │
│  [Analyze My Profile]                │
└──────────────────────────────────────┘
```

---

### 4.6 Candidate Report (`/candidate/report/[sessionId]`)

**Sections with tab navigation:**

1. **Fit Score** — Circular gauge, 0–100, animated fill on load
2. **Skill Gaps** — Radar chart (Recharts) showing profile vs job requirements
3. **Resume Suggestions** — Side-by-side: current bullet vs improved bullet
4. **Cover Letter** — Generated text with copy button
5. **Interview Prep** — Q&A cards, flip interaction to reveal suggested answer structure

---

## 5. Motion Design

**Principle:** Motion should reveal, not decorate.

| Element | Animation |
|---|---|
| Agent pipeline nodes | Sequential glow, 400ms each, ease-out |
| Score reveal | Count-up from 0 to final, 800ms |
| Card appear | `translateY(20px) opacity(0)` → rest, staggered |
| 3D card hover | `rotateX(-5deg) rotateY(5deg) translateZ(10px)` |
| Verdict badge | Scale from 0 + blur from 4px, 400ms spring |
| DA panel open | Slide down + red glow pulse |
| Progress bar | Width fill, 600ms ease-in-out |
| Loading state | Three pulsing cyan dots |
| Background | Slow particle drift, 0.3px/frame |

---

## 6. Component Library

Built with **Tailwind CSS** + custom CSS variables.

### Key Custom Components

```
<AgentNode>           — Pipeline step with state (waiting/active/complete)
<ScoreCard>           — 3D candidate card with flip and glow
<VerdictBadge>        — Strong Hire / Consider / Reject with confidence ring
<DAPanel>             — Devil's Advocate contested claim panel
<EvidenceTag>         — Inline evidence chip with source
<ScoreBar>            — Animated horizontal score per dimension
<RadarChart>          — Skill gap visualization
<ResumeComparison>    — Before/after bullet side-by-side
<InterviewCard>       — Flip card with question front, structure back
<AgentOrb>            — 3D orbiting glow for active agent
<PipelineVisualizer>  — Full 6-agent animated chain
```

---

## 7. Responsive Design

| Breakpoint | Behavior |
|---|---|
| Desktop (1280px+) | Full 3-column layouts, 3D depth effects |
| Tablet (768–1279px) | 2-column, reduced 3D, cards stack |
| Mobile (< 768px) | Single column, 3D effects disabled (performance), clean card list |

---

## 8. Accessibility

- WCAG AA color contrast minimum on all text
- Reduced motion: all animations respect `prefers-reduced-motion`
- Keyboard navigation: tab order follows visual flow
- Screen reader labels on all icon-only buttons
- Focus rings: visible 2px cyan border

---

## 9. Signature Design Element

**The Hiring Committee Moment:**

When the final verdict is generated, the UI performs a deliberate cinematic sequence:

1. All 6 agent nodes light up simultaneously
2. A pulsing glow expands from center
3. The verdict text types in character by character: `S T R O N G   H I R E`
4. Confidence ring fills like a loading arc
5. The explanation text fades in below

This single moment makes the demo video. It is the emotional peak of the product experience. Everything else serves this moment.
