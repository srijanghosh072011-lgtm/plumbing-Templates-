# Contact model: form-first, no phone number

This template ships with **no public phone number**. Every route to the
business goes through the quote form at `/quote/`, with email as the fallback
when the form itself fails.

## Why

- One intake channel means one place to look. A missed call leaves no record;
  a form submission does.
- Every enquiry arrives with the postal code, the service, and a written
  description already attached, so nobody is reconstructing a job from memory.
- A fake phone number on a live trades site sends emergency calls into the
  void. Shipping none is safer than shipping a placeholder, and the pre-launch
  check no longer has to police a 555 number that only existed for the demo.

## What replaced it

| Was | Now |
|---|---|
| Header "Call (306) …" | "Get a quote" → `/quote/` |
| Hero secondary CTA | "24/7 emergency service" → the emergency service page |
| Footer "Call us today" block | "Start here — Request a quote" |
| Quote page "Rather just call?" | "Something urgent?" → explains the emergency checkbox |
| Form error fallback | `mailto:` the business address |
| `Plumber` schema `telephone` | omitted (recommended, not required) |
| `llms.txt` phone line | "Contact: quote form at /quote/" |

## Urgency, without a phone line

Removing the number removes the only way a customer could say "this is an
emergency" faster than everything else in the queue. The quote form therefore
carries an explicit **emergency checkbox** (`name="urgent"`), styled as a
full-width target rather than a 16px box so it is findable in a panic. Copy
across the site points at it — so if you ever remove that field, the promises
on `/quote/`, the homepage process steps, and the service pages all become
false. Search for `urgent` before touching it.

## Putting a phone number back

Some clients will want one. It is a config key and a CTA, not a rewrite:

1. Add `phone` and `phoneRaw` back to `lib/client.config.ts`.
2. Add `telephone: client.phoneRaw` to the `Plumber` block in `lib/schema.ts`.
3. Add a `Cta` with `external`, `icon="phone"`, `href={`tel:${client.phoneRaw}`}`
   and `data-analytics="phone_call_click"` wherever you want it. The delegated
   click tracking in `components/Analytics.tsx` still handles `tel:` links —
   that code was deliberately left in place.
4. Restore the 555-number rule in `scripts/prelaunch-check.mjs` expectations by
   putting a real number in, not by loosening the check.
