/*
  DevTools-Helper: alle Bild-URLs einer Seite + Seitenverhältnis kopieren
  =======================================================================
  In Browser DevTools → Console einfügen und ausführen.
  Output: alle <img>-URLs + CSS background-images, dedupliziert,
  direkt in die Zwischenablage kopiert — als Objekte für das
  images-Array der play-gallery:  { src: 'url', ratio: 1.777 }

  Die ratio (Breite/Höhe) wird gebraucht, damit die Gallery den Platz
  vor dem Laden reservieren kann (kein Layout-Sprung) und der
  Querformat-Boost ohne Reflow direkt beim Bauen passiert.

  Wichtig: vor dem Ausführen die Seite komplett bis nach unten
  scrollen, damit lazy-loaded Bilder auch geladen sind.
*/

(async () => {
  const fmtRatio = r => parseFloat(r.toFixed(3));

  const imgs = Array.from(document.images)
    .filter(i => i.naturalWidth > 0)
    .map(i => ({ src: i.src, ratio: fmtRatio(i.naturalWidth / i.naturalHeight) }));

  const bgUrls = Array.from(document.querySelectorAll('*')).map(el => {
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    return m ? m[1] : null;
  }).filter(Boolean);

  // Background-Images nachladen, um die Ratio zu messen
  const seen = new Set(imgs.map(i => i.src));
  for (const url of bgUrls) {
    if (seen.has(url)) continue;
    seen.add(url);
    const entry = await new Promise(resolve => {
      const im = new Image();
      im.onload = () => resolve({ src: url, ratio: fmtRatio(im.naturalWidth / im.naturalHeight) });
      im.onerror = () => resolve(null);
      im.src = url;
    });
    if (entry) imgs.push(entry);
  }

  const unique = [...new Map(imgs.map(i => [i.src, i])).values()];
  copy(unique.map(i => `{ src: '${i.src}', ratio: ${i.ratio} }`).join(',\n'));
  console.log('Kopiert:', unique.length, 'Bilder');
})();
