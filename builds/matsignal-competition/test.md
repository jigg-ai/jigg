# MatSignal: test record

What was checked, when it last ran, and what hasn't been tested. The checks live in the product's
private repository and run against its local Worker on made-up data only. No aggregate score is
claimed: each check guards one promise, and a total would hide which.

The October 30 demo inside this site had its own record, on the unmerged
[`build/matsignal-competition`](https://github.com/jigg-ai/jigg/blob/build/matsignal-competition/builds/matsignal-competition/test.md)
branch. It applies to that demo, not to the product below.

## Automated checks

| Check | What it guards | Result | Last run |
|---|---|---|---|
| Unit tests (`npm test`) | Name and team matching, the adults-only division rule, reading copied participant lists (including the minor's-name gap rule), refusing saved web pages and copies with no athletes | **47/47 pass** | 2026-11-06, before the deploy |
| Type check (`npm run check`) | The Worker's TypeScript against Cloudflare's generated types | **Pass** | 2026-11-06, before the deploy |
| End-to-end smoke test (`npm run test:smoke`) | Pages and `noindex`, robots.txt, search, the squad check, the cookie backup, the kill switch, adding a competition by link, imports and their safety checks, no ages or birth years in results, removals, sharing, competition links, turning a link off, admin stopping a share | **57/57 pass** | 2026-11-06 19:33 PST |
| Restore drill (`npm run drill:restore`) | After an imitated database restore to before a removal: the removed person stays hidden on the very next search and is deleted again; a stopped share and a turned-off link stay gone | **12/12 pass** | 2026-11-06 19:34 PST |
| Sweep test (`npm run test:sweep`) | The search guard against scripted harvesting of a 2,000-athlete made-up roster | **Partial**: see below | 2026-11-06 15:06 PST |

**The sweep test.** Five scripted visitors: an ordinary one typing twelve names letter by letter, a
single address sweeping every surname, a single address sweeping first name plus initial, 200
addresses sweeping every surname, and bulk checks of full names across 50 addresses. The ordinary
visitor was never refused, and every sweep was cut short. The guard still lets more through than
the target of 2% of the roster on more than one path, worst on the bulk check of full names.
Tightening it is an open decision. The per-path numbers are kept in the product repository, not
here.

**A gap in the drill itself.** Run straight after two smoke tests, the drill's share step was refused
by the share endpoint's per-minute limit ("Too many requests"), and the drill crashed on the missing
share instead of reporting a failure. A minute later it passed 12/12. **[my setup]**: the drill
should check the server's answer and fail cleanly.

## Live checks after the deploy (2026-11-06)

- The live Worker's database binding is the production database, confirmed through Cloudflare's API
  (the deploy output displays a placeholder id).
- `/`, `/privacy`, `/api/events`, `/robots.txt` (disallow all) and every icon answer 200.
- `/admin` and `/admin/api/state` redirect to the Cloudflare Access login.
- Security headers are set. There's no local-admin binding on the live Worker, and request logs
  are off.
- The minute job ran, with outcome ok.
- After the founder's import, Grappling X shows 64 adult entries, fresh.
- A shared page's link preview names the competition and points its picture at the live icon.

## Found after launch, fixed the same evening

- On a phone, the shared page's header didn't wrap, so the whole page scrolled sideways. Found while
  taking this build log's screenshots. Fixed and checked locally at 390 px wide, with a full header
  (the page is exactly 390 px, no sideways scroll). Deployed 2026-11-06, after the unit tests (47/47),
  the type check and the smoke test (57/57) passed again. On the live site, the stylesheet has the
  fix and a shared page at 390 px doesn't scroll sideways. That live check used a link that no longer
  works, whose header is short: no live squad was created for it.

## Not tested

- Real phones: Safari on iPhone, Chrome on Android, and links opened inside WhatsApp or Instagram,
  whose built-in browsers can block sharing and copying. Send… (the phone share sheet) is untested.
- A screen reader.
- A competition day: the first is Grappling X, November 14.
- Load beyond the sweep test.
