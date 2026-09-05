(() => {
  'use strict';
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#primary-nav');
  const closeMenu = () => { nav?.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {closeMenu();menu.focus();}
  });
  nav?.addEventListener('click', event => {if(event.target.closest('a'))closeMenu();});
  document.addEventListener('click', event => {if(!event.target.closest('.site-header'))closeMenu();});
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const service = form.elements.namedItem('service');
  const area = form.elements.namedItem('area');
  const estimate = document.querySelector('#estimate');
  const result = document.querySelector('#request-result');
  const summary = document.querySelector('#request-summary');
  const currency = value => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(value);
  const updateEstimate = () => {
    const option = service.selectedOptions[0];
    estimate.textContent = option?.dataset.low ? `${currency(Number(option.dataset.low))}–${currency(Number(option.dataset.high))} CAD` : 'Select a service';
  };
  const params = new URLSearchParams(location.search);
  for (const field of [service,area]) {
    const value = params.get(field.name);
    if(value && Array.from(field.options).some(option=>option.value===value))field.value=value;
  }
  service.addEventListener('change', updateEstimate);
  updateEstimate();
  let requestText = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    requestText = [
      'PLUMBING PROJECT REQUEST',
      'Prepared using the Copper & Prairie website concept.',
      'NOT SENT — NO APPOINTMENT BOOKED', '',
      `Service: ${service.selectedOptions[0].textContent}`,
      `Community: ${area.selectedOptions[0].textContent}`,
      `Timing: ${values.get('timing')}`,
      ...(String(values.get('name')||'').trim()?[`First name: ${String(values.get('name')).trim()}`]:[]),
      '', 'Description:', String(values.get('details')).trim(), '',
      `Illustrative planning range: ${estimate.textContent}`,
      'This range is not an offer or binding quote. Confirm scope, labour, equipment, travel, taxes, and permit costs with your chosen provider.', '',
      'Before booking: verify credentials, availability, and written terms directly with an operating business.'
    ].join('\n');
    // User text is rendered only as text, never as HTML.
    summary.textContent = requestText;
    form.hidden = true;
    result.hidden = false;
    result.focus();
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
  document.querySelector('#edit-request').addEventListener('click', () => {
    result.hidden = true;form.hidden = false;service.focus();
  });
  document.querySelector('#download-request').addEventListener('click', () => {
    const blob = new Blob([requestText], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;a.download='plumbing-project-request.txt';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
})();
