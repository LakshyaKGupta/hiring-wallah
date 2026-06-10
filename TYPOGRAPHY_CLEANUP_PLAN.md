# Typography Cleanup Inventory

## Summary
- Total `font-mono` uses: 45 instances
- Total `uppercase` uses: 25 instances (some combined)
- Strategy: Replace ~70% of font-mono (32 instances); Remove ~70% of uppercase (18 instances)

## Semantic Classes Available
- `.type-mono` / `.type-mono-score` → for numeric scores & terminal output (KEEP these)
- `.type-label` / `.type-caption` → for UI labels (sans, sentence case)
- `.type-display` / `.type-heading` / `.type-body` → for headings/body (NO uppercase)

## font-mono Replacements (45 total → keep 13, replace 32)

### KEEP as type-mono-score (numeric/terminal): 13 instances
1. [sessionId]/page.tsx:178 - numeric (text-right, text-xs)
2. [sessionId]/page.tsx:246 - SCORE "9.6" (text-4xl, numeric context)
3. [sessionId]/page.tsx:249 - "OVERALL" label (text-[10px])
4. candidate/page.tsx:181 - border flex layout (text-xs)
5. candidate/page.tsx:214 - tertiary helper text (text-[10px])
6. auth/page.tsx:241 - form helper (text-[10px])
7. auth/page.tsx:270 - form helper (text-[10px])
8. recruiter/candidate/[evalId]/page.tsx:211 - skill tags (text-[10px])
9. recruiter/page.tsx:539 - dimension table (text-xs)
10. page.tsx:153 - reasoning logic (text-[10px])
11. page.tsx:789 - terminal block (text-[11px])
12. page.tsx:1092 - terminal output (text-[10px])
13. VerdictReveal.tsx:158 - score display (text-2xl)

### REPLACE with type-label or font-sans: 32 instances
1. [sessionId]/page.tsx:115 - "PROCESSING..." label → type-label
2. [sessionId]/page.tsx:298 - status badge → type-label
3. candidate/page.tsx:167 - h3 heading with uppercase → remove uppercase only
4. candidate/page.tsx:211 - h1 heading with uppercase → remove uppercase only
5. auth/page.tsx:73 - h3 heading with uppercase → remove uppercase only
6. recruiter/candidate/[evalId]/page.tsx:116 - label → type-label
7. recruiter/candidate/[evalId]/page.tsx:169 - status badge → type-label
8. recruiter/candidate/[evalId]/page.tsx:211 - skill labels → type-label or type-caption
9. recruiter/results/[jobId]/page.tsx:139 - label → type-label
10. recruiter/page.tsx:248 - h2 heading → remove uppercase
11. recruiter/page.tsx:349 - status label → type-label
12-14. recruiter/page.tsx:356,358,360 - status badges (DONE/PROCESSING/WAITING) → type-label
15. recruiter/page.tsx:540 - dimension label → type-label
16. page.tsx:155 - "Reasoning Logic:" label → type-label
17. page.tsx:156 - "Active" badge → type-label
18. page.tsx:584 - "Upload → Verdict" label → type-label
19. page.tsx:626 - status label → type-label
20. page.tsx:796 - "Active Evaluated Ledger Target" → type-label
21. page.tsx:829 - label → type-label
22. page.tsx:836 - "Ledger Health" → type-label
23. page.tsx:837 - status badge → type-label
24. page.tsx:1010 - "Experience weight" → type-label
25. page.tsx:1011 - "Skill alignment weight" → type-label
26. page.tsx:1187 - footer text → type-label
27. ScoreCard.tsx:84 - status badge → type-label
28. DAPanel.tsx:65 - "DA REVIEWING..." → type-label
29. DAPanel.tsx:99 - recommendation badge → type-label
30. DAPanel.tsx:112 - "X CLAIMS DETECTED" → type-label
31. DAPanel.tsx:152 - severity badge → type-label
32. VerdictReveal.tsx:125 - headline → remove uppercase, use type-display

## uppercase Removals: 25 total → keep 7, remove 18

### KEEP uppercase (~30%): 7 instances
1. candidate/page.tsx:167 - h3 heading (brand)
2. candidate/page.tsx:211 - h1 heading (brand)
3. auth/page.tsx:73 - h3 heading (brand)
4. recruiter/page.tsx:248 - h2 heading (brand)
5. page.tsx:155 - "Reasoning Logic:" (utility label, special)
6. page.tsx:156 - "Active" badge (status, special)
7. VerdictReveal.tsx:125 - main verdict (brand moment)

### REMOVE uppercase (70%): 18 instances
All others: status labels, secondary badges, body text that shouldn't be uppercase

## Files to Modify
1. src/app/candidate/report/[sessionId]/page.tsx
2. src/app/candidate/page.tsx
3. src/app/auth/page.tsx
4. src/app/recruiter/candidate/[evalId]/page.tsx
5. src/app/recruiter/results/[jobId]/page.tsx
6. src/app/recruiter/page.tsx
7. src/app/page.tsx
8. src/components/ui/ScoreCard.tsx
9. src/components/ui/DAPanel.tsx
10. src/components/ui/VerdictReveal.tsx
