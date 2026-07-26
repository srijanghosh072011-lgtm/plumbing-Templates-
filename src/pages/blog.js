import { imgSrc } from '../lib/assets.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import { img, btn, answerBlock, ctaBand, faqList } from '../lib/components.js';
import { pageHero } from './services.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

/* ----------------------------------------------------------------- blog index */

export function blogIndex(cfg) {
  return `
  ${pageHero(cfg, {
    eyebrow: 'From the workshop',
    title: 'Plumbing guides &amp; advice',
    lead: `Practical maintenance writing for ${esc(cfg.contact.addressLocality)} homes — the things that actually prevent an emergency call, written by the people who take those calls.`,
    trail: [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }],
  })}

  <section class="band">
    <div class="shell">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${cfg.posts
          .map(
            (p, i) => `
          <a class="bezel bezel-interactive group block cursor-pointer" href="/blog/${esc(p.slug)}/" data-reveal data-reveal-delay="${i * 70}">
            <article class="bezel-core flex h-full flex-col">
              <div class="overflow-hidden">
                ${img(imgSrc(`post-${i + 1}`), `Header image for the article: ${p.title}`, {
                  w: 760, h: 520, priority: i === 0,
                  className: 'h-52 w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]',
                })}
              </div>
              <div class="flex flex-1 flex-col p-6">
                <div class="mb-3 flex flex-wrap items-center gap-2 text-[0.75rem] text-ink-faint">
                  <span class="rounded-full bg-canvas-sunk px-2.5 py-1 font-semibold text-ink-muted">${esc(p.category)}</span>
                  <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
                  <span aria-hidden="true">·</span><span>${esc(p.readingMinutes)} min</span>
                </div>
                <h2 class="mb-2.5 font-display text-xl font-bold leading-tight">${esc(p.title)}</h2>
                <p class="mb-5 flex-1 text-sm text-ink-muted">${esc(p.excerpt)}</p>
                <span class="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:gap-3">
                  Read article <span class="grid h-7 w-7 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon('arrowUpRight', { size: 12 })}</span>
                </span>
              </div>
            </article>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

/* ------------------------------------------------------------------ blog post */

export function blogPost(cfg, post) {
  const idx = cfg.posts.findIndex((p) => p.slug === post.slug);
  const others = cfg.posts.filter((p) => p.slug !== post.slug);

  const sections = (post.sections ?? [])
    .map(
      (s) => `
      <h2 class="mt-12 mb-4 text-[length:var(--text-h2)] text-ink">${esc(s.heading)}</h2>
      ${s.paragraphs.map((p) => `<p class="measure mb-4 text-ink-muted">${esc(p)}</p>`).join('')}
      ${
        s.list
          ? `<ul class="measure mb-4 flex flex-col gap-3 pl-1">
              ${s.list.map((li) => `<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span><span class="text-ink-muted">${esc(li)}</span></li>`).join('')}
            </ul>`
          : ''
      }`
    )
    .join('');

  return `
  ${pageHero(cfg, {
    eyebrow: post.category,
    title: esc(post.title),
    lead: post.excerpt,
    trail: [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog/' },
      { name: post.title, path: `/blog/${post.slug}/` },
    ],
  })}

  <section class="band">
    <div class="shell">
      <div class="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <article>
          <div class="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-faint" data-reveal>
            <span class="inline-flex items-center gap-2">${icon('calendar', { size: 15 })}<time datetime="${esc(post.date)}">${fmtDate(post.date)}</time></span>
            <span class="inline-flex items-center gap-2">${icon('clock', { size: 15 })}${esc(post.readingMinutes)} min read</span>
            <span class="inline-flex items-center gap-2">${icon('badge', { size: 15 })}Reviewed by a licensed journeyperson</span>
          </div>

          <div class="bezel mb-10" data-reveal data-reveal-delay="60">
            <div class="bezel-core overflow-hidden">
              ${img(imgSrc(`post-${idx + 1}`), `Header image for the article: ${post.title}`, { w: 760, h: 520, priority: true, className: 'aspect-[19/13] w-full object-cover' })}
            </div>
          </div>

          ${post.answerFirst ? answerBlock(post.answerFirst, { label: 'The short answer' }) : ''}

          <div data-reveal data-reveal-delay="80">${sections}</div>

          ${
            post.faqs?.length
              ? `<div class="mt-14" data-reveal>
                  <h2 class="mb-6 text-[length:var(--text-h2)]">Related questions</h2>
                  ${faqList(post.faqs)}
                </div>`
              : ''
          }

          <div class="bezel mt-14" data-reveal>
            <div class="bezel-core p-7 md:p-8">
              <p class="eyebrow mb-4">Need a hand with this?</p>
              <p class="measure mb-6 text-ink-muted">If any of the above turns out to be beyond a weekend fix, we cover ${esc(cfg.areaServed.length)} communities and quote a fixed price before starting.</p>
              <div class="flex flex-wrap gap-3">
                <a class="btn btn-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="blog_post">
                  <span>Call ${esc(cfg.contact.phoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
                </a>
                ${btn('Book a visit', '/contact/', { variant: 'ghost' })}
              </div>
            </div>
          </div>
        </article>

        <aside class="lg:sticky lg:top-28 lg:self-start">
          <div class="bezel" data-reveal data-reveal-delay="100">
            <div class="bezel-core p-7">
              <h2 class="mb-5 font-display text-lg font-bold">More guides</h2>
              <ul class="flex flex-col gap-5">
                ${others
                  .map(
                    (o) => `
                  <li>
                    <a class="group block" href="/blog/${esc(o.slug)}/">
                      <span class="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">${esc(o.category)}</span>
                      <span class="block font-display text-base font-bold leading-snug transition-colors duration-300 group-hover:text-accent">${esc(o.title)}</span>
                    </a>
                  </li>`
                  )
                  .join('')}
              </ul>
              <hr class="rule my-6">
              ${btn('All guides', '/blog/', { variant: 'deep', className: 'w-full justify-between' })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>`;
}
