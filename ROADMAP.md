# Pfert – Testfeedback vom 11.11.2026

Diese Übersicht hält die geplanten Änderungen und ihren Fortschritt fest. Ein Punkt wird erst nach Umsetzung und Prüfung abgehakt. Teilfortschritt und offene Entscheidungen stehen direkt beim jeweiligen Punkt. Die Modell- und Reasoning-Empfehlungen sind Ausgangspunkte und können je nach Verfügbarkeit und tatsächlicher Schwierigkeit angepasst werden.

## Etappe 1: Steuerung und Spielfluss

### GPT-6.1 Terra · Medium

- [x] **Orb-Bewegung und Fortschrittsbalken:** Orbs wandern mit halber aktueller Geschwindigkeit ihres Gegners nach links und verschwinden am linken Rand; Ansaugen bleibt möglich. Boss-Orbs nutzen die halbe Grundgeschwindigkeit des ersten Gegnertyps. Rechts oben zeigt ein Balken den Stufenfortschritt. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.
- [x] **Controller-Unterstützung**: Standard-Gamepads unterstützen. Linker Stick oder Steuerkreuz bewegt das Pfert; A hält den Ladeangriff und feuert beim Loslassen, B aktiviert Käserausch. A startet auch eine Runde und bestätigt Karten. Eine Stick-Totzone verhindert unbeabsichtigte Bewegung. Tastatur und Maus bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.
- [x] **Kartenwahl**: Die erste Karte sichtbar markieren; links und rechts wechseln zyklisch, Enter oder A bestätigt. Gedrückte Tasten dürfen keine unbeabsichtigte Mehrfachauswahl auslösen. Maus und Zahlentasten bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.
- [x] **Seltene Karten**: Die zuletzt angebotene seltene Karte pro Runde merken. Bei der nächsten Auswahl erhält jede andere berechtigte seltene Karte das dreifache Auswahlgewicht; die vorherige bleibt möglich. Voraussetzungen, Ranggrenzen und der Zeitpunkt ab Minute 2 bleiben erhalten. Spätere legendäre Karten im selben Angebotspool erhalten dieselbe Behandlung; neue legendäre Karten sind nicht Teil dieser Etappe. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

## Etappe 2: Stufensystem und Levelwechsel

### GPT-6.1 Terra · High

- [x] **Orb- und Stufensystem:** Gegner und Bosse hinterlassen einsammelbare Erfahrungsorbs; Punktewert abhängig vom Gegnertyp, Elite doppelt, Boss 10. Karten gibt es bei Stufenaufstieg statt jede Minute. Startbedarf 10, danach jeweils aufgerundet das 1,5-Fache; Überschuss bleibt erhalten. Orbs bleiben über Ruhrpott-Wechsel bestehen, solange sie den linken Rand nicht verlassen. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

- [x] **Levelwechsel**: Beim Betreten und Verlassen beider Ruhrpott-Abstecher wirbelt das gesamte sichtbare Spielbild einschließlich Anzeigen je 1,5 Sekunden hinein und das neue Bild heraus. Spieluhren und Kampf pausieren; begonnene Ladeangriffe werden abgebrochen, danach gilt der bestehende Trefferschutz. Implementiert und automatisiert geprüft; visueller Browser-Spieltest steht aus, da der Zugriff auf die lokale Datei durch die Browser-Sicherheitsrichtlinie gesperrt war.

## Etappe 3: Balancing

### GPT-6.1 Terra · High

- [x] **Schaden:** Grundwert mit 1,5 multipliziert und automatisiert geprüft.
- [ ] **Waffenbalance:** Durchschnittlichen Schaden pro Sekunde der Waffen unter vergleichbaren Bedingungen auf höchstens 15 % Abweichung abstimmen. Ausgangspunkt sind automatische Angriffe ohne Karten und Zufallstreffer gegen ein vergleichbares Ziel; Trefferverhalten und Builds können das Ergebnis im Spiel verändern.
- [x] **Bosse:** Lebenspunkte aller Bosse und ihrer Segmente verfünffacht und automatisiert geprüft.
- [x] **Käserausch:** Halbe Aufladerate und Heilung um bis zu zwei Herzen implementiert und automatisiert geprüft.

- [ ] **Gesamtbalance und Endlosphase:** Waffen-DPS vergleichbar messen; Schadenspfade, Bosszielzeit von 45–90 Sekunden einschließlich geheimer Bosse, Käserausch-Häufigkeit, Gegner, Erfahrungskurve, Builds und Heilung bis Minute 30 sowie längere Endlosläufe praktisch erproben und abstimmen. Die exponentielle Erfahrungsschwelle ist dabei besonders zu prüfen.

## Etappe 4: Käserausch und Effekte

### GPT-6.1 Terra · Medium

- [x] **Käserausch als Notfallknopf:** Bei Aktivierung nur sichtbare reguläre Gegner entfernen; vorhandene Orbs, Belohnungen und feindliche Geschosse bleiben. Besiegte Gegner hinterlassen ihre normalen Belohnungen und Orbs; Bosse bleiben. Neue Gegner erscheinen nach dem regulären Spawn-Timer. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.
- [ ] **Boss-Treffer:** Das getroffene Segment bei jedem Schadensereignis einschließlich Schaden über Zeit unmittelbar kurz weiß aufblitzen lassen und danach seine ursprüngliche Grafik wiederherstellen. Ausgangslage: Segment-Blitze sind bereits angelegt; das gewünschte Verhalten muss geprüft werden.

## Etappe 5: Sonderwaffen und Power-up

### GPT-6.1 Terra · High

- [x] **Sonderwaffen:** Drei Einsätze, sofortige Auslösung per Leertaste oder Controller und vollständig auffüllender Sonderwein implementiert. Die bisherigen Waffenvarianten werden als Sonderangriffe genutzt und automatisiert geprüft. Browser-Spieltest und praktische Balanceprüfung übernimmt der Nutzer.
- [x] **Ansaug-Power-up:** Korkenzieher erhöht den Flaschenradius um 240 Pixel pro Rang, den Orb-Radius weiterhin um 12 Pixel. Automatisiert geprüft; den Browser-Spieltest übernimmt der Nutzer.

## Etappe 6: Metaprogression

### GPT-6.1 Terra · Extra High

- [ ] **Talentbaum und Metaprogression:** 360 einzeln kaufbare Knoten vorsehen: fünf gemeinsame Startknoten, je drei Spezialisierungen in den Hauptbereichen Angriff, Überleben und Bewegung, Käserausch, Beute und Erfahrung sowie Waffen und Sonderangriffe und zehn Querverbindungsknoten. Weitere Unterzweige und Querverbindungen ermöglichen Mischungen. Ein Knoten setzt einen gekauften, direkt verbundenen Knoten voraus; S1 ist ohne Voraussetzung kaufbar. Alle Bereiche dürfen kombiniert und langfristig vollständig freigeschaltet werden.
  - Ausführlicher, noch ungeprüfter Entwurf: [Meta progression.md](Meta%20progression.md).
  - Kleine Verbesserungen führen zu sichtbaren besonderen Zielen. Große Spezialknoten dürfen neue Mechaniken wie Begleiter, Blitzketten oder Explosionen einführen. Manche sind übermäßig stark und haben einen Nachteil, bleiben nach dem Kauf bis zum Zurücksetzen aktiv und müssen auch zusammen sinnvoll funktionieren. Im Käserausch-Baum schalten drei getrennte Meilensteine insgesamt höchstens drei zusätzliche Projektile während des Käserauschs frei.
  - Dauerhafte Talentpunkte für überlebte Zeit und besiegte reguläre sowie geheime Bosse vergeben. Der vollständige Ausbau soll ungefähr 20–50 Spielstunden benötigen; die Vergaberate anhand praktischer Rundenlängen abstimmen. Ein vollständig ausgebautes Pfert soll deutlich stärker sein.
  - Fortschritt lokal im Browser speichern. Eine zusammenhängende, verschiebbare und zoombare Baumansicht mit Maus, Tastatur und Controller bedienen. Die Talentverteilung lässt sich kostenlos zurücksetzen; der gesamte Fortschritt kann nach Bestätigung gelöscht werden.
  - Talentwirkungen, Kombinationen, Punktevergabe, Speicherung und beide Rücksetzarten prüfen; `node test-game.cjs` ausführen und nach Möglichkeit im Browser testen. Teilweise erledigte Punkte offen lassen und Einschränkungen dokumentieren.
  - **Vor der Umsetzung zu prüfen und abzustimmen:** Knoteneffekte, Verbindungen, konkrete Zahlenwerte und Punktevergabe anhand des Entwurfs und praktischer Spieltests.

## Etappe 7: Online-Multiplayer – Konzept

### GPT-6 Astra · High – Konzept

- Konzept für Online-Multiplayer: Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen. Bei schwierigen Architekturentscheidungen Extra High.

## Etappe 8: Online-Multiplayer – Umsetzung

### GPT-6.1 Terra · High – Umsetzung

In kleinen, einzeln geprüften Schritten nach dem Konzept.

- [ ] **Online gemeinsam spielen:** Spielen über das Internet auf getrennten Geräten ermöglichen. Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen.

## Etappe 9: Geschosskarten und Kombinationen

### GPT-6.1 Terra · High

- [ ] **Standardschuss und Kombinationen:** Zusätzliche Karten schaffen dauerhafte Modifikatoren für den Standardschuss und ermöglichen wildere kombinierbare Effekte, etwa Splitter, Verfolgung und von Gegner zu Gegner springenden Schaden. Bestehende Karten und Kombinationen berücksichtigen; konkrete Karten und Balance vor der Umsetzung ausarbeiten.

## Grafiküberarbeitung · 12.11.2026

- [x] **Pferd:** Freigegebenen Entwurf als separate transparente Grafik mit zwei ausgerichteten Flügelstellungen eingebaut; klarere Silhouette, ausgearbeitete Federn, kräftigere Schatten und größerer Auftritt. Weißen Dauerschein entfernt; Lade-, Schuss-, Schutz- und Käserausch-Effekte bleiben erhalten. Alte Rastergrafik und gezeichnetes Pferd dienen weiter als Ladefehler-Fallback.
  - Geprüft: `node test-game.cjs`, `node render-preview.cjs`; beide Flügelstellungen, Lade-/Schusseffekte, Käserausch, Trefferschutz und beide Fallbacks mit echtem Canvas. Spielvorschau: `previews/horse-v2-in-game.png`. Browser-Spieltest offen: lokaler Server im Browser nicht erreichbar, Datei-URLs durch Browserrichtlinie gesperrt.
