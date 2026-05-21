# Bilder-Ordnerstruktur

So organisierst du die echten Fotos für die Website.
Solange echte Bilder fehlen, werden automatisch Unsplash-Platzhalter angezeigt.

## Übersicht

```
images/
├── partners/
│   ├── eko-okna-logo.png                  Eko-Okna Logo (Partner-Sektion auf index.html)
│   ├── window4u-logo.png                  Window4U Logo (Partner-Sektion auf fenster-tueren.html)
│   └── partner-of-year-badge.png          Partner des Jahres Auszeichnung
│
├── schiebetore/
│   ├── cover.jpg                          Großes Header-Bild (für Index-Kachel)
│   ├── schiebetor-supreme/                Bilder zu SUPREME-Modell
│   │   ├── 1.jpg                          Hauptbild (große Galerie)
│   │   ├── 2.jpg                          Thumbnail 2
│   │   ├── 3.jpg                          Thumbnail 3
│   │   └── 4.jpg                          Thumbnail 4
│   ├── schiebetor-prestige/
│   │   ├── 1.jpg  …  4.jpg
│   ├── schiebetor-premium-star/
│   │   ├── 1.jpg  …  4.jpg
│   └── schiebetor-premium-classic/
│       └── 1.jpg  …  4.jpg
│
├── pforten/
│   ├── cover.jpg
│   ├── pforte-standard/    ├── 1.jpg … 4.jpg
│   ├── pforte-modern/      ├── 1.jpg … 4.jpg
│   ├── pforte-design/      ├── 1.jpg … 4.jpg
│   └── pforte-premium/     └── 1.jpg … 4.jpg
│
├── garagentore/
│   ├── cover.jpg
│   ├── garagentor-basic/    ├── 1.jpg … 4.jpg
│   ├── garagentor-comfort/  ├── 1.jpg … 4.jpg
│   ├── garagentor-premium/  ├── 1.jpg … 4.jpg
│   └── garagentor-design/   └── 1.jpg … 4.jpg
│
├── fenster-tueren/
│   └── cover.jpg                          (Nur Kachel — Detailseite nutzt window4u-Konfigurator)
│
└── bad-sanierung/
    ├── cover.jpg
    ├── bad-basis/      ├── 1.jpg … 4.jpg
    ├── bad-komplett/   ├── 1.jpg … 4.jpg
    ├── bad-premium/    ├── 1.jpg … 4.jpg
    └── bad-gaeste-wc/  └── 1.jpg … 4.jpg
```

## Wichtige Hinweise

- **Dateinamen exakt einhalten** (`1.jpg`, `2.jpg`, …) — die Website lädt genau diese Pfade.
- **Solange Bilder fehlen**, wird automatisch ein passender Unsplash-Platzhalter angezeigt
  (per `onerror`-Fallback im `<img>`-Tag).
- **Bildformat**: JPG bevorzugt, 4:3-Format ideal. Größe ca. 1200 × 900 px.
  Größere Bilder werden vom Browser automatisch herunterskaliert.
- **Optimieren** vor dem Upload (z. B. mit https://squoosh.app) — spart Ladezeit.
  Zielgröße: < 200 KB pro Bild.

## Cover-Bilder (Index-Kacheln)

Für die großen Tiles auf `index.html` sind die `cover.jpg`-Dateien in jedem Kategorie-Ordner.
Empfohlene Größe: **1600 × 1200 px**, weil sie als großes Hintergrundbild dienen.
