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
