# MVP idea: women's body practice tracker

Source parsed: https://t.me/s/selfmade_people

## What the channel content suggests

The strongest recurring themes from the first 120 parsed posts:

- Body awareness, pelvic floor, relaxation, sensitivity.
- Libido as a state affected by stress, sleep, dopamine, safety, relationships.
- Short practices: breathing, reverse Kegel, pelvic mobility, posture, movement.
- Course-like formats: lessons, fitness-kamasutra, trainers, recorded practices.
- Emotional framing: self-care, confidence, contact with the body, not "medical treatment".

## Product angle

Build a soft daily practice app, not a clinical Kegel counter.

Working positioning:

> A beautiful daily ritual app for pelvic floor relaxation, libido, cycle awareness, and contact with your body.

Avoid hard medical claims. Use wording like "well-being", "body awareness", "practice", "self-observation". Add a clear note that pain, postpartum issues, prolapse, incontinence, or medical concerns should go to a clinician.

## MVP

1. Onboarding

- Goal: pelvic floor relaxation, sensitivity, libido, cycle comfort, confidence.
- Experience: beginner / practiced before / using a trainer.
- Current state: tense, tired, low desire, want routine, want cycle tracking.
- Time available: 3, 7, 12 minutes.
- Tone: calm, sensual, premium, no vulgarity.

2. Today screen

- Daily ritual card: one selected practice.
- Quick check-in:
  - energy
  - stress
  - body tension
  - desire/libido
  - cycle day
- Done checklist:
  1. Breathing
  2. Pelvic floor relaxation
  3. Hip/pelvis mobility
  4. Self-care
  5. Reflection

3. Practices

- 3-12 minute guided cards.
- Categories:
  - Relax pelvic floor
  - Wake up sensitivity
  - Libido reset
  - Before intimacy
  - Cycle comfort
  - Confidence and posture

4. Tracker

- Calendar with daily dots.
- Streaks without pressure.
- Trends: stress vs desire, cycle phase vs sensitivity, practice consistency.

5. Library

- Lessons generated from channel/site content.
- Each lesson can become:
  - short article
  - practice
  - checklist
  - reflection prompt

## First version screens

- Splash/onboarding with 4-5 steps.
- Home: "Today" with daily practice and check-in.
- Tracker: cycle and wellness calendar.
- Practices: filterable lesson/practice cards.
- Profile/progress: goals, streak, saved practices.

## Content model

Use this structure after parsing posts:

```json
{
  "title": "Reverse Kegel",
  "source_post_id": 1342,
  "type": "practice",
  "category": "pelvic_floor_relaxation",
  "duration_minutes": 5,
  "difficulty": "beginner",
  "steps": [
    "Take a comfortable lying or sitting position",
    "Breathe slowly into the belly",
    "On inhale, imagine the pelvic floor softening downward",
    "On exhale, keep the softness without squeezing"
  ],
  "safety_note": "Do not push or strain. Stop if there is pain."
}
```

## Next build step

Make a clickable web prototype first:

- Static local app is enough for first validation.
- Use parsed Telegram content as seed data.
- Keep the design more premium wellness than medical app.
- Later turn it into React Native / Expo if the concept feels right.

