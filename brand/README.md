# Ghosh Designs — Identity Concepts

Three logo directions for Ghosh Designs (design studio). The name is locked as
**"Ghosh Designs"**, title case, in every lockup.

Open `board.html` for the full proof sheet with rationale, palettes, scale ladders
and construction geometry.

## Files

| Path | What it is |
|---|---|
| `marks/seal-mark.svg` | **A — The Seal.** Didone G inside a double-hairline ring. |
| `marks/aperture-mark.svg` | **B — The Aperture.** Monoline circle with one accent cut. |
| `marks/counter-mark.svg` | **C — The Counter.** Heavy grotesk G with a squared counter. |
| `lockups/*.svg` | Horizontal mark + wordmark lockups. |
| `board.html` | Presentation board covering all three. |
| `avatars/*.png` | 1024×1024 dark profile pictures, one per concept. |
| `avatars/build.html` | Source sheet the avatar PNGs are exported from. |

## Profile pictures

`avatars/` holds square 1024×1024 PNGs on each concept's dark ground, sized for
services that crop an avatar to a circle (Google, Slack, GitHub). The mark sits
well inside the inscribed circle, so nothing is shaved by the crop, and each was
checked down to 28 px.

Google will not accept an SVG for a profile photo — upload the PNG. The Seal
avatar uses the **solid variant without the outer rings**; the rings clog at
avatar sizes.

## How the marks are built

Every mark is hand-built vector geometry on a `0 0 100 100` viewBox — no raster,
no traced image. They inherit `currentColor`, so colour is set by the parent:

```html
<span style="color:#0A0A0B">
  <img src="marks/aperture-mark.svg" alt="Ghosh Designs">
</span>
```

The aperture mark takes a second colour through the `--accent` custom property,
falling back to `currentColor` so it still works as a one-colour mark:

```css
.logo { color: #0A0A0B; --accent: #3D5BFF; }
```

All three were checked at 72 / 40 / 24 / 16 px. Concept A needs a solid variant
below 24 px — the outer rings clog. B and C hold as-is.

## Palettes

| Concept | Ground | Ink | Accent |
|---|---|---|---|
| A — Seal | `#EDE9E0` Bone | `#221C16` Espresso | `#7A2028` Oxblood |
| B — Aperture | `#0A0A0B` Ink | `#EFEFEC` Paper | `#3D5BFF` Drafting blue |
| C — Counter | `#DAD7CE` Stone | `#14140F` Ink | *(single ink)* |

## Known limitation — the wordmark

The **marks** are final geometry. The **wordmarks** are still live text set with a
font stack, because the licensed display faces were not available in the build
environment:

- A — PP Editorial New (fallback Canela, Georgia)
- B — Geist (fallback Plus Jakarta Sans)
- C — Clash Display (fallback Plus Jakarta Sans)

Before any production use, open the chosen lockup, set the real face, and
**convert the text to outlines**. Until then the lockup renders differently on any
machine missing that font.

## Next steps once a direction is picked

1. Draw the wordmark as custom outlines rather than set type.
2. Clear-space and minimum-size rules, plus a misuse sheet.
3. Full favicon and app-icon export set.
