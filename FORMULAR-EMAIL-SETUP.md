# Formular & E-Mail-Versand einrichten (Formspree)

Damit Anfragen über das Formular auf `angebot.html` per **E-Mail** ankommen, brauchst du
einen Dienst, der den Versand übernimmt — denn HTML alleine kann keine E-Mails verschicken.

Die einfachste Lösung: **Formspree** (kostenlos für bis zu **50 Anfragen pro Monat**).

---

## Schritt-für-Schritt-Anleitung (Formspree)

### 1. Account anlegen
- Gehe auf **https://formspree.io** und klicke auf „Get Started Free".
- Registriere dich mit der E-Mail-Adresse, an die später alle Anfragen geschickt werden sollen
  (z. B. `info@amc-czyrka.de`).

### 2. Neue Form anlegen
- Klicke nach dem Login auf **„+ New Form"**.
- Gib einen Namen ein (z. B. „AMC CZYRKA Angebote").
- Wähle die **Ziel-E-Mail** (Sending To). Diese Adresse bekommt jede Anfrage.
- Bestätigung der E-Mail-Adresse über die Mail, die Formspree dir schickt — wichtig!

### 3. Form-ID kopieren
- Nach dem Anlegen siehst du oben eine **Form-Endpoint-URL** wie:
  `https://formspree.io/f/xyzabc12`
- Die `xyzabc12` ist deine **Form-ID** (es sind 7–8 Zeichen).

### 4. In `angebot.html` einsetzen
- Öffne `angebot.html` im Editor.
- Suche nach: `YOUR_FORMSPREE_ID`
- Ersetze diesen Platzhalter durch deine tatsächliche Form-ID.

   Beispiel:
   ```html
   <!-- vorher -->
   action="https://formspree.io/f/YOUR_FORMSPREE_ID"

   <!-- nachher -->
   action="https://formspree.io/f/xyzabc12"
   ```

### 5. Erste Anfrage testen
- Öffne die Website, gehe auf **Kostenloses Angebot** und sende eine Test-Anfrage ab.
- Formspree fragt beim ersten Mal nochmal nach Bestätigung deiner E-Mail-Adresse —
  einmalig klicken und fertig.
- Ab jetzt kommt jede Anfrage als formatierte E-Mail bei dir an.

---

## Was kann Formspree noch?

- **Spam-Schutz** automatisch eingebaut (Honeypot, ReCaptcha optional)
- **Auto-Reply** an den Kunden möglich (Pro-Plan)
- **Datei-Anhänge** möglich (Pro-Plan)
- **Webhook-Weiterleitung** zu anderen Tools (Slack, Trello etc.)
- **Export** der Anfragen als CSV/JSON

Das kostenlose Limit von **50 Anfragen/Monat** reicht für die meisten kleinen Unternehmen.
Falls mehr nötig: Der „Gold"-Plan liegt bei ca. **10 €/Monat** für unbegrenzte Anfragen.

---

## DSGVO-Hinweis

Formspree ist ein US-Anbieter. Wenn du DSGVO-konform sein willst:

1. **Auftragsverarbeitungsvertrag (AVV)** mit Formspree abschließen — geht ab dem Gold-Plan.
2. In der **Datenschutzerklärung** der Website erwähnen, dass Formulardaten über Formspree
   verarbeitet werden.
3. Alternative: Europäischer Anbieter (siehe unten).

---

## Alternativen (falls Formspree nicht passt)

| Anbieter           | Kostenlos    | Sitz       | Besonderheiten                          |
|--------------------|--------------|------------|-----------------------------------------|
| **Formspree**      | 50/Monat     | USA        | Einfachste Einrichtung                  |
| **Web3Forms**      | 250/Monat    | USA/EU     | Kein Account nötig (nur Access-Key)     |
| **Getform**        | 50/Monat     | USA        | Schöne Auswertungs-Oberfläche           |
| **Formsubmit.co**  | Unbegrenzt   | USA        | 100 % kostenlos, kein Account           |
| **Form-Data.com**  | 100/Monat    | EU         | DSGVO-konform aus Deutschland           |

Für alle gilt: Das `action`-Attribut im Form-Tag wird durch die entsprechende URL ersetzt —
der restliche Code in `angebot.html` bleibt identisch.

---

## Komplett ohne Drittanbieter (für Profis)

Wenn die Seite auf einem **eigenen Server mit PHP** läuft, kann ein kleines PHP-Script
die E-Mail direkt versenden. Das erfordert aber:
- Server mit PHP-Mail-Funktion oder SMTP-Zugang
- Eigene Spam-Schutz-Implementierung
- Mehr technisches Wissen

Für eine statische Website (z. B. auf Netlify, Vercel, GitHub Pages) ist ein Formular-Dienst
wie Formspree fast immer die beste Wahl.

---

## Falls du keinen Drittanbieter willst (Notlösung)

Du kannst den Submit-Button so umbauen, dass er einfach den E-Mail-Client öffnet
(`mailto:`-Link mit vorausgefülltem Inhalt). Das funktioniert ohne externen Dienst,
hat aber Nachteile:
- Funktioniert nur, wenn der Kunde einen Mail-Client installiert hat
- Viele Browser blockieren `mailto:` heute oder zeigen Warnungen
- Der Kunde muss aktiv „Senden" drücken — viele tun das nicht

**Empfehlung:** Formspree einrichten — 5 Minuten Arbeit, und alle Anfragen kommen sauber an.
