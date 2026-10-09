# Creatives · PMH Heyn

Alles hier wird aus **einer** Quelle gerendert:

```
node creatives/build.mjs
```

Benutzt wird ausschließlich das gelieferte Material aus `bilder/`:
`_34A2425.JPG`, `_34A2508.JPG`, `logo.svg`. Kein Stock, keine Fremdbilder.

## Was entsteht

| Datei | Format | Einsatz |
|---|---|---|
| `<stelle>-<motiv>-4x5.png` | 1080 × 1350 | Feed (Facebook / Instagram) |
| `<stelle>-<motiv>-9x16.png` | 1080 × 1920 | Stories / Reels |
| `facebook-profilbild.png` | 1080 × 1080 | FB-Profil, volles Logo |
| `facebook-profilbild-bildmarke.png` | 1080 × 1080 | FB-Profil, nur Bildmarke |
| `facebook-titelbild.png` | 1640 × 856 | FB-Titelbild |

Stellen: `schleifer`, `montage` · Motive: `stelle`, `check`, `benefit`
→ 2 × 3 × 2 = **12 Creatives** plus 3 Facebook-Bilder.

## Die drei Motive

Bewusst drei verschiedene Ansätze, nicht drei Formulierungen derselben Idee:

- **stelle** – Stellenbezeichnung direkt, Benefits als Chips
- **check** – Anforderungsliste. Filtert auf Qualität statt Masse: wer die
  Punkte nicht erfüllt, klickt gar nicht erst
- **benefit** – Problem → Lösung (Schicht / Überqualifikation)

## Zwei Dinge, die beim Nachmessen aufgefallen sind

**Gold ist eine helle Farbe.** Luminanz 0,36 – kleine goldene Schrift
braucht einen nahezu schwarzen Untergrund, den ein Foto nicht hergibt. Die
Eyebrow-Zeile lag deshalb zuerst bei 1,3–1,7:1. Sie sitzt jetzt in einem
dunklen Pill, das ihren Untergrund selbst mitbringt.

**Der Textblock braucht seinen eigenen Schleier.** Wo er beginnt, hängt von
der Textmenge ab – ein Verlauf im Canvas-Raster trifft ihn mal und mal
nicht. `.mitte` trägt den Verlauf jetzt selbst, der Aufblendbereich liegt
komplett im `padding-top`, und die Stops stehen in Pixeln statt Prozent.

**Der Schleier muss bis zur Unterkante durchlaufen.** Sonst endet die dunkle
Fläche dort, wo der Text endet, und darunter wird das Foto wieder hell – das
sieht aus wie ein zweites, angeschnittenes Bild. Im 9:16 war der Effekt
deutlich (330 px Fußraum), im 4:5 als schmaler Streifen. `.mitte` zieht sich
jetzt per negativem `margin-bottom` bis zum unteren Rand.

Geprüft wird das nicht per Augenmaß:

```
MEASURE=1 node creatives/build.mjs
```

rendert zusätzlich jedes Creative **ohne Text** nach `.measure/` und legt
die Positionen aller Textelemente in `boxen.json` ab. Damit lässt sich der
Kontrast hinter der Schrift nachrechnen statt schätzen. Aktueller Stand:
schwächstes Element über alle 15 Bilder **3,1:1** (Logo, Grenze 3,0) bzw.
**4,3:1** bei Text (Grenze 3,0 für Headlines, 4,5 für Fließtext).

## Facebook-Profilbild: zwei Varianten

Facebook beschneidet rund und zeigt das Bild im Feed oft mit 40–48 px.
Die breite Wortmarke ist dann unlesbar. Deshalb liegt zusätzlich eine
Variante mit der **Bildmarke** bei – das ist dieselbe Datei, nur ein
anderer Ausschnitt der `viewBox`: nicht nachgebaut, nicht eingefärbt,
nicht verzerrt. Welche live geht, entscheidet ihr.

## Anpassen

- **Neues Format** → in `FORMATE` ergänzen
- **Neues Motiv** → in `MOTIVE` ergänzen
- **Anderer Bildausschnitt** → `FOTO`, Felder `pos` / `zoom` / `flip`
- **Farben** → `CI` oben, identisch mit dem `:root`-Block in `index.html`

Für die Montage wurde kein eigenes Motiv geliefert. Die drei Montage-
Creatives benutzen deshalb drei deutlich verschiedene Ausschnitte der
Werkstattaufnahme. Der Funkenflug bleibt der Schleiferei vorbehalten.
