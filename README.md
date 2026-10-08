# PMH Heyn – Karriereseite

Recruiting-Landingpage der **PMH Präzisionsmechanik Heyn GmbH**, Pforzheim.
Ausgeschriebene Stellen: **Rund-/Flachschleifer** und **Montage** (m/w/d) –
und ausschließlich diese beiden.

## Inhalt

- `index.html` – die komplette Seite (self-contained, kein Build-Schritt nötig)
- `bilder/` – hier Logo und Fotos ablegen (siehe `bilder/HIER-BILDER-ABLEGEN.txt`)
- `.nojekyll` – sorgt dafür, dass GitHub Pages die Dateien 1:1 ausliefert

## Live schalten (GitHub Pages)

1. Repo-Settings → **Pages** → Source: **Deploy from a branch**, Branch: `main` / `/root`
2. Nach ein paar Minuten unter `https://saviold.github.io/Heyn/` erreichbar

---

## ⚠ Vor Livegang kurz prüfen

Diese Punkte konnte ich aus der Build-Umgebung heraus **nicht** verifizieren,
weil `www.pmh-heyn.de` dort durch die Netzwerk-Policy gesperrt war:

| Was | Wo in `index.html` | Status |
|---|---|---|
| Logo | `bilder/logo.svg` | ✅ eingebunden (weiße Variante, passt auf die dunklen Flächen) |
| Hero-Fotos | `bilder/hero*.jpg` | ✅ eingebunden |
| Markenfarben (`--brand` …) | `:root`-Block, ganz oben | **noch offen** – siehe unten |
| Schriften (`--f-display`, `--f-body`) | `:root`-Block | **noch offen** – Barlow / Inter gesetzt |
| E-Mail-Adresse | `KONTAKT.email` | `info@pmh-heyn.de` – bitte bestätigen |
| Datenschutz-Link | `KONTAKT.datenschutz` | Standardpfad – bitte bestätigen |
| Impressum-Link | `KONTAKT.impressum` | Standardpfad – bitte bestätigen |
| Benefits | `bieten` je Stelle | Stand: nur das, was gesichert ist |

**Zu den Farben:** Das gelieferte Logo ist die reine Negativ-Variante
(`fill:#fff`) und enthält deshalb keine Markenfarbe. Gesetzt ist aktuell
ein Blau (`#0b63a8`), das im selben Farbtonbereich liegt wie das Material
auf den Fotos (gemessen: `#556b86`, H213 – die Seite harmoniert also mit
dem Bildmaterial). Sobald die offiziellen Hexwerte vorliegen: eine Zeile
im `:root`-Block.

Telefonnummer, Anschrift, Gründungsjahr, ISO 9001 und Mitarbeiterzahl sind
aus öffentlichen Quellen verifiziert.

## Bildmaterial

| Datei | Motiv | Einsatz |
|---|---|---|
| `logo.svg` | PMH-Logo, weiß | Topbar, Hero, Footer – automatisch erkannt |
| `hero.jpg` | Spannsystem auf der Messmaschine | Startbild ohne Deeplink |
| `hero-schleifer.jpg` | Präzisionswerkzeug, Nahaufnahme | bei `?stelle=schleifer` |
| `hero-montage.jpg` | Spannsystem auf der Messmaschine | bei `?stelle=montage` |

Die `hero*.jpg` sind aus den gelieferten PNGs erzeugt (JPEG q85, progressiv):
rund 1 MB → 70–83 KB pro Bild, spürbar schneller auf dem Handy. Die
Original-PNGs bleiben als Quellmaterial für die Creatives im Ordner liegen.

### Kontrast im Hero

Der geschwungene Panel-Verlauf endet je nach Viewport vor dem rechten
Textrand. Ohne zusätzlichen Schleier stünde die weiße Schrift teilweise
direkt auf dem hellen Foto – gemessen waren das **1,25:1**. Der Verlauf in
`.hero__media::after` ist deshalb so abgestuft, dass die ganze Textspalte
abgedeckt ist, das Motiv rechts aber sichtbar bleibt.

Nachgemessen (hellster Hintergrundpunkt je Textblock, weiße Schrift):

| | Desktop | Desktop (Schleifer) | Handy |
|---|---|---|---|
| Headline | 10,7:1 | 8,7:1 | 13,2:1 |
| Fließtext | 13,4:1 | 11,9:1 | 12,6:1 |

WCAG AA verlangt 3,0:1 für große und 4,5:1 für normale Schrift – alle Werte
liegen deutlich darüber. Mobil liegt der Schleier bewusst hoch (Lesbarkeit
bei Sonnenlicht); wer dort mehr vom Foto sehen will, senkt die beiden
Alphawerte in `.hero__panel::before` innerhalb `@media(max-width:820px)`.

## CI anpassen

Farben und Schriften stecken **ausschließlich** im `:root`-Block ganz oben in
`index.html`. Dort einmal ändern – die ganze Seite zieht nach, inklusive
Button-Schatten, Fokusringen und Tap-Highlight.

```css
--brand:#0b63a8;      /* Primärfarbe: Buttons, Akzente        */
--brand-dark:#084f87; /* Hover-Zustand                        */
--brand-700:#07548f;  /* Markenton für Text auf Hell          */
--brand-900:#16202b;  /* Anthrazit: Headlines, dunkle Flächen */
--brand-soft:#e7f0f8; /* helle Markenfläche                   */
--on-brand:#ffffff;   /* Textfarbe AUF der Markenfarbe        */
--brand-glow / --brand-tint / --brand-light  /* abgeleitete Töne */
--f-display / --f-body
```

## Stellen pflegen

Beide Stellen stehen in **einer** Config (`var JOBS` im `<script>` am
Seitenende). Sie speist gleichzeitig:

- die Stellenkarten in der Sektion „Offene Stellen"
- die Stellenauswahl im Formular
- **die Screening-Fragen** (jede Stelle hat eigene!)
- den Hero-Text bei `?stelle=…`
- die JobPosting-Structured-Data

```js
{ key:"schleifer", title:"Rund-/Flachschleifer (m/w/d)", kurz:"…", icon:…,
  teaser:"…",            // Einzeiler unter dem Titel im Formular
  hook:"…",              // Hero-Text bei ?stelle=schleifer
  aliase:["schleifer", …],   // weitere Schreibweisen für den Deeplink
  webhook:"https://…",       // eigene Lead-Table-Kachel
  tags:[…], aufgaben:[…], voraussetzungen:[…], profil:[…], bieten:[…],
  fragen:[ … ] }             // Screening-Fragen dieser Stelle
```

Deeplinks aus der Anzeige:
`…/?stelle=schleifer` · `…/?stelle=montage`
Der Stellenauswahl-Schritt entfällt dann, der Hero wird auf die Stelle getextet.

## Vorfilterung (Formular)

Jede Stelle hat **5 Fragen**: erst 3 Pflichtfragen, dann 2 optionale.
Eine Frage pro Schritt.

**Rund-/Flachschleifer**

| # | Frage | Art |
|---|---|---|
| 1 | Erfahrung im Schleifen | Pflicht |
| 2 | Schwerpunkt & CNC (Rundschleifen nur mit CNC) | Pflicht |
| 3 | Deutschkenntnisse (ab B2) | Pflicht |
| 4 | Berufsjahre (ideal 10–15) | optional |
| 5 | Maschinen (Studer / Kellenberger / Okamoto) | optional |

**Montage**

| # | Frage | Art |
|---|---|---|
| 1 | Erfahrung Montage / Komponentenbau / Feinmechanik | Pflicht |
| 2 | Passung zur Tätigkeit (keine Überqualifikation) | Pflicht |
| 3 | Deutschkenntnisse (ab B2) | Pflicht |
| 4 | Technische Zeichnungen | optional |
| 5 | Ausbildung (Industriemechaniker kein Muss) | optional |

**Logik**

- `pflicht:true` + Antwort ohne `ok` → Bewerbung endet **sofort**.
  Freundlicher Abschlusshinweis, **keine** anderen Stellen, **kein** Lead
  an die Lead Table.
- `pflicht:false` + Antwort ohne `ok` → Bewerber kommt normal weiter, die
  Antwort wird übertragen und in `nicht_erfuellt` namentlich markiert.
- Kein Lebenslauf-Upload, keine Dateianhänge.
- Nur berufsbezogene Kriterien – keine Fragen zu Alter, Herkunft,
  Gesundheit, Religion oder Familienstand (AGG).

## Mobile Laufruhe

Beim Schrittwechsel gibt es bewusst **kein** `window.scrollTo`, **kein**
`scrollIntoView`, **kein** `focus()`, keinen Reload und keinen Hash-Sprung.
Der einzige `scrollIntoView` der Seite sitzt auf dem „Jetzt bewerben"-Button
der Stellenkarten – das ist bewusste Navigation, kein Schrittwechsel.

Die Höhe des Formularcontainers ist über `--form-min` / `--form-min-mobile`
fest gesetzt. Die Werte sind **ausgemessen** (höchster Schritt beider Stellen
bei 320 / 360 / 390 / 414 / 430 / 768 … 1440 px, plus Reserve für den
Font-Fallback), damit die Karte auf jedem Schritt exakt gleich hoch bleibt.
Fortschrittsbalken und Weiter-Button sitzen dadurch immer an derselben Stelle.

Nachgemessen im echten Browser (Chromium, 390×844, Touch): **0 px Drift** über
alle 6 Schrittwechsel, 0 px beim Ausfüllen, 0 px beim Absenden, 0 px beim
K.-o.-Abbruch. Karte konstant 610 px und damit vollständig im Viewport.

## Lead Table

Jede Stelle hat ihre **eigene Kachel**:

| Stelle | tableID |
|---|---|
| Rund-/Flachschleifer | `6ac781d1f6571256610d83a1` |
| Montage | `6ac782d36f6ee85f0cec1e5c` |

Payload (flaches JSON, jedes Feld **genau einmal**):

```
vorname, nachname, telefon, email, stelle,
<die 5 Feldnamen der jeweiligen Stelle>,
nicht_erfuellt, datum, datenschutz, quelle, seite
```

`vorname` und `nachname` werden **getrennt** übergeben. Es gibt bewusst
**kein** kombiniertes `name` / `fullname` / `vollstaendiger_name` und kein
Sammelfeld, das einzeln übergebene Werte noch einmal enthält – sonst stünde
der Name in der Lead Table doppelt.

Nur abgeschlossene, qualifizierte Bewerbungen gehen an den Webhook.
K.-o.-Abbrüche werden nicht übertragen.
