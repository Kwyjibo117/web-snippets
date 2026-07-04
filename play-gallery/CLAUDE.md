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
- **`images`-Array enthält Objekte** — `{ src: 'url', ratio: 1.777 }`. Die ratio (Breite/Höhe) ist eingebakt, damit der Platz vor dem Laden reserviert wird (`img.width/height`-Attribute) und der Querformat-Boost ohne Reflow beim Bauen passiert. Neue Bilder mit dem Helper-Snippet erfassen (liefert ratio mit).

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
| Bilder | `images`-Array oben im `<script>` (`{ src, ratio }`-Objekte) |
| Spaltenanzahl | `column-count` im CSS + Media Queries |
| Globale Größe | `lc.scaleMult` (× des 100–120%-Range) |
| Horizontaler Versatz | `lc.shiftX` (± %, Overflow wird mittig verteilt) |
| Vertikaler Versatz | `lc.shiftY` (± vw, via `position:relative; top`) |
| Querformat-Boost | `lc.boostCap` (Faktor gedeckelt) |
| Seitlicher Rand | `lc.paddingX` (vw, zieht Gallery zur Mitte) |
| Parallax-Stärke | `strength`-Range im `items.push` (15–60 px) |
| Parallax-Trägheit | Lerp-Faktor `0.08` im `loop()` |

## Overflow-Zentrierung

Items werden mit `position:relative; top` vertikal versetzt (kein Flow-Einfluss). Für horizontale Verschiebung gilt:

```
marginLeft = shiftX - (rawWidth - 100) / 2
```

Die Hälfte der Überbreite wird links abgezogen → Overflow gleichmäßig auf beide Seiten. `rawWidth` enthält den Querformat-Boost bereits (passiert beim Bauen, vor dieser Rechnung).

## Fade-In & Laden

`img.width/height` werden aus der eingebakten `ratio` gesetzt → der Browser reserviert den Platz vor dem Laden, das Masonry-Layout steht sofort final (keine Sprünge beim Nachladen). Dadurch funktioniert `loading="lazy"` korrekt: nur Bilder nahe dem Viewport werden geladen statt aller ~80 auf einmal (wichtig in Semplice). Zusätzlich `decoding="async"`.

Items starten mit `opacity:0`. Im `img load`-Handler wird `opacity:1` mit einem zufälligen `transitionDelay` (0–500ms) gesetzt — Items erscheinen erst wenn ihr Bild wirklich geladen ist, kein leeres Grau.

## Lightbox

Klick auf ein Bild öffnet eine Lightbox mit FLIP-Animation (First–Last–Invert–Play via `getBoundingClientRect`). Backdrop-Blur + dunkles Overlay. Schließen per Klick oder Escape. Scroll-Lock via `document.documentElement.style.overflow = 'hidden'` (Semplice scrollt am `<html>`-Element).

## Parallax

- **Desktop:** `mousemove` im Capture-Mode (`document.addEventListener('mousemove', fn, true)`) → `targetX/Y`. Capture-Phase ist wichtig: Semplice-Overlays rufen auf anderen Sections `stopPropagation` auf und würden den Event sonst schlucken, was zu Einfrieren und Ruckeln beim Zurückkehren zur Gallery führt.
- **mouseleave** auf `document` → reset `targetX/Y` auf 0 → smooth lerp zurück zur Mitte wenn Cursor Browser-Chrome verlässt
- **Mobile:** `touchmove` → `targetX/Y`, `touchend` → reset auf 0 (smooth lerp zurück zur Mitte)
- **Ease-in:** `parallaxStrength` startet bei 0, lerpt via `0.03`-Faktor auf 1 beim ersten Maus/Touch-Input → kein Sprung
- **Loop:** `mouseX/Y` lerpt via `0.08` zu `targetX/Y` → Trägheit
- **Idle-Skip:** Wenn `mouseX/Y` nah genug an `targetX/Y` (`settled`-Flag), keine Style-Writes mehr — der rAF-Loop läuft leer weiter. Wichtig in Semplice, wo sonst 80 Transform-Writes pro Frame mit den restlichen Seiten-Scripts konkurrieren.
- **IntersectionObserver:** Nur Items im Viewport (+200px `rootMargin`) bekommen Transform-Updates (`visible`-Flag pro Item, Fallback ohne IO: alle sichtbar). Beim Sichtbarwerden wird einmal `applyTransform` aufgerufen, damit kein veralteter Transform stehen bleibt.

## Querformat-Logik

Querformate (`ratio > 1`) bekommen beim Bauen einen Breiten-Boost (gedeckelt bei `lc.boostCap`) für mehr visuelle Präsenz — die ratio kommt aus dem `images`-Array, kein Messen nach `img load`, kein Reflow.

## Dev-Panel (`dev.html`)

Slider für alle 11 Settings, live preview (120ms debounce, gleiche Bild-Reihenfolge). "Shuffle"-Button für neues Random-Layout. "Copy"-Button schreibt lesbare Config in die Zwischenablage.

## Bild-URLs sammeln

Helper-Snippet in `../helpers/dev-extract-image-urls.js` — in der Browser-DevTools-Console ausführen. Kopiert fertige `{ src, ratio }`-Objekte für das `images`-Array in die Zwischenablage (misst `naturalWidth/Height`).
