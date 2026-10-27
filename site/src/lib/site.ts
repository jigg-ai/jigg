// Studio facts used across pages (home, Services, About, Contact). One place, so a
// correction lands everywhere at once.
//
// The credential lines are DRAFTS until every fact is checked against LinkedIn
// (CONTEXT §4) — verifying them is a merge gate for the studio PR. `linkedin` is the
// founder's own profile, supplied by them; if it's ever emptied, pages render no link
// rather than a dead one.
export const FOUNDER = {
  name: 'Sasha Matison',
  title: 'Founder & Principal Engineer',
  credential:
    'Jigg.AI is founded and led by Sasha Matison, a software engineer with 25+ years of experience, including engineering management at Amazon.',
  short: 'Founder-led engineering. 25+ years of software development experience.',
  linkedin: 'https://www.linkedin.com/in/sashamatison',
};

export const CONTACT_EMAIL = 'hello@jigg.ai';
