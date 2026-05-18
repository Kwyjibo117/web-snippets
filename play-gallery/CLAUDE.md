# play-gallery

Masonry-Gallery für die Play-Seite auf [bernd-marbach.de](https://bernd-marbach.de). Teil des `web-snippets`-Repos — Custom-Code-Snippets für WordPress/Semplice, ohne Build-Tools oder Dependencies.

## Einbau

Semplice → Custom Code / HTML-Modul auf der Play-Seite. Per Copy-Paste direkt ins CMS.

## Dateien

- `play-gallery.html` — Produktions-Snippet: `<style>`, Markup, `<script>`. Kein Build-Step.
- `dev.html` — Entwicklungs-Version mit Dev-Panel (Slider für alle Settings, live preview, Copy-Button).

## Konventionen

- **Vanilla JS, kein ES6+** — `var`, `function`, `forEach`. Kein `const`/`let`, keine Arrow-Functions. Muss direkt im Browser laufen, ohne Transpiler.
- **CSS column-count Masonry** — kein JS-Layout. Breakpoints: 5 → 4 → 3 Spalten.
- **Random seed bei jedem Laden** — `seed = Math.floor(Math.random() * 233280)`, plus Fisher-Yates-Shuffle der Bild-Reihenfolge. Layout und Reihenfolge ändern sich bei jedem Reload (gewünscht).
- **Einheiten** — Layout/Abstände in `vw`, Parallax-Stärke in `px`.

## Desktop vs. Mobile — `lc`-Config

Direkt nach dem Shuffle wird ein `lc`-Objekt gesetzt das Desktop- und Mobile-Werte (≤ 768px) trennt:

```js
var lc = isMobile ? {
  paddingX:   '2vw',
  scaleMult:  0.95,
  shiftX:     20,    // ± %
  shiftY:     5,     // ± vw
  boostCap:   1.4
} : {
  paddingX:   '19vw',
  scaleMult:  1.25,
  shiftX:     10,    // ± %
  shiftY:     6,     // ± vw
  boostCap:   1.8
};
```

`wrap.style.padding` wird auf `(lc.shiftY + 4)vw lc.paddingX` gesetzt, damit negatives `top` nie an `overflow:hidden` abgeschnitten wird.

## Stellschrauben

| Was | Wo |
|---|---|
| Bilder | `images`-Array oben im `<script>` |
| Spaltenanzahl | `column-count` im CSS + Media Queries |
| Globale Größe | `lc.scaleMult` (× des 100–120%-Range) |
| Horizontaler Versatz | `lc.shiftX` (± %, Overflow wird mittig verteilt) |
| Vertikaler Versatz | `lc.shiftY` (± vw, via `position:relative; top`) |
| Querformat-Boost | `lc.boostCap` (Faktor gedeckelt) |
| Seitlicher Rand | `lc.paddingX` (vw, zieht Gallery zur Mitte) |
| Parallax-Stärke | `dataset.mouse`-Range (15–60 px) |
| Parallax-Trägheit | Lerp-Faktor `0.08` im `loop()` |

## Overflow-Zentrierung

Items werden mit `position:relative; top` vertikal versetzt (kein Flow-Einfluss). Für horizontale Verschiebung gilt:

```
marginLeft = shiftX - (rawWidth - 100) / 2
```

Die Hälfte der Überbreite wird links abgezogen → Overflow gleichmäßig auf beide Seiten. Wird nach dem Querformat-Boost neu berechnet (gespeichert in `item.dataset.shiftX`).

## Fade-In

Kein Lazy Loading. Items starten mit `opacity:0`. Im `img load`-Handler wird `opacity:1` mit einem zufälligen `transitionDelay` (0–500ms) gesetzt — Items erscheinen erst wenn ihr Bild wirklich geladen ist, kein leeres Grau.

## Lightbox

Klick auf ein Bild öffnet eine Lightbox mit FLIP-Animation (First–Last–Invert–Play via `getBoundingClientRect`). Backdrop-Blur + dunkles Overlay. Schließen per Klick oder Escape. Scroll-Lock via `document.documentElement.style.overflow = 'hidden'` (Semplice scrollt am `<html>`-Element).

## Parallax

- **Desktop:** `mousemove` → `targetX/Y`
- **Mobile:** `touchmove` → `targetX/Y`, `touchend` → reset auf 0 (smooth lerp zurück zur Mitte)
- **Ease-in:** `parallaxStrength` startet bei 0, lerpt via `0.03`-Faktor auf 1 beim ersten Maus/Touch-Input → kein Sprung
- **Loop:** `mouseX/Y` lerpt via `0.08` zu `targetX/Y` → Trägheit

## Querformat-Logik

Nach `img load` wird das natürliche Seitenverhältnis gemessen. Querformate (ratio > 1) bekommen einen Breiten-Boost (gedeckelt bei `lc.boostCap`) für mehr visuelle Präsenz. `marginLeft` wird danach neu berechnet.

## Dev-Panel (`dev.html`)

Slider für alle 11 Settings, live preview (120ms debounce, gleiche Bild-Reihenfolge). "Shuffle"-Button für neues Random-Layout. "Copy"-Button schreibt lesbare Config in die Zwischenablage.

## Bild-URLs sammeln

Helper-Snippet in `../helpers/dev-extract-image-urls.js` — in der Browser-DevTools-Console ausführen. Kopiert fertiges JS-Array in die Zwischenablage.
