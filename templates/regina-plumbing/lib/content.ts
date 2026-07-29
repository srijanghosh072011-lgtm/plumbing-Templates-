import { client } from './client.config';

/**
 * Site content. Split out from client.config.ts because this is the part a
 * copywriter edits, while client.config.ts is the part an account manager
 * edits. Both feed the same pages and the same JSON-LD.
 */

export type Service = {
  slug: string;
  name: string;
  /** Card image, in public/images. 4:3, 1000x750. */
  image: string;
  imageAlt: string;
  /** Used in nav and cards. Keep under ~60 chars. */
  short: string;
  /** The direct answer, first thing on the page. Playbook 3. */
  answer: string;
  /** Shown as "$X–$Y" — real ranges get cited by AI, "call for pricing" does not. */
  priceLow: number;
  priceHigh: number;
  priceUnit: string;
  body: string[];
  includes: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: 'emergency-plumbing',
    image: '/images/svc-emergency.webp',
    imageAlt: 'Water dripping from a worn brass tap against a black background',
    name: 'Emergency Plumbing',
    short: '24/7 call-out for burst pipes, sewer backups and no-heat.',
    answer:
      'Emergency plumbing in Regina covers burst or frozen pipes, active leaks, sewer backups, and total loss of hot water or heat. We answer 24/7 and typically reach Regina addresses within 60 to 90 minutes. Call-out is a flat $189 after hours, applied against the repair if you go ahead.',
    priceLow: 180,
    priceHigh: 650,
    priceUnit: 'typical emergency repair',
    body: [
      'A burst pipe in a Saskatchewan January is not a next-morning problem. Water moves fast, and the difference between a $400 repair and a $14,000 insurance claim is usually how quickly someone gets the main shut off and the line clamped.',
      'If you are standing in water right now: shut off the main valve — normally in the basement on the wall facing the street — then call. We will talk you through the shut-off on the phone if you cannot find it.',
      'We carry the common failure parts on the truck: shut-off valves, PEX and copper fittings, wax rings, supply lines, thermocouples, and pressure-relief valves. Most emergency calls finish in a single visit rather than a diagnosis today and a repair on Thursday.',
    ],
    includes: [
      'Arrival within 60–90 minutes inside Regina city limits',
      'Main shut-off, leak isolation and immediate water-damage control',
      'Frozen and burst pipe thaw, repair and re-pressure test',
      'Sewer backup clearing and camera confirmation',
      'Written flat-rate price before any work starts',
    ],
    faqs: [
      {
        q: 'Do you charge extra for nights and weekends?',
        a: 'Yes. After-hours call-out is a flat $189, which covers travel and the first hour on site. It is credited against the repair if you approve the work. We tell you the number on the phone before we dispatch — there is no surprise on the invoice.',
      },
      {
        q: 'How fast can you actually get here?',
        a: 'Inside Regina, typically 60 to 90 minutes. Outside the city — Lumsden, White City, Pilot Butte, Balgonie — allow 90 minutes to 2 hours depending on highway conditions. During a deep cold snap, when everyone calls at once, we triage by severity: active flooding and no-heat go first.',
      },
      {
        q: 'What should I do before you arrive?',
        a: 'Shut off the water main. For a burst pipe, open the lowest tap in the house to drain the line and reduce pressure. Move anything valuable off the floor. If water is anywhere near the electrical panel, do not touch it — shut off power at the breaker only if you can reach it while standing somewhere dry, and tell us when you call.',
      },
    ],
  },
  {
    slug: 'drain-cleaning',
    image: '/images/svc-drain.webp',
    imageAlt: 'Grey PVC waste pipework running across a basement wall',
    name: 'Drain Cleaning',
    short: 'Snaking, hydro-jetting and camera inspection for slow or blocked drains.',
    answer:
      'Drain cleaning in Regina costs $149 to $279 for a standard sink, tub or floor drain, and $320 to $480 for a main sewer line requiring hydro-jetting. Most single-fixture clogs clear in under an hour. Every main-line clear includes a camera inspection so you can see what caused it.',
    priceLow: 149,
    priceHigh: 480,
    priceUnit: 'typical drain clear',
    body: [
      'A slow drain is a warning, not an inconvenience. By the time a main line backs up into a basement floor drain, the blockage has usually been building for months — grease layering in a kitchen line, or tree roots working into a clay sewer joint.',
      'Regina has a lot of older clay sewer lines, particularly in Cathedral, the Crescents and North Central. Elm and poplar roots find the joints, and no amount of chemical drain cleaner touches them. We run a camera before and after so you can see whether you have a soft blockage, a root intrusion, or a collapsed section that needs replacement.',
      'We do not sell drain chemicals, and we would rather you did not pour them down either. Sodium hydroxide sits on the blockage generating heat, which is how PVC joints deform and old cast iron pins.',
    ],
    includes: [
      'Cable snaking for sink, tub, toilet and floor drains',
      'High-pressure hydro-jetting for grease and root intrusion',
      'Colour camera inspection with footage sent to you',
      'Locating and depth marking for suspected line damage',
      'Follow-up plan if the camera shows a structural fault',
    ],
    faqs: [
      {
        q: 'How much does drain cleaning cost in Regina?',
        a: 'A single fixture — kitchen sink, bathroom sink, tub or toilet — runs $149 to $279. A main sewer line clear with hydro-jetting runs $320 to $480. Camera inspection is included with any main-line job rather than billed separately.',
      },
      {
        q: 'Will drain cleaner from the hardware store work?',
        a: 'Rarely, and it makes our job harder. Caustic cleaners generate heat that can deform plastic joints, and if the line is fully blocked, the chemical just sits there — so whoever opens that line is working in a pool of it. For a slow drain, near-boiling water and a plunger is a safer first try.',
      },
      {
        q: 'Do tree roots mean I need my whole sewer line replaced?',
        a: 'Usually not. Roots enter at a joint, and jetting cuts them back. If the camera shows an intact pipe with root intrusion at one joint, jetting plus an annual clear keeps it working for years. Replacement is the answer when the camera shows a collapsed, offset or bellied section — and we will show you the footage rather than ask you to take our word for it.',
      },
    ],
  },
  {
    slug: 'water-heater-repair',
    image: '/images/svc-waterheater.webp',
    imageAlt: 'Wall-mounted tankless water heater with its valve manifold below',
    name: 'Water Heater Repair & Replacement',
    short: 'Tank and tankless repair, replacement and sizing.',
    answer:
      'Water heater replacement in Regina costs $1,650 to $2,400 installed for a standard 40–60 gallon gas tank, and $3,200 to $4,600 for a tankless unit. Repairs — thermocouple, element, anode rod, pressure-relief valve — typically run $220 to $560. Most replacements are done in one visit.',
    priceLow: 220,
    priceHigh: 4200,
    priceUnit: 'repair through full replacement',
    body: [
      'A tank water heater lasts 8 to 12 years on Regina water. Our water is hard, and hardness is what kills tanks — scale builds on the bottom, insulates the burner from the water, and the steel overheats until it fails.',
      'Not every failure is a replacement. A gas tank that will not stay lit is usually a $220 thermocouple. An electric tank producing lukewarm water is usually one dead element. We check the cheap causes first, and we will tell you when a repair is not worth it on a tank that is already eleven years old.',
      'On replacement, sizing matters more than brand. An undersized tank in a five-person house means cold showers regardless of what is on the label, and an oversized one means standby loss you pay for every month.',
    ],
    includes: [
      'Diagnosis of no-hot-water and lukewarm-water faults',
      'Thermocouple, element, thermostat and anode rod replacement',
      'Tank removal, disposal and code-compliant reinstall',
      'Tankless installation, descaling and annual service',
      'Expansion tank and pressure-relief valve verification',
    ],
    faqs: [
      {
        q: 'How long does a water heater last in Regina?',
        a: 'Eight to twelve years for a standard tank. Regina water is hard, so scale accumulation is the usual limit. Flushing the tank annually and replacing the anode rod around year five reliably adds a few years.',
      },
      {
        q: 'Is a tankless water heater worth it?',
        a: 'It depends on the household, and we will give you a straight answer rather than upsell. Tankless makes sense for high hot-water demand, for households wanting endless hot water, or where floor space is genuinely tight. It costs roughly two to three times a tank installed, and on hard Regina water it needs annual descaling. For a two-person household with normal usage, a good tank is usually the better financial decision.',
      },
      {
        q: 'My hot water smells like rotten eggs. What is that?',
        a: 'Sulfate-reducing bacteria reacting with the magnesium anode rod. It is unpleasant but not dangerous. Swapping to an aluminium-zinc anode rod fixes it in most cases, and that is a repair rather than a replacement.',
      },
    ],
  },
  {
    slug: 'furnace-heating',
    image: '/images/svc-furnace.webp',
    imageAlt: 'Technician testing the controls on an outdoor heat pump unit',
    name: 'Furnace & Heating',
    short: 'Furnace repair, replacement and annual service before the cold hits.',
    answer:
      'Furnace repair in Regina costs $190 to $720 for common faults such as igniters, flame sensors and blower motors. Full high-efficiency furnace replacement runs $4,800 to $7,500 installed. We run 24/7 no-heat calls all winter.',
    priceLow: 190,
    priceHigh: 7500,
    priceUnit: 'repair through replacement',
    body: [
      'No heat at −35 is a safety call, not a maintenance call. Pipes in an unheated Saskatchewan house start freezing within hours, so a furnace failure quickly becomes a plumbing failure too. We treat no-heat as emergency priority from November through March.',
      'The most common winter no-heat call is not a dead furnace. It is a cracked hot-surface igniter or a dirty flame sensor — an hour of work and a part that costs less than a tank of gas. The second most common is a blocked exhaust vent after a blowing snow event, which you can sometimes clear yourself from outside.',
      'If you are booking a service before winter, September and October are the right months. Everyone books in the first cold snap, and that is when wait times go from days to weeks.',
    ],
    includes: [
      'No-heat diagnosis, 24/7 through the heating season',
      'Igniter, flame sensor, blower motor and control board replacement',
      'Annual clean-and-check with combustion analysis',
      'High-efficiency furnace sizing, installation and permits',
      'Carbon monoxide testing on every heating visit',
    ],
    faqs: [
      {
        q: 'My furnace is blowing cold air. What is wrong?',
        a: 'Most often a failed igniter or a dirty flame sensor — the furnace tries to fire, fails, and the blower runs anyway. Before you call, check that the thermostat is set to Heat rather than On, and that the exhaust vent outside is not packed with snow. If both are fine, it needs a technician.',
      },
      {
        q: 'How often should a furnace be serviced?',
        a: 'Once a year, ideally in early autumn before the first hard freeze. An annual clean-and-check catches a failing igniter, a cracked heat exchanger, or a blocked vent while it is still an appointment rather than an emergency. It is also a condition of most manufacturer warranties.',
      },
      {
        q: 'Do you check for carbon monoxide?',
        a: 'On every heating visit, without being asked and at no extra charge. A cracked heat exchanger is the failure that matters most, and it is not something a homeowner can see. If you do not have a CO alarm on every level of the house, that is the cheapest safety purchase you will ever make.',
      },
    ],
  },
  {
    slug: 'bathroom-kitchen-plumbing',
    image: '/images/svc-bathroom.webp',
    imageAlt: 'Homeowner running water at a kitchen sink with a black mixer tap',
    name: 'Bathroom & Kitchen Plumbing',
    short: 'Fixture installs, rough-ins and renovation plumbing.',
    answer:
      'Bathroom and kitchen plumbing covers fixture replacement, renovation rough-ins, and relocating supply and drain lines. A straightforward faucet or toilet swap runs $165 to $420. A full bathroom rough-in for a renovation runs $2,900 to $5,200 depending on how far the fixtures move.',
    priceLow: 165,
    priceHigh: 5200,
    priceUnit: 'fixture swap through full rough-in',
    body: [
      'Renovation plumbing goes wrong in the planning, not the pipe work. Moving a toilet more than a metre from the existing stack often means opening the floor and re-sloping the drain — a decision far cheaper to make on a drawing than after the tile is down.',
      'We work directly with your contractor or on our own. If you are laying out a basement bathroom, get us in before the concrete is cut, not after.',
      'Every fixture install is pressure-tested and left with the shut-offs labelled, so the next person who needs to isolate that fixture — you, at midnight — does not have to guess.',
    ],
    includes: [
      'Faucet, toilet, sink, tub and shower valve installation',
      'Full bathroom and kitchen renovation rough-in',
      'Supply and drain relocation with permit where required',
      'Basement bathroom layout and below-slab drainage',
      'Backflow prevention and dishwasher or fridge line hook-up',
    ],
    faqs: [
      {
        q: 'Can I move my toilet during a bathroom renovation?',
        a: 'Yes, but distance decides the cost. Within about a metre of the existing stack is usually straightforward. Beyond that, the drain needs re-sloping — a consistent fall of roughly 2% — which normally means opening the floor. On a concrete slab that means cutting and re-pouring. Ask us before finalising the layout, not after.',
      },
      {
        q: 'Do I need a permit for bathroom plumbing work?',
        a: 'For new fixtures, relocated drains, or anything altering the DWV system, yes — the City of Regina requires a plumbing permit, and we pull it. Like-for-like replacement of an existing fixture in the same spot generally does not. Skipping a required permit becomes a problem when you sell the house.',
      },
      {
        q: 'Will you work alongside my general contractor?',
        a: 'Routinely. We coordinate rough-in around framing and inspection, then return for the finish once tile and cabinetry are in. Give us the schedule early — plumbing rough-in has to pass inspection before anything gets closed up.',
      },
    ],
  },
  {
    slug: 'sump-pumps-backwater-valves',
    image: '/images/svc-sump.webp',
    imageAlt: 'Finished dry basement with carpeted floor and painted walls',
    name: 'Sump Pumps & Backwater Valves',
    short: 'Flood protection: sump pumps, battery backup and backwater valves.',
    answer:
      'A sump pump installation in Regina costs $550 to $1,400, and a backwater valve $1,900 to $3,400. The City of Regina has offered a Home Flood Protection rebate toward backwater valve installation — check current eligibility before booking, as terms change year to year.',
    priceLow: 550,
    priceHigh: 3400,
    priceUnit: 'sump pump through backwater valve',
    body: [
      'Regina sits on heavy clay with a flat water table, and spring melt plus a fast summer storm is the combination that puts water in basements. Two devices do almost all the protecting: a sump pump moves groundwater out before it reaches the floor, and a backwater valve stops city sewer from reversing into your basement when the main surcharges.',
      'A sump pump without battery backup is a pump that fails exactly when you need it, because prairie storms take the power out and drop four inches of rain in the same hour. Backup is not an upsell; it is the point.',
      'Backwater valves need to be accessible and cleared periodically. We install with a proper access cover rather than burying it under the slab, so it can actually be inspected.',
    ],
    includes: [
      'Sump pit excavation, pump sizing and discharge routing',
      'Battery backup and high-water alarm installation',
      'Backwater valve installation with accessible cover',
      'Annual testing of pump, float switch and check valve',
      'Documentation for insurance and municipal rebate applications',
    ],
    faqs: [
      {
        q: 'Do I need a backwater valve in Regina?',
        a: 'If your basement has any plumbing fixture or floor drain below street level, it is worth having. Regina has a history of sewer surcharge during heavy summer storms, and a backwater valve is the only thing that stops that reversing into your basement. Many insurers now ask about it, and some reduce sewer-backup premiums when one is fitted.',
      },
      {
        q: 'How often should a sump pump be tested?',
        a: 'Twice a year, and always before spring melt. Pour a bucket of water into the pit and confirm the float rises, the pump starts, moves water, and shuts off cleanly. If it hums without pumping, or cycles rapidly, call before the melt rather than during it.',
      },
      {
        q: 'Is there a City of Regina rebate for flood protection?',
        a: 'The City has run a Home Flood Protection Program offering a rebate toward backwater valve and sump pump work, but eligibility, amounts and whether it is currently open change year to year. Verify current terms on the City of Regina website before booking. We provide the itemised documentation these applications require.',
      },
    ],
  },
];

/** Service areas. Each gets its own page with genuinely distinct content —
 *  never a cloned page with the town name swapped (playbook 2). */
export type Area = {
  slug: string;
  name: string;
  /** Minutes from base, used in copy and honest response-time claims. */
  driveMinutes: number;
  answer: string;
  body: string[];
  neighbourhoods?: string[];
};

export const areas: Area[] = [
  {
    slug: 'regina',
    name: 'Regina',
    driveMinutes: 20,
    answer:
      'We serve all of Regina, Saskatchewan, with 24/7 emergency plumbing and typical arrival within 60 to 90 minutes inside city limits. Regina work is dominated by two things: ageing clay sewer lines in the older neighbourhoods, and frozen-pipe damage in January and February.',
    body: [
      'Regina housing stock splits sharply. Cathedral, the Crescents, North Central and Al Ritchie carry a lot of pre-1950 construction — clay sewer laterals, galvanised supply lines nearing the end of their life, and cast iron stacks. Root intrusion and pinhole leaks are the routine calls.',
      'The newer south and east — Harbour Landing, Greens on Gardiner, Eastbrook — is PEX and ABS, so the failures are different: manufacturer defects, poorly supported runs, and sump pumps undersized for lots with a high water table.',
      'City-wide, the constant is cold. A −35 stretch reliably produces a wave of frozen and burst pipes, concentrated in unheated crawlspaces, garages and exterior walls on the north face of the house.',
    ],
    neighbourhoods: [
      'Cathedral', 'The Crescents', 'Lakeview', 'Harbour Landing', 'Albert Park',
      'Whitmore Park', 'North Central', 'Al Ritchie', 'Normanview', 'Eastbrook',
      'Greens on Gardiner', 'Windsor Park', 'Hillsdale', 'Rosemont',
    ],
  },
  {
    slug: 'white-city',
    name: 'White City',
    driveMinutes: 25,
    answer:
      'We serve White City and Emerald Park with full plumbing and heating service, typically arriving within 90 minutes. Most properties here are newer acreage and subdivision builds, so the common work is water treatment, well and pressure systems, and sump pump servicing rather than old-pipe repair.',
    body: [
      'White City and Emerald Park are newer than Regina proper, so we see very little galvanised or clay pipe. What we do see is water quality work — many properties run softeners and treatment systems, and hard water plus a poorly maintained softener puts scale straight through a water heater.',
      'Larger lots also mean longer service runs and, on some acreages, private wells and pressure tanks. Those systems need different diagnostics than a city service connection, and short-cycling pressure tanks are a routine call.',
    ],
  },
  {
    slug: 'pilot-butte',
    name: 'Pilot Butte',
    driveMinutes: 25,
    answer:
      'We serve Pilot Butte for plumbing, heating and emergency call-outs, with typical arrival inside 90 minutes. Work here is a mix of older village properties needing supply-line and sewer repair, and newer builds needing routine service.',
    body: [
      'Pilot Butte has a genuine mix — original village housing alongside newer development. The older properties bring the same issues as Regina\'s core: ageing laterals, undersized supply, and heating systems past their service life.',
      'Being outside the city, winter response depends on Highway 46 conditions. We are straight with people about this: during a blizzard we will tell you the realistic arrival time rather than an optimistic one, so you can decide whether to shut the main and wait.',
    ],
  },
  {
    slug: 'lumsden',
    name: 'Lumsden',
    driveMinutes: 30,
    answer:
      'We serve Lumsden and the Qu\'Appelle Valley with plumbing, heating and flood-protection work. Valley properties face genuine spring flood risk, so sump pump capacity, battery backup and backwater valves are the priority here rather than an optional extra.',
    body: [
      'Lumsden sits in the Qu\'Appelle Valley, and spring melt is a recurring, serious event. Flood protection is not a theoretical upsell for valley properties — it is the difference between a wet spring and a destroyed basement.',
      'For valley clients we push hard on three things: a correctly sized sump pump, battery backup that has been load-tested rather than just installed, and a backwater valve with an accessible cover. We schedule pump testing in February so problems surface before the melt, not during it.',
      'Some valley properties run holding tanks or private septic. Those need different servicing intervals than a municipal connection, and we will set a realistic schedule rather than a generic one.',
    ],
  },
  {
    slug: 'balgonie',
    name: 'Balgonie',
    driveMinutes: 30,
    answer:
      'We serve Balgonie for plumbing, heating and emergency work, typically arriving within 90 minutes via Highway 1. Common calls are furnace service, water heater replacement, and sump pump work on newer subdivision builds.',
    body: [
      'Balgonie is a straightforward run east on Highway 1, so response times are reliable outside of winter weather events. The housing is largely newer subdivision construction with some older town properties.',
      'The seasonal pattern is predictable: furnace and no-heat calls from November, water heater failures clustered in the coldest weeks when incoming water is at its coldest and tanks work hardest, and sump pump calls in March and April.',
    ],
  },
];

/** Site-wide FAQs — the ones asked before someone picks a trade, as opposed
 *  to the service-specific ones attached to each service above. */
export const generalFaqs = [
  {
    q: 'Are you licensed and insured?',
    a: `Yes. ${client.name} holds Saskatchewan journeyman plumber licence ${client.licenceNumber}, carries ${client.insurance}, and maintains WCB coverage under account ${client.wcbNumber}. We will show you all three on request, and you should ask any contractor for them before work starts.`,
  },
  {
    q: 'Do you offer 24/7 emergency service?',
    a: 'Yes, genuinely 24/7 — a person answers, not a voicemail box. After-hours call-out is a flat rate quoted on the phone before we dispatch, and it is credited against the repair if you approve the work.',
  },
  {
    q: 'How do you price work?',
    a: 'Flat rate, quoted in writing before we start. You approve a number, not an hourly meter, so a job that takes longer than expected is our problem rather than yours. If we open something up and find a genuinely different job underneath, we stop and re-quote before continuing.',
  },
  {
    q: 'What areas do you serve?',
    a: `Regina and roughly ${client.serviceRadiusKm} km around it — including ${areas.filter(a => a.slug !== 'regina').map(a => a.name).join(', ')}. If you are outside that, call anyway; we will tell you honestly whether we can get there in a useful timeframe.`,
  },
  {
    q: 'Do you provide free estimates?',
    a: 'For planned work — a renovation rough-in, a water heater replacement, a backwater valve — yes, the estimate is free. For diagnostic call-outs, where the work is finding out what is wrong, there is a call-out charge that gets credited against the repair.',
  },
  {
    q: 'Do you guarantee your work?',
    a: 'Labour is warrantied for two years, and parts carry the manufacturer warranty, which we register for you. If something we installed fails inside that window, we come back and fix it at no charge.',
  },
];

/** Reviews. MUST match what is visible on the page — marking up reviews that
 *  are not displayed triggers a Google manual action (playbook 2). */
export const reviews = [
  {
    author: 'Marta K.',
    rating: 5,
    date: '2026-03-14',
    area: 'Cathedral, Regina',
    body: 'Sample review text for the demo build. On a live site this must be the genuine review copied from Google Business Profile, unedited — never written in-house.',
  },
  {
    author: 'Dev P.',
    rating: 5,
    date: '2026-02-02',
    area: 'Harbour Landing, Regina',
    body: 'Sample review text for the demo build. Replace with a real Google review before launch.',
  },
  {
    author: 'Susan R.',
    rating: 5,
    date: '2026-01-19',
    area: 'White City',
    body: 'Sample review text for the demo build. Replace with a real Google review before launch.',
  },
];

/** Aggregate rating. Set from the real GBP figures, or set to null — an
 *  invented rating is both a Google policy violation and a lie. */
export const aggregateRating: { value: number; count: number } | null = null;

export const process = [
  {
    n: '01',
    title: 'Call or request a quote',
    body: 'A person answers, day or night. Tell us what is happening and we will tell you whether it is an emergency, something that can wait until morning, or something you can fix yourself in ten minutes.',
  },
  {
    n: '02',
    title: 'Fixed price, in writing',
    body: 'We diagnose on site and give you a flat rate before any work begins. You approve a number, not an hourly rate. No work starts until you say yes.',
  },
  {
    n: '03',
    title: 'Fixed, tested, cleaned up',
    body: 'We complete the repair, pressure-test it, show you what was wrong and what we did, and take our mess with us. You get photos and the warranty registered.',
  },
];
