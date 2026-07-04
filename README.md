# Bernd Marbach — Website Snippets

Custom-Code-Snippets für meine Portfolio-Website [bernd-marbach.de](https://www.bernd-marbach.de).

## Stack

- **WordPress** als CMS
- **Semplice** als Theme/Page-Builder
- Vimeo (Hosting für Showreel/Featured Videos)
- Selbst-gehostete MP4s (für Background-Videos in Projektseiten)

Alle Snippets hier sind reines HTML/CSS/JS und werden über Semplices Custom-Code-Bereiche eingebunden — keine Plugins, keine Build-Tools, keine externen Dependencies (außer Vimeos Player SDK, das per CDN geladen wird).

## Struktur

```
web-snippets/
├── README.md
├── vimeo-player/
│   └── vimeo-player.html          # Custom Vimeo Player mit Custom Controls
├── semplice-video-loop/
│   └── semplice-video-loop.html   # Loop-Fix für self-hosted Semplice-Videos
├── play-gallery/
│   ├── play-gallery.html          # Masonry-Gallery mit Parallax + Lightbox
│   └── dev.html                   # Dev-Version mit Settings-Panel
├── nav-fix/
│   └── semplice-nav-fix.css       # Navbar-Flacker-Fix
└── helpers/
    └── dev-extract-image-urls.js  # DevTools-Snippet zum Bild-URL-Sammeln
```

## Übersicht

### 1. Vimeo Custom Player (`vimeo-player/`)

Custom-Player für Vimeo-Videos mit eigenem Thumbnail-Overlay, minimalen Custom Controls (Progressbar mit Drag-Scrubbing + Fullscreen-Button), Auto-Hide bei Inaktivität und Loop-Funktion. Auf Mobile wird automatisch auf Vimeos eigene Controls umgeschaltet, damit Sound und Fullscreen nativ funktionieren. Lädt das Vimeo-SDK nicht (Adblocker, Netzfehler), fällt der Player automatisch auf Vimeos native Controls zurück. Mehrere Player pro Seite sind möglich — das Snippet einfach mehrfach einfügen, das SDK wird nur einmal geladen.

**Wo einbauen:** Auf Projektseiten als Custom Code / HTML-Modul.

**Anpassen:** Die Vimeo-Video-ID im `data-vp-id`-Attribut am `<div class="vp">` austauschen. Vimeos eigenes Thumbnail wird automatisch geladen — falls's nicht passt, im Vimeo-Dashboard unter Settings → Thumbnail anpassen.

### 2. Semplice Video Loop Fix (`semplice-video-loop/`)

Verhindert, dass selbst-gehostete Videos in Semplice beim Klick pausieren und einen großen Play-Button einblenden. Stattdessen laufen sie wie animierte Bilder im Loop. Optional können einzelne Videos klickbar als Link funktionieren (z.B. von der Projects-Landing-Page zu einer Projektseite).

**Wo einbauen:** Semplice → Settings → Custom Code → JS/HTML Footer (global für alle Seiten).

**Anpassen:** Per `data-link` Attribut am `.smp-video`-Container im Semplice-Editor (Advanced Settings → Custom Attributes) kann jedes Video eine Ziel-URL bekommen.

### 3. Play-Gallery (`play-gallery/`)

Masonry-Gallery für die Play-Seite mit ~75 Bildern. Bilder behalten ihr natürliches Seitenverhältnis, Querformate werden proportional vergrößert für mehr visuelle Präsenz. Features:

- **Maus-Parallax** (Desktop): Bilder driften entgegen der Mausbewegung mit individuellen Stärken für Tiefen-Effekt. Smooth Ease-in beim ersten Maus-Kontakt.
- **Touch-Parallax** (Mobile): Touch-Position steuert die Drift, beim Loslassen lerpen alle Bilder zurück zur Mitte.
- **Lightbox**: Klick auf Bild öffnet FLIP-Animation in Vollansicht (Backdrop-Blur, Escape/Klick zum Schließen).
- **Separate Desktop/Mobile-Settings**: Rand, Skalierung, Versatz und Boost-Cap unterscheiden sich je nach Bildschirmgröße.
- **Random bei jedem Laden**: Bild-Reihenfolge und Layout-Seed werden bei jedem Seitenaufruf neu gewürfelt.

**Wo einbauen:** Auf der Play-Seite als Custom Code / HTML-Modul (`play-gallery.html`).

**Entwicklung:** `dev.html` öffnen — enthält ein eingeblendetes Settings-Panel mit Live-Slidern für alle Parameter, Shuffle-Button und Copy-Button zum Exportieren gefundener Werte.

**Anpassen:** Bild-URLs im `images`-Array oben im JS eintragen. Mit dem Helper-Snippet aus `helpers/` lassen sich die URLs einer bestehenden Seite schnell extrahieren.

**Stellschrauben (im `lc`-Objekt im JS):**
- `paddingX` → seitlicher Rand in vw (zieht Gallery zur Mitte)
- `scaleMult` → globaler Größen-Multiplikator (auf den 100–120%-Range)
- `shiftX` → horizontale Überschneidung (± %)
- `shiftY` → vertikaler Versatz (± vw)
- `boostCap` → wie stark Querformate vergrößert werden
- `column-count` (CSS) → Bilder pro Reihe

### 4. Navbar-Flacker-Fix (`nav-fix/`)

Behebt ein Flackern der Semplice-Navbar, das auftritt, wenn der untere Rand der Nav genau auf dem oberen Rand eines Videos/Bildes liegt. Ursache war Semplices automatischer Transparenz-Switch zwischen „transparent über Hero" und „solid über Content" — der Trigger-Punkt oszilliert, wenn Nav-Unterkante und Section-Oberkante zusammenfallen. Fix: Nav bekommt einen permanent leicht-deckenden Hintergrund mit Backdrop-Blur.

**Wo einbauen:** Semplice → Settings → Custom Code → CSS, oder WordPress → Design → Customizer → Zusätzliches CSS.

**Anpassen:** Hintergrundfarbe (`rgba(245, 245, 245, 0.92)`) an Site-Hintergrund anpassen.

### 5. Helper: Bild-URLs extrahieren (`helpers/`)

DevTools-Snippet zum schnellen Sammeln aller Bild-URLs einer beliebigen Webseite. Wird in der Browser-Console ausgeführt und kopiert das Ergebnis direkt in die Zwischenablage, formatiert als JS-Array zum direkten Einfügen in die Play-Gallery.

**Nutzung:** Browser DevTools → Console → Code reinkopieren → Enter. Vorher die Seite einmal komplett durchscrollen, damit alle Bilder erfasst werden.

## Einbau in Semplice — Übersicht

| Snippet | Einbau-Ort |
|---|---|
| Vimeo Player | Custom Code Modul auf der jeweiligen Seite |
| Video Loop Fix | Semplice Settings → Custom Code → Footer (global) |
| Play Gallery | Custom Code Modul auf der Play-Seite |
| Nav Fix | Semplice Settings → Custom Code → CSS (global) |
| Bild-URL Helper | Browser DevTools Console (nicht auf Site) |

## Hintergrund / Designentscheidungen

**Warum nicht Plugins?** Semplice-spezifische Plugins gibt's kaum, und WordPress-Plugins sind für so kleine Custom-Komponenten Overkill — bringen meist viel Code, Tracking und Performance-Ballast für sehr wenig Funktionalität. Reines HTML/CSS/JS ist sauberer, schneller und lässt sich versionieren.

**Warum kein Build-Step?** Die Snippets müssen direkt in Semplices Custom-Code-Felder kopierbar sein. Kein React, kein Tailwind, keine NPM-Pakete — alles vanilla, alles selbstständig.

**Warum Random bei jedem Reload?** Früher war der Seed fest (42) für ein identisches Layout bei jedem Reload. Jetzt wird bei jedem Seitenaufruf neu gemischt — die Gallery wirkt lebendig und zeigt dem Wiederkehrenden jedes Mal eine andere Komposition.

**Browser-Support:** Modern Evergreen-Browser (Chrome, Firefox, Safari, Edge in aktuellen Versionen). `backdrop-filter` wird genutzt und ist seit Firefox 103 unterstützt. Mobile-Detection per `pointer: coarse` Media-Query.

## Workflow

Änderungen werden lokal in `dev.html` entwickelt und getestet, dann per Copy-Paste aus `play-gallery.html` in die entsprechenden Semplice-Felder übertragen. Bei größeren Änderungen lohnt sich ein Test auf einer Staging-Subdomain.

## TODO / Ideen

- [ ] Video-Player: Zeit-Anzeige (current/duration) im Control-Bar
- [ ] Performance-Audit der Play-Gallery bei 75+ Bildern auf älteren Geräten
