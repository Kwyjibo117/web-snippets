/*
  DevTools-Helper: alle Bild-URLs einer Seite kopieren
  ====================================================
  In Browser DevTools → Console einfügen und ausführen.
  Output: alle <img>-URLs + CSS background-images, dedupliziert,
  direkt in die Zwischenablage kopiert (Format: 'url1', 'url2', ...)
  
  Wichtig: vor dem Ausführen die Seite komplett bis nach unten
  scrollen, damit lazy-loaded Bilder auch geladen sind.
*/

var imgs = Array.from(document.images).map(i => i.src);
var bgs = Array.from(document.querySelectorAll('*')).map(el => {
  var bg = getComputedStyle(el).backgroundImage;
  var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
  return m ? m[1] : null;
}).filter(Boolean);
var all = [...new Set([...imgs, ...bgs])];
copy(all.map(s => `'${s}'`).join(',\n'));
console.log('Kopiert:', all.length, 'Bilder');