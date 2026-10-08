# PMH Heyn – Karriereseite

Recruiting-Landingpage der **PMH Präzisionsmechanik Heyn GmbH**, Pforzheim.
Ausgeschriebene Stellen: **Rund-/Flachschleifer** und **Montage** (m/w/d) –
und ausschließlich diese beiden.

## Inhalt

- `index.html` – die komplette Seite (self-contained, kein Build-Schritt nötig)
- `bilder/` – Logo, Originalfotos und die daraus erzeugten Hero-Bilder
- `.nojekyll` – sorgt dafür, dass GitHub Pages die Dateien 1:1 ausliefert

## Live schalten (GitHub Pages)

1. Repo-Settings → **Pages** → Source: **Deploy from a branch**, Branch: `main` / `/root`
2. Nach ein paar Minuten unter `https://saviold.github.io/Heyn/` erreichbar

---

## ⚠ Vor Livegang kurz prüfen

| Was | Wo | Status |
|---|---|---|
| Logo | `bilder/logo.svg` | ✅ eingebunden |
| Fotos | `bilder/hero*.jpg` | ✅ eingebunden |
| Markenfarben | `:root` in `index.html` | ✅ aus dem Original-Logo ausgelesen |
| Akzentfarbe (Gold) | `--brand` | **abgeleitet** – siehe unten |
| Schriften | `--f-display`, `--f-body` | **gesetzt**, nicht von der Website übernommen |
| E-Mail-Adresse | `KONTAKT.email` | `info@pmh-heyn.de` – bitte bestätigen |
| Datenschutz-Link | `KONTAKT.datenschutz` | Standardpfad – bitte bestätigen |
| Impressum-Link | `KONTAKT.impressum` | Standardpfad – bitte bestätigen |
| Benefits | `bieten` je Stelle | Stand: nur das, was gesichert ist |

Telefonnummer, Anschrift, Gründungsjahr, ISO 9001 und Mitarbeiterzahl sind
aus öffentlichen Quellen verifiziert. `www.pmh-heyn.de` war aus der
Build-Umgebung heraus nicht erreichbar (Netzwerk-Policy), deshalb stammen
Farben und Schriften nicht von der Website.

## CI

Farben und Schriften stecken **ausschließlich** im `:root`-Block ganz oben in
`index.html`. Dort einmal ändern – die ganze Seite zieht nach, inklusive
Button-Schatten, Fokusringen und Tap-Highlight.

```css
--brand:#c8a12a;      /* Akzent: Buttons, Marker, Fortschritt  */
--brand-dark:#ad8a1e; /* Hover-Zustand                         */
--brand-700:#756013;  /* Markenton für Text und Icons auf Hell */
--brand-900:#1c1a01;  /* Logo-Schwarz: Headlines, dunkle Flächen */
--brand-soft:#faf4de; /* helle Markenfläche                    */
--on-brand:#1c1a01;   /* Textfarbe AUF Gold (Kontrast!)        */
--brand-glow / --brand-tint / --brand-light   /* abgeleitete Töne */
--f-display:"Barlow"  --f-body:"Inter"
```

**Woher die Farben kommen:** `bilder/pmh_Logo.pdf` wurde mit 300 dpi
gerendert und ausgemessen. Bildmarke und „pmh" stehen in **`#1c1a01`**
(warmes Schwarz), die Unterzeile in `#231f20`. Das Logo ist damit
**einfarbig – es enthält keine Akzentfarbe**. Für Buttons, Fortschrittsbalken
und Markierungen braucht die Seite aber einen Akzent. Gesetzt ist deshalb
ein Gold (`#c8a12a`) im selben Warmton wie das Logo-Schwarz, nur hell genug
für Bedienelemente. Liegt die offizielle Akzentfarbe vor, ist das eine Zeile.

Alle Farbpaare sind gegen WCAG AA geprüft (kleinster Wert 4,72:1 bei
gedämpftem Text auf heller Markenfläche, Grenze 4,5:1).

## Bildmaterial

| Datei | Motiv | Einsatz |
|---|---|---|
| `logo.svg` | PMH-Logo, weiß | Topbar, Hero, Footer – automatisch erkannt |
| `pmh_Logo.pdf` | Original-Logo, vektoriell | Quelle für Farben und Creatives |
| `_34A2425.JPG` | Kollege im PMH-Shirt an der Voumard-Rundschleifmaschine | Quelle |
| `_34A2508.JPG` | Funkenflug am Schleifbock | Quelle |
| `hero.jpg` | aus `_34A2425` | Startbild ohne Deeplink |
| `hero-montage.jpg` | aus `_34A2425` | bei `?stelle=montage` |
| `hero-schleifer.jpg` | aus `_34A2508`, **gespiegelt** | bei `?stelle=schleifer` |

Die `hero*.jpg` sind 1920 px breit, JPEG q82, progressiv – rund 6 MB
Originaldatei → 244–284 KB. `hero-schleifer.jpg` ist bewusst gespiegelt:
im Original liegt der Funkenflug links, also genau hinter dem dunklen
Textpanel. Gespiegelt fällt er in die sichtbare rechte Hälfte.

### Logo austauschen

Die Seite sucht der Reihe nach:
`pmh-heyn-logo-weiss.png` → `logo-weiss.png` → `pmh-heyn-logo.png` →
`logo.png` → `logo.svg`. Die erste gefundene Datei gewinnt und ersetzt den
Schriftzug-Fallback. Topbar, Hero und Footer sind dunkel – es wird die
**weiße** Variante gebraucht.

### Kontrast im Hero

Der geschwungene Panel-Verlauf endet je nach Viewport vor dem rechten
Textrand. Ohne zusätzlichen Schleier stünde die weiße Schrift teilweise
direkt auf dem hellen Foto – gemessen waren das **1,25:1**. Der Verlauf in
`.hero__media::after` ist deshalb so abgestuft, dass die ganze Textspalte
abgedeckt ist, das Motiv rechts aber sichtbar bleibt.

Nachgemessen (hellster Hintergrundpunkt je Textblock, weiße Schrift):

| | Desktop | Desktop (Schleifer) | Handy |
|---|---|---|---|
| Headline | 9,4:1 | 9,5:1 | 12,9:1 |
| Fließtext | 12,1:1 | 13,1:1 | 13,3:1 |

WCAG AA verlangt 3,0:1 für große und 4,5:1 für normale Schrift.

## Stellen pflegen

Beide Stellen stehen in **einer** Config (`var JOBS` im `<script>` am
Seitenende). Sie speist gleichzeitig:

- die Stellenkarten in der Sektion „Offene Stellen"
- die Stellenauswahl im Formular
- **die Screening-Fragen** (jede Stelle hat eigene!)
- den Hero-Text und das Hero-Bild bei `?stelle=…`
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
Der Stellenauswahl-Schritt entfällt dann, Hero-Text und Hero-Bild ziehen nach.

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

**Offen:** Ein echter Testeintrag steht noch aus – `api-v2.lead-table.com`
war aus der Build-Umgebung nicht erreichbar. Die Payload-Struktur ist im
Browser mit abgefangenem Request geprüft (Name getrennt, Telefon und E-Mail
je einmal, keine Dubletten, richtige Kachel je Stelle).
