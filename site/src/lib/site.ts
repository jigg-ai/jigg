// Studio facts used across pages (home, Services, About, Contact). One place, so a
// correction lands everywhere at once.
//
// The credential lines are DRAFTS until every fact is checked against LinkedIn
// (CONTEXT §4) — verifying them is a merge gate for the studio PR. `linkedin` is
// left empty until the real URL is supplied; pages render no link while it's empty
// rather than a dead or guessed one.
export const FOUNDER = {
  name: 'Sasha Matison',
  title: 'Founder & Principal Engineer',
  credential:
    'Jigg.AI is founded and led by Sasha Matison, a software engineer with 25+ years of experience, including engineering management at Amazon.',
  short: 'Founder-led engineering. 25+ years of software development experience.',
  linkedin: '',
};

export const CONTACT_EMAIL = 'hello@jigg.ai';
