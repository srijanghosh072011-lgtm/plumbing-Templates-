# Client intake

Everything needed to turn this template into a live client site. Two files
change: `lib/client.config.ts` and `lib/content.ts`. Nothing else.

Collect all of section 1 **on the first call**. Those are the items a plumber
has but never has to hand, and chasing them afterwards is what turns a two-day
build into a two-week one.

---

## 1. Ask on the call — these block the build

`npm run check` refuses to build while any of these are missing, and that guard
exists for a reason: a wrong phone number on a live plumbing site sends
emergency calls nowhere.

| Ask | Goes to | Why it blocks |
|---|---|---|
| Registered business name (the "Ltd." version) | `legalName` | Appears in schema and legal pages |
| Trading name, and what people call them | `name`, `shortName` | Headings, title tags |
| Year they started | `foundedYear` | "Serving Regina since 1998" — real trust signal |
| Best email for enquiries | `email` | Where the quote form delivers |
| City, province, postal code | `address` | Local SEO. Service-area business, so no street address is published |
| **Journeyperson / contractor licence number** | `licenceNumber` | Shown publicly. The single strongest credibility signal on a trades site |
| **Insurer and liability amount** | `insurance` | e.g. "Prairie Mutual — $5,000,000 general liability" |
| **WCB number** | `wcbNumber` | Homeowners genuinely check this one |
| Opening hours, and Saturdays | `hours` | Feeds schema and the header |
| Do they take 24/7 emergency calls? | `emergencyNote` | If yes it goes above the fold; it is the highest-value line on the site |
| Their domain — do they own one already? | `siteUrl` | If not, register it before building, not after |

## 2. Ask, but does not block

| Ask | Goes to |
|---|---|
| Which of these do you actually do? | `services` in `content.ts` |
| Which towns do you cover? | `areas` in `content.ts` |
| Facebook / Instagram / Google listing links | `social` |
| Anything you want said on the front page | `tagline`, `answerSentence` |

## 3. Reviews — real ones only

`reviews` in `content.ts` is marked up as schema. Marking up reviews that are
not visible on the page, or that were never written, is a Google penalty and a
lie. Copy real ones from their Google listing, word for word, with the real
first name.

If they have none worth using, leave the array empty and set
`aggregateRating` to `null`. The site is fine without it.

## 4. Do yourself

- `web3formsKey` — free from web3forms.com, no account needed. Bind it to the
  client's enquiry inbox and **send a test submission before handover**.
- `isDemo: false` — the moment real data goes in. While it is `true` the
  pre-launch gate downgrades to warnings and protects nothing.
- `builtByCredit` — your footer credit. Ask if they mind. If they do, set it
  to `''`; it is their site.
- `gaMeasurementId` — leave empty unless they want analytics.
- `public/CNAME` — their domain, not `demo.ghoshdesigns.ca`.
- Replace the photos in `public/images`. Stock plumbing photos on a local
  plumber's site are obvious. Ask for photos of their vans and crew — they
  almost always have some on a phone.

## 5. Before handover

```bash
npm run check     # must exit clean, not "demo mode"
npm run build
npm run serve     # click every page, on a phone as well
```

Then check by hand:

- Phone number and email are correct **and tappable on mobile**
- Quote form actually arrives in their inbox
- Every service page describes work they really do
- No town listed that they will not drive to

---

## Time

With everything in section 1 in hand, this is a couple of hours, not days.
Without it, you will be waiting on a WCB number while the client wonders where
their site is. Ask on the first call.
