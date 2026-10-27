// Studio facts used across pages, in one place so a correction lands everywhere.
//
// Two kinds, deliberately separate (CONTEXT §4):
// - LEAD_PROMISE is the permanent, role-based promise. Home, Services and Contact use
//   it, and never name the person.
// - FOUNDER is the person who fills the role today. Only About renders it. Credentials
//   describe the person, never Jigg.AI, so they don't appear anywhere else. They were
//   checked against LinkedIn by the founder on 2026-10-26; re-check them whenever
//   either changes. If the lead ever changes, this object is the change.
export const LEAD_PROMISE =
  'Every engagement is guided by experienced engineering judgment, with AI accelerating implementation, testing and iteration. You work directly with the engineering lead responsible for your project.';

export const FOUNDER = {
  name: 'Sasha Matison',
  title: 'Founder & Principal Engineer',
  // Verified facts, worded so About can follow the name line without repeating it.
  summary:
    'A software engineer with 25+ years of experience, including engineering management at Amazon',
  linkedin: 'https://www.linkedin.com/in/sashamatison',
};

export const CONTACT_EMAIL = 'hello@jigg.ai';

// The three ways to engage (CONTEXT §16). One list, so the names are identical on
// Services, the homepage and the Contact form's "What kind of help?" field, and the
// answers stay comparable. `id` is what the form sends; contact.mjs keeps the same
// ids in its own allow-list.
export const ENGAGEMENTS = [
  {
    id: 'pilot',
    name: 'Scoped Engineering Pilot',
    summary:
      'A paid, fixed-scope way to try the approach on one real problem, after a free discovery conversation.',
    points: [
      'Assess the system or workflow, its constraints, and the outcome you want',
      'Pick one meaningful, bounded improvement',
      'Implement it where that can be done safely',
      'Test it, with a human reviewing every result',
      'Hand over the result, the findings, and a proposal for anything larger',
    ],
    note: "Not every system allows a safe change inside a small pilot. When it doesn't, the deliverable is the assessment and a plan.",
  },
  {
    id: 'project',
    name: 'Engineering Project',
    summary:
      'Defined work — a prototype, a modernization, an integration or an automation — with agreed deliverables and acceptance criteria.',
    points: [],
    note: '',
  },
  {
    id: 'leadership',
    name: 'Fractional Technology Leadership',
    summary:
      'A part-time technology lead on a monthly retainer, for organizations without one in-house.',
    points: [
      'Technical direction and planning',
      'Evaluating vendors and options',
      'Overseeing the work, and choosing what to improve next',
    ],
    note: "Hours, responsibilities and availability are set in the agreement, and implementation is scoped separately or through an explicit allowance. It isn't an on-call IT service: 24/7 availability, IT support and emergencies are excluded unless contracted separately.",
  },
] as const;
