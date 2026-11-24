# Build notes: open-weight models on Fireworks (build #6)

The running journal for the first open-weight models in Jigg.AI's process. This step: connect
open models and put them to real work under the same rules as the other reviewers.

Times are PST. The worker and the run records are in private repositories, and the review
files are in MatSignal's private repository, so this file names commits and run IDs without
linking them.

## Define

- **Building:** a seat for each of two open-weight models, Kimi K3.1 Pro and DeepSeek V4.1
  Flash, served by Fireworks AI on its US-only routes. A small worker built with Claude Code runs
  each one on a copy of a product repository, with read-only tools, under a spending cap the
  founder sets. Assignments arrive through Slack, and reviews come back as commits.
- **Why:** a one-person studio has no second engineer. Since MatSignal (build #5), plans and
  specs go out to models from other labs (Grok, Gemini, ChatGPT) for independent review. All of
  those are closed models from large US labs. Open-weight models from other labs test whether
  reviewers that different add findings the others miss, and whether they can run under the same
  rules.
- **Success criteria for this step:**
  1. both models run on Fireworks' US routes under the worker's rules;
  2. what the worker charges matches Fireworks' list prices;
  3. no run spends past its cap;
  4. first passes are written blind to the other reviews;
  5. no excluded site is opened;
  6. at least one finding that no other reviewer made.

  Whether a finding gets acted on is tracked but isn't required for this step; it's
  carried forward.
- **Checks:** set when the build was defined on 2026-11-23, and run that day against the run
  records and the review issue. The first review round (November 20–21) happened before the
  checks were written down. They're run against its records after the fact, and this says so.
  See `test.md`.

## Log

### 2026-11-20: Bedrock, then Fireworks

- **15:35:** plan is Kimi K3 on Amazon Bedrock.
- **16:56–17:13:** four Bedrock calls, all 401. **[my setup]** The API key was read from the
  macOS keychain through a password prompt that cut it to 128 characters. About 30 minutes lost.
- **18:21:** the founder picks Fireworks: "let's go with fireworks because I want to also do
  DeepSeek".
- **18:46–18:47: Kimi hand test.** 7 calls, $0.0387 against a $0.25 cap. It showed:
  - the US route works, though Fireworks' model list doesn't show it **[tool limit]**;
  - prompt caching needs no markers: 4,307 of 4,308 repeated tokens came from the cache, 83%
    cheaper;
  - the effort setting is applied as sent;
  - the answer was valid JSON and found all 4 bugs planted in the sample;
  - a strict JSON schema request came back echoed as plain JSON mode, so schema enforcement is
    unconfirmed **[tool limit]**.
- **20:21–22:57: the worker.** Built with Claude Code:
  - a shared price module;
  - the worker, its Slack assignments, and the rule that a Slack assignment is a review only;
  - a founder GO in chat, with an amount, standing in for a standing budget;
  - `--resume` for a run stopped at its cap;
  - the issue reader and second passes.

  Fixes the same evening:
  - replies survive line breaks;
  - the clone holds only tracked files;
  - model text is quoted.
- **21:51–22:08: first live review,** MATSIGNAL-GROWTH-KIMI-001, a first pass on the MatSignal
  growth proposal (matsignal#21). Posted at 22:15.
  - **[my setup] The cap stopped Kimi after three calls, twice:** at $0.26, then $0.28. The worst
    case counted every byte as a token. Fixed by planning from measured usage.
  - **[my setup] Overcharge:** calls were charged at the higher of two readings of their usage.
    This run was metered at **$1.43**, against **$0.67** re-priced from its recorded usage. Fixed
    the same evening (inclusive charging). The record keeps $1.43 as charged.
  - The run took 10 calls in 4 segments: 3 cap stops and 2 resumes. Model time 141.7 s.
  - **[my setup] Still open:** after a resume, the cap and the run's "Run:" line restart from
    zero, so the commit and reply for this pass say "1 model calls, $0.135058".

### 2026-11-21: DeepSeek, web access, second passes

- **07:46:** a DeepSeek seat, its prices, and a guard so a reply file is never overwritten.
- **07:51: DeepSeek hand test,** in a throwaway repository. 3 calls, $0.006163. Tool calls and
  passed-back reasoning both work, and cached tokens are counted inside the prompt count.
- **07:57: Kimi's second pass.** **[my setup]** The last-call note treated 115 KB of reading as
  that many tokens (the real count was about 27,000). Kimi stopped after 1 call at $0.13 with an
  incomplete review, and said "the cost cap stopped me", which was wrong: the note stopped it.
  The mismatch was caught before posting, and the review wasn't posted. Fix: plan with measured
  tokens per byte. **Still open:** a $1 cap can't cover about 120,000 characters of reading, and
  there's no tokenizer.
- **08:48–09:50:** web tools for reviews and a research mode:
  - search through the Brave Search API, charged $0.005 before each search is sent, with results
    kept in memory only;
  - `open_page` only for addresses the run has seen, honouring robots.txt;
  - smoothcomp.com and matsignal.jigg.ai excluded, through up to 5 redirects, archives and
    proxies;
  - public addresses only, at most 5 searches and 5 pages a turn;
  - a citation check that refuses sources the run never opened.
- **09:41: DS-WEB-001,** the first research run, in a throwaway repository: 11 calls, 4 searches,
  10 pages, $0.062929 including Brave. **[tool limit]** DeepSeek cited pages it hadn't opened;
  the citation check refused them.
- **09:56–09:58: Kimi's second pass, rerun:** 3 calls, $0.308183, stopped once and resumed with
  a lower output limit. Posted 17:09.
- **17:15–17:21: DeepSeek's two passes.**
  - First pass: 18 calls, 3 searches, 3 pages, $0.131941 ($0.015 of it Brave). Model time
    168.5 s.
  - Second pass: 13 calls, 0 searches, 2 pages, $0.093929. Model time 92.7 s.
  - Both posted 17:23.

### 2026-11-23: build #6 defined and checked

- Checks set and run against the run records and matsignal#21 (`test.md`).
- Prices in the worker compared with Fireworks' public prices: they match (below).

## Numbers

**Prices** (USD per million tokens, input / cached input / output; read 2026-11-23 from
docs.fireworks.ai/serverless/pricing and the two model pages):

| Model | US route (used) | Base route |
|---|---|---|
| Kimi K3.1 Pro | 2.50 / 0.25 / 12.50 | 2.00 / 0.20 / 10.00 |
| DeepSeek V4.1 Flash 1017 | 0.45 / 0.009 / 1.80 | 0.30 / 0.006 / 1.20 |

The US premium is 1.25× for Kimi and 1.5× for DeepSeek. There's no cache-write charge, and the
worker prices cache writes as ordinary input.

**Runs**

| Run | Calls | Searches / pages | Charged | Note |
|---|---|---|---|---|
| Kimi hand test | 7 | none | $0.0387 | |
| Kimi first pass | 10 | none | $1.430516 | $0.665214 at list price |
| Kimi second pass, first try | 2 | none | $0.129884 | incomplete, not posted |
| Kimi second pass, rerun | 3 | none | $0.308183 | |
| DeepSeek hand test | 3 | none | $0.006163 | |
| DS-WEB-001 research test | 11 | 4 / 10 | $0.062929 | Brave included |
| DeepSeek first pass | 18 | 3 / 3 | $0.131941 | $0.015 Brave |
| DeepSeek second pass | 13 | 0 / 2 | $0.093929 | |

**Totals:**
- Fireworks: about $2.17 as metered, or about $1.40 at list price.
- Brave: $0.035.
- Not yet reconciled against Fireworks' bill.

**What went to Fireworks** (Chat Completions only):
- MatSignal's tracked docs and code: 23 files for Kimi's first pass, 14 and 10 for DeepSeek's
  passes;
- the issue's comments on second passes;
- the text of the pages DeepSeek opened;
- the system prompt, which names the founder.

Secret scans of the repository's 169 tracked files and 576 commits were clean before its copy was
made. No roster file was among the files read.

**Fireworks' terms** (read 2026-11-23):
- Open-model inference isn't logged or stored without opt-in, and data stays "only in volatile
  memory". The Responses API with storage on and the Batch API are exceptions; the worker uses
  neither.
- No training without explicit opt-in (privacy policy, modified 2026-09-16).
- SOC 2 Type II and ISO 27001, 27701 and 42001.
- The terms of service (2026-07-10) set no contractual data region. US-only serving is a product
  feature.
- Prompt caches last "several minutes" per the data-handling page. Notes from 2026-11-20 said
  "up to hours"; the current page wins.

## Dead ends

- **Bedrock first.** It fell to my own keychain problem, then was dropped for Fireworks, which
  serves both models.
- **Fireworks' Responses API web search** can't exclude sites and stores data by default. The
  worker does its own search through Brave instead.
- **The page reader can't run JavaScript.** A site built that way came back as its 8-character
  title, so one claim in the review stays unverified. **[my setup]**

## Time

My time wasn't tracked. What's on record is 44 messages from the founder in the session that set
this up, from 15:37 on November 20 to 17:40 on November 21. Claude Code's time building the
worker wasn't measured. The models' own working time is in the runs above.
