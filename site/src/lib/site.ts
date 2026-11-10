// Studio facts used across pages, in one place so a correction lands everywhere.
//
// Two kinds, deliberately separate (CONTEXT §4):
// - LEAD_PROMISE is the permanent, role-based promise. Home, Services and Contact use
//   it, and never name the person.
// - FOUNDER is the person who fills the role today. Only About's short blurb and the
//   founder page (/about/sasha-matison/) render it. Credentials describe the person,
//   never Jigg.AI, so they don't appear anywhere else. The credential line was checked
//   against LinkedIn by the founder on 2026-10-26; the career history and education
//   come from the LinkedIn profile the founder supplied on 2026-11-09. Re-check them
//   whenever either changes. If the lead ever changes, this object is the change.
export const LEAD_PROMISE =
  'Every engagement is guided by experienced engineering judgment, with AI accelerating implementation, testing and iteration. You work directly with the engineering lead responsible for your project.';

export const ORGANIZATION_ID = 'https://jigg.ai/#organization';

/**
 * One role on the founder page. Only what the founder has supplied or confirmed
 * belongs here: an unconfirmed title, date or employer is left out entirely, not
 * marked "pending", because this repository is public. `detail` is one highlight,
 * taken from the founder's own description of the role; `source` records where the
 * row came from and when.
 */
interface CareerRow {
  org: string;
  role: string;
  period: string;
  detail: string;
  source: string;
}

interface EducationRow {
  school: string;
  /** Exactly as the founder states it; no degree is implied where none is given. */
  credential: string;
  /** Emit as schema.org alumniOf. Only where the credential is unambiguous. */
  alumni: boolean;
  source: string;
}

const LINKEDIN_2026_11_09 = 'LinkedIn profile, supplied by the founder 2026-11-09';

export const FOUNDER = {
  name: 'Sasha Matison',
  firstName: 'Sasha',
  title: 'Founder & Principal Engineer',
  // Verified facts, worded to follow "<name> is …" (lowercase, no full stop), so every
  // page that states them uses the same words. `summary` is the short credential line
  // (About, meta descriptions); `intro` is the founder page's longer opening.
  summary:
    'a software engineer with 25+ years of experience, including engineering management at Amazon',
  intro:
    'a software engineer with 25+ years of experience building software and leading engineering teams: enterprise engineering at Netegrity and CA Technologies, engineering management at Amazon, technical leadership at Avolin, and independent software ventures',
  linkedin: 'https://www.linkedin.com/in/sashamatison',
  // The dedicated credentials page (CONTEXT §4) and its Person entity.
  page: '/about/sasha-matison/',
  personId: 'https://jigg.ai/about/sasha-matison/#person',
  // Newest first. Years only: the months are on LinkedIn.
  career: [
    {
      org: 'Jigg.AI',
      role: 'Founder & Principal Engineer',
      period: '2026–present',
      detail: 'Leads every client engagement, from the first conversation to what’s delivered.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'Independent',
      role: 'Software Engineer, Distributed Systems & Open Source',
      period: '2020–present',
      detail:
        'Built Bitcoin Lightning Network infrastructure and Node.js software for decentralized payments and operational automation, with an emphasis on fault tolerance.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'Avolin',
      role: 'Technical Director',
      period: '2019–2020',
      detail:
        'Led a global team of software architects onboarding eight newly acquired products onto an internal cloud platform.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'Axiom',
      role: 'Head of Development',
      period: '2016–2020',
      detail:
        'Launched a cloud platform matching students with employers through the competencies earned in coursework, used AI to generate those competencies, and scaled it to profitability.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'DevDraft',
      role: 'CEO',
      period: '2013–2015',
      detail:
        'Launched a platform connecting software developers with employers through coding challenges, scored automatically from the submitted code, and built it into a revenue-generating business.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'Amazon',
      role: 'Manager, Development',
      period: '2011–2013',
      detail:
        'Built and led a team of 10 developers on Amazon’s e-commerce cloud platform, and onboarded internal teams including Kindle Books, Prime Video and the App Store.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'CA Technologies',
      role: 'Manager, Development',
      period: '2008–2011',
      detail:
        'Launched Federation Manager, for secure business transactions over the internet, by reusing SiteMinder’s core components; hired and mentored a team of six developers.',
      source: LINKEDIN_2026_11_09,
    },
    {
      org: 'Netegrity',
      role: 'Principal Engineer, Development',
      period: '2000–2008',
      detail:
        'Grew into technical leadership for SiteMinder, the flagship web access-control product, and led its integration after CA Technologies acquired Netegrity in 2004.',
      source: LINKEDIN_2026_11_09,
    },
  ] as CareerRow[],
  education: [
    {
      school: 'Massachusetts Institute of Technology',
      credential: 'Graduate coursework, Distributed and Knowledge Based Systems',
      alumni: false, // coursework, no degree: not claimed in structured data
      source: `${LINKEDIN_2026_11_09}; "graduate coursework, no degree" confirmed in chat the same day`,
    },
    {
      school: 'Technion – Israel Institute of Technology',
      credential: 'BS, Computer Science',
      alumni: true,
      source: LINKEDIN_2026_11_09,
    },
  ] as EducationRow[],
  // The founder's photo, supplied by the founder on 2026-11-09: the LinkedIn profile
  // photo at its full 400×400, by the founder's choice. Shown at 200px, so it stays
  // sharp on 2× screens; a larger original can replace it here. Without a photo the
  // page lays out without one: no placeholder face is ever rendered.
  headshot: {
    src: '/img/about/sasha-matison.jpg',
    width: 400,
    height: 400,
    alt: 'Sasha Matison',
  } as undefined | { src: string; width: number; height: number; alt: string },
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
