/* =====================================================================
   CREATIVE-GENERATOR · PMH Präzisionsmechanik Heyn GmbH
   ---------------------------------------------------------------------
   Rendert alle Meta-Ads-Creatives sowie Facebook-Profil- und -Titelbild
   aus einer Config – im CI der Karriereseite (gleiche Farben, gleiche
   Schriften Barlow/Inter, Original-Logo unveraendert).

     node creatives/build.mjs

   Es wird AUSSCHLIESSLICH das gelieferte Bildmaterial benutzt:
   bilder/_34A2425.JPG, bilder/_34A2508.JPG, bilder/logo.svg

   Neues Format: in FORMATE ergaenzen. Neues Motiv: in MOTIVE ergaenzen.
   ===================================================================== */

import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TMP  = join(HERE, '.render.html');

/* ---------- CI (identisch mit dem :root-Block in index.html) ---------- */
const CI = {
  brand:     '#c8a12a',   // Gold, abgeleitet aus dem Warmton des Logo-Schwarz
  brandDark: '#ad8a1e',
  light:     '#e6cf86',
  ink:       '#1c1a01',   // direkt aus dem Original-Logo ausgelesen
  inkDeep:   '#121107',
  onBrand:   '#1c1a01',
  soft:      '#faf4de'
};

/* ---------- Schriften lokal einbetten (offline identisch) ---------- */
const face = (fam, w, f) =>
  `@font-face{font-family:${fam};font-style:normal;font-weight:${w};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(join(HERE,'fonts',f)).toString('base64')}) format('woff2')}`;
const FONTS = [
  face('Barlow',500,'barlow-500.woff2'), face('Barlow',700,'barlow-700.woff2'),
  face('Barlow',800,'barlow-800.woff2'), face('Barlow',900,'barlow-900.woff2'),
  face('Inter',400,'inter-400.woff2'),   face('Inter',600,'inter-600.woff2'),
  face('Inter',700,'inter-700.woff2')
].join('\n');

/* ---------- Pfade relativ, Originalfotos sind mehrere MB gross ---------- */
const rel = p => existsSync(join(ROOT,p)) ? '../' + p.split('/').map(encodeURIComponent).join('/') : null;
const LOGO  = rel('bilder/logo.svg');
/* Die Bildmarke besteht aus den ersten sechs Pfaden der Original-SVG.
   Sie werden 1:1 uebernommen - kein Nachbau, keine Aenderung. */
const SVG_QUELLE = readFileSync(join(ROOT,'bilder/logo.svg'),'utf8');
const MARKE_PATHS = (SVG_QUELLE.match(/<path class="cls-1"[^>]*\/>/g)||[]).slice(0,6).join('');
const FOTO_WERKSTATT = rel('bilder/_34A2425.JPG');   // Kollege an der Voumard
const FOTO_FUNKEN    = rel('bilder/_34A2508.JPG');   // Funkenflug am Schleifbock
if (!LOGO || !FOTO_WERKSTATT || !FOTO_FUNKEN) {
  console.error('Bildmaterial fehlt in bilder/ – Abbruch.'); process.exit(1);
}

/* ---------- Stellen ---------- */
const STELLEN = {
  schleifer: {
    key:'schleifer', beruf:'Rund-/Flachschleifer', titel:'Rund-/Flachschleifer (m/w/d)',
    koennen:'Rundschleifen an CNC, Flachschleifen konventionell',
    chips:['Keine Schicht','S-Bahn vor der Tür','Unbefristet'],
    huerde:'Mehrjährige Erfahrung an der Schleifmaschine vorausgesetzt.',
    liste:['Mehrjährige Erfahrung im Rund- oder Flachschleifen',
           'Beim Rundschleifen: Erfahrung an CNC-Maschinen',
           'Deutsch auf mindestens B2-Niveau',
           'Studer, Kellenberger, Okamoto von Vorteil'],
    problem:'Schicht, Lärm, Hetze?',
    benefitZeile:'Tagdienst statt Schicht.<br><span class="akzent">Und die S-Bahn hält um die Ecke.</span>',
    lohn:'Maschinen, die gepflegt sind, und Zeit, sauber zu arbeiten.'
  },
  montage: {
    key:'montage', beruf:'Montage', titel:'Mitarbeiter Montage (m/w/d)',
    koennen:'Spannsysteme montieren, einstellen und prüfen',
    chips:['Keine Schicht','S-Bahn vor der Tür','Kein Meister nötig'],
    huerde:'Erfahrung im Zusammenbau vorausgesetzt – Sorgfalt zählt mehr als der Abschluss.',
    liste:['Erfahrung in Montage, Komponentenbau oder Feinmechanik',
           'Sorgfältige, genaue Arbeitsweise',
           'Deutsch auf mindestens B2-Niveau',
           'Ausbildung zum Industriemechaniker kein Muss'],
    problem:'Zu grob? Zu hektisch?',
    benefitZeile:'Sorgfalt zählt hier mehr<br><span class="akzent">als ein hoher Abschluss.</span>',
    lohn:'Baugruppen, bei denen das Hundertstel zählt.'
  }
};

/* ---------- Motive (3 je Stelle, bewusst unterschiedliche Ansaetze) ---------- */
const MOTIVE = {
  /* 1 · Stelle direkt ansprechen */
  stelle: s => ({
    eyebrow:'Festanstellung · Pforzheim',
    head:`${s.beruf}<br>(m/w/d) <span class="akzent">gesucht.</span>`,
    sub:`Präzisionsmechanik seit 1970. ${s.koennen} – ${s.lohn}`,
    chips:s.chips, cta:'In 60 Sekunden bewerben'
  }),
  /* 2 · Qualifizierer: filtert auf Qualitaet statt Masse */
  check: s => ({
    eyebrow:'Passt das zu dir?',
    head:`Du arbeitest in der <span class="akzent">${s.beruf === 'Montage' ? 'Montage' : 'Schleiferei'}</span>?`,
    liste:s.liste, cta:'Dann sollten wir reden'
  }),
  /* 3 · Problem → Loesung */
  benefit: s => ({
    eyebrow:s.problem,
    head:s.benefitZeile,
    sub:`${s.titel} bei PMH in Pforzheim. Rund 30 Kolleginnen und Kollegen, kurze Wege. ${s.huerde}`,
    chips:s.chips, cta:'Jetzt bewerben'
  })
};

/* ---------- Fotozuordnung (nur das gelieferte Material) ----------
   Montage hat kein eigenes Motiv geliefert bekommen – dort wird
   durchgaengig die Werkstattaufnahme benutzt, mit unterschiedlichen
   Ausschnitten, damit die drei Creatives sich unterscheiden.
   Der Funkenflug bleibt der Schleiferei vorbehalten.                */
const FOTO = {
  'schleifer/stelle':  { src:FOTO_FUNKEN,    pos:'62% 42%', zoom:1.06, flip:true  },
  'schleifer/check':   { src:FOTO_WERKSTATT, pos:'70% 38%', zoom:1.10, flip:false },
  'schleifer/benefit': { src:FOTO_FUNKEN,    pos:'34% 52%', zoom:1.38, flip:false },
  /* Fuer die Montage wurde kein eigenes Motiv geliefert. Damit sich die
     drei Creatives trotzdem unterscheiden, sind es drei klar verschiedene
     Ausschnitte derselben Werkstattaufnahme: Kollege, Maschinendetail,
     Totale. */
  'montage/stelle':    { src:FOTO_WERKSTATT, pos:'76% 44%', zoom:1.30, flip:false },
  'montage/check':     { src:FOTO_WERKSTATT, pos:'28% 60%', zoom:1.75, flip:false },
  'montage/benefit':   { src:FOTO_WERKSTATT, pos:'50% 42%', zoom:1.00, flip:false }
};

/* ---------- Formate ---------- */
const FORMATE = {
  '4x5':  { w:1080, h:1350, padTop:80,  padBottom:96,  padX:86, headPx:84, subPx:33 },
  '9x16': { w:1080, h:1920, padTop:300, padBottom:400, padX:86, headPx:94, subPx:35 }
};

/* ---------- Template ---------- */
function html({ motiv, fmt, inhalt, foto }) {
  /* Verlauf: oben nur leicht abgedunkelt (Foto bleibt sichtbar), unten
     fast deckend, damit die Schrift auf jedem Bildpunkt sitzt. */
  const chips = inhalt.chips
    ? `<div class="chips">${inhalt.chips.map(c=>`<span class="chip">${c}</span>`).join('')}</div>` : '';
  const liste = inhalt.liste
    ? `<ul class="liste">${inhalt.liste.map(l=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="${CI.brand}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>${l}</span></li>`).join('')}</ul>` : '';
  const sub = inhalt.sub ? `<p class="sub">${inhalt.sub}</p>` : '';

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${fmt.w}px;height:${fmt.h}px}
body{font-family:Inter,sans-serif;color:#fff;position:relative;overflow:hidden;background:${CI.inkDeep}}
/* Foto als eigene Ebene, damit es gespiegelt werden kann ohne den Text zu kippen */
/* cover + Zoom ueber transform: background-size mit fester Breite liess
   oben und unten Flaeche frei -> harte Kante unter dem Logo. */
.bg{position:absolute;inset:0;background-image:url('${foto.src}');background-size:cover;
  background-position:${foto.pos};background-repeat:no-repeat;
  transform:${foto.flip?'scaleX(-1) ':''}scale(${foto.zoom});transform-origin:center}
/* Grundschleier: nur so viel, dass das Foto Tiefe hat */
.bgfix{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,17,7,.40) 0%,rgba(18,17,7,.30) 24%,rgba(18,17,7,.30) 62%,rgba(18,17,7,.44) 100%)}
.frame{position:absolute;inset:0;display:flex;flex-direction:column;padding:${fmt.padTop}px ${fmt.padX}px ${fmt.padBottom}px}
/* Goldene Kante als wiedererkennbares CI-Element */
.kante{position:absolute;left:0;right:0;bottom:0;height:14px;background:${CI.brand}}
/* Sichert Logo und Claim auf hellen Bildstellen */
.kopfschleier{position:absolute;left:0;right:0;top:0;height:${fmt.padTop + Math.round(fmt.w*0.10) + 80}px;
  background:linear-gradient(180deg,rgba(14,13,5,.90) 0%,rgba(14,13,5,.66) 48%,rgba(14,13,5,0) 100%);pointer-events:none}
.logo-img{height:${Math.round(fmt.w*0.10)}px;width:auto;object-fit:contain;object-position:left;position:relative}
/* Eigener Verlauf am Textblock: er beginnt dort, wo der Text beginnt,
   unabhaengig von der Textmenge. Der Aufblendbereich liegt komplett im
   padding-top, damit schon die Eyebrow auf voller Deckung sitzt. */
.mitte{margin-top:auto;position:relative;margin-left:-${fmt.padX}px;margin-right:-${fmt.padX}px;
  padding:170px ${fmt.padX}px 44px;
  background:linear-gradient(180deg,rgba(18,17,7,0) 0%,rgba(18,17,7,.70) 46%,rgba(18,17,7,.93) 82%,rgba(18,17,7,.96) 100%),
             linear-gradient(180deg,rgba(18,17,7,0) 0%,rgba(18,17,7,0) 30%,rgba(18,17,7,.55) 62%,rgba(18,17,7,.72) 100%)}
/* Eyebrow als dunkles Pill: Gold hat Luminanz .36 und braucht als kleine
   Schrift einen nahezu schwarzen Untergrund – den gibt ein Foto nicht her.
   Das Pill bringt ihn mit, unabhaengig vom Motiv. */
.eyebrow{display:inline-flex;align-items:center;gap:13px;font-family:Barlow;font-weight:800;font-size:25px;
  letter-spacing:.09em;text-transform:uppercase;color:${CI.brand};margin-bottom:28px;
  background:rgba(14,13,5,.95);border:2px solid rgba(200,161,42,.42);
  padding:12px 24px 12px 20px;border-radius:999px}
.eyebrow .dot{width:14px;height:14px;border-radius:50%;background:${CI.brand};box-shadow:0 0 0 7px rgba(200,161,42,.26)}
h1{font-family:Barlow;font-weight:900;font-size:${fmt.headPx}px;line-height:1.04;letter-spacing:-.02em;
  text-shadow:0 4px 30px rgba(0,0,0,.5)}
h1 .akzent{color:${CI.brand}}
.sub{margin-top:26px;font-weight:400;font-size:${fmt.subPx}px;line-height:1.45;color:#e8e5db;max-width:93%;
  text-shadow:0 2px 18px rgba(0,0,0,.55)}
.liste{list-style:none;margin-top:34px;display:grid;gap:19px}
.liste li{display:flex;align-items:flex-start;gap:17px;font-weight:600;font-size:${fmt.subPx+1}px;line-height:1.32;
  text-shadow:0 2px 18px rgba(0,0,0,.55)}
.liste svg{width:${fmt.subPx+6}px;height:${fmt.subPx+6}px;flex:0 0 auto;margin-top:2px}
.chips{display:flex;flex-wrap:wrap;gap:13px;margin-top:34px}
.chip{font-family:Barlow;font-weight:700;font-size:27px;padding:13px 24px;border-radius:999px;
  background:rgba(200,161,42,.16);border:2px solid rgba(200,161,42,.58);color:${CI.soft}}
.cta{display:inline-flex;align-items:center;gap:16px;align-self:flex-start;margin-top:40px;
  background:${CI.brand};color:${CI.onBrand};font-family:Barlow;font-weight:900;font-size:36px;
  padding:26px 44px;border-radius:16px;box-shadow:0 16px 44px rgba(0,0,0,.45)}
.cta svg{width:34px;height:34px;stroke:${CI.onBrand}}
.fuss{margin-top:26px;font-weight:600;font-size:24px;color:#b4b0a3;letter-spacing:.04em}
</style></head><body>
<div class="bg"></div><div class="bgfix"></div>
<div class="kopfschleier"></div>
<div class="frame">
  <img class="logo-img" src="${LOGO}" alt="" />
  <div class="mitte">
    <div class="eyebrow"><span class="dot"></span>${inhalt.eyebrow}</div>
    <h1>${inhalt.head}</h1>
    ${sub}${liste}${chips}
    <div class="cta">${inhalt.cta}
      <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
    <div class="fuss">pmh-heyn.de · Pforzheim</div>
  </div>
</div>
<div class="kante"></div>
</body></html>`;
}

/* ---------- Facebook-Profilbild 1080x1080 ----------
   Logo mittig, grosszuegiger Rand: Facebook beschneidet rund.
   Variante A: das vollstaendige Logo, unveraendert.
   Variante B: nur die Bildmarke desselben Logos (gleiche Datei, nur ein
   anderer Ausschnitt der viewBox - nicht nachgebaut, nicht eingefaerbt,
   nicht verzerrt). Im Feed wird das Profilbild oft mit 40 px angezeigt;
   die Wortmarke ist dann unlesbar, die Bildmarke bleibt erkennbar. */
function htmlProfil(nurMarke){
  const grafik = nurMarke
    ? `<svg viewBox="52 186 168 188" width="620" height="694" xmlns="http://www.w3.org/2000/svg">
         <image href="${LOGO}" x="45" y="180" width="761.89" height="235.28"
                preserveAspectRatio="xMinYMin meet" style="display:none"/>
         ${MARKE_PATHS}
       </svg>`
    : `<img src="${LOGO}" alt="" style="width:100%;height:auto;display:block" />`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px}
body{background:${CI.ink};display:grid;place-items:center;position:relative;overflow:hidden}
/* dezenter Verlauf, damit die Flaeche nicht tot wirkt */
.glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 44%,rgba(200,161,42,.16) 0%,rgba(200,161,42,0) 64%)}
/* Alles Wichtige liegt weit innerhalb des runden Zuschnitts */
.logo{position:relative;width:${nurMarke?'auto':'660px'};display:grid;place-items:center}
.logo svg{width:430px;height:auto;display:block;fill:#fff}
</style></head><body><div class="glow"></div>
<div class="logo">${grafik}</div></body></html>`;
}

/* ---------- Facebook-Titelbild 1640x856 ----------
   Wichtiges in der mittigen Sicherheitszone 1092x616, unten rechts frei. */
function htmlTitel(){
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1640px;height:856px}
body{position:relative;overflow:hidden;background:${CI.inkDeep};font-family:Inter,sans-serif;color:#fff}
.bg{position:absolute;inset:0;background-image:url('${FOTO_WERKSTATT}');background-size:118% auto;background-position:70% 40%}
.scrim{position:absolute;inset:0;background:linear-gradient(100deg,rgba(18,17,7,.95) 0%,rgba(18,17,7,.92) 38%,rgba(18,17,7,.72) 58%,rgba(18,17,7,.42) 100%)}
/* Sicherheitszone 1092x616 mittig */
.safe{position:absolute;left:${(1640-1092)/2}px;top:${(856-616)/2}px;width:1092px;height:616px;
  display:flex;flex-direction:column;justify-content:center}
.logo{height:118px;width:auto;object-fit:contain;object-position:left;margin-bottom:34px}
h1{font-family:Barlow;font-weight:900;font-size:60px;line-height:1.06;letter-spacing:-.02em;max-width:720px;
  text-shadow:0 4px 26px rgba(0,0,0,.5)}
h1 .akzent{color:${CI.brand}}
p{margin-top:20px;font-size:27px;font-weight:400;color:#e4e1d6;max-width:640px;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.chips{display:flex;gap:12px;margin-top:28px}
.chip{font-family:Barlow;font-weight:700;font-size:24px;padding:11px 21px;border-radius:999px;
  background:rgba(200,161,42,.16);border:2px solid rgba(200,161,42,.58);color:${CI.soft}}
.kante{position:absolute;left:0;right:0;bottom:0;height:12px;background:${CI.brand}}
</style></head><body>
<div class="bg"></div><div class="scrim"></div>
<div class="safe">
  <img class="logo" src="${LOGO}" alt="" />
  <h1>Präzision aus Pforzheim.<br><span class="akzent">Seit 1970.</span></h1>
  <p>Spann- und Schleiftechnik – entwickelt und gefertigt im eigenen Haus.</p>
  <div class="chips"><span class="chip">ISO 9001</span><span class="chip">Rund 30 Mitarbeitende</span><span class="chip">Wir stellen ein</span></div>
</div>
<div class="kante"></div>
</body></html>`;
}

/* ---------- Rendern ---------- */
const browser = await chromium.launch();
/* MEASURE=1 rendert zusaetzlich eine Fassung ohne Text und schreibt die
   Positionen der Textelemente – damit laesst sich der Kontrast hinter der
   Schrift nachmessen statt schaetzen. */
const MEASURE = !!process.env.MEASURE;
const MDIR = join(HERE,'.measure');
if (MEASURE) mkdirSync(MDIR,{recursive:true});
const messungen = [];

async function shot(markup, w, h, datei){
  writeFileSync(TMP, markup);
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('file://'+TMP);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(HERE,datei) });
  if (MEASURE){
    const boxen = await page.evaluate(()=>{
      const sel={eyebrow:'.eyebrow',head:'h1',sub:'.sub,p',liste:'.liste',chips:'.chips',cta:'.cta',fuss:'.fuss',logo:'.logo-img,.logo'};
      const o={};
      for (const k in sel){ const e=document.querySelector(sel[k]);
        if(e){const r=e.getBoundingClientRect(); o[k]=[Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}}
      return o;
    });
    await page.evaluate(()=>{
      document.querySelectorAll('.mitte > *, .safe > *, .logo-img, .logo img').forEach(e=>e.style.visibility='hidden');
    });
    await page.waitForTimeout(150);
    const bg = datei.replace('.png','-bg.png');
    await page.screenshot({ path: join(MDIR,bg) });
    messungen.push({ datei, bg, boxen });
  }
  await ctx.close();
  console.log('  ' + datei);
}

console.log('Creatives:');
for (const [sKey,s] of Object.entries(STELLEN)){
  for (const [mKey,mFn] of Object.entries(MOTIVE)){
    const inhalt = mFn(s);
    const foto = FOTO[`${sKey}/${mKey}`];
    for (const [fKey,fmt] of Object.entries(FORMATE)){
      await shot(html({motiv:mKey,fmt,inhalt,foto}), fmt.w, fmt.h, `${sKey}-${mKey}-${fKey}.png`);
    }
  }
}
console.log('Facebook:');
await shot(htmlProfil(false), 1080, 1080, 'facebook-profilbild.png');
await shot(htmlProfil(true),  1080, 1080, 'facebook-profilbild-bildmarke.png');
await shot(htmlTitel(), 1640, 856,  'facebook-titelbild.png');

await browser.close();
rmSync(TMP,{force:true});
if (MEASURE) writeFileSync(join(MDIR,'boxen.json'), JSON.stringify(messungen,null,1));
console.log('\nFertig.');
