# Pfert – Testfeedback vom 11.11.2026

Diese Übersicht hält die geplanten Änderungen und ihren Fortschritt fest. Ein Punkt wird erst nach Umsetzung und Prüfung abgehakt. Teilfortschritt und offene Entscheidungen stehen direkt beim jeweiligen Punkt. Die Modell- und Reasoning-Empfehlungen sind Ausgangspunkte und können je nach Verfügbarkeit und tatsächlicher Schwierigkeit angepasst werden.

## Offene Punkte

### Soundeffekte

- [ ] **Sound verfeinern:** Kräftigeres klassisches Arcade-Retro-Sounddesign mit eigenem Klangcharakter für Waffen und Ereignisse; wichtige Ereignisse wie Schaden, Bossauftritte und Käserausch sollen im Kampf hervorstechen. Ton weiterhin mit M ein- und ausschaltbar.
  - Teilfortschritt: Waffen um eine tiefere Klangschicht ergänzt, mehrere Ereignisse eigenständiger gestaltet und vier Stimmen für wichtige Ereignisse reserviert. Soundeffekte werden weiterhin synthetisch erzeugt. Automatisiert: Soundausgabe, Stummschaltung, Stimmenbegrenzung und Schadenssignal bei hoher Auslastung sowie bestehende Spielabläufe geprüft (`node test-game.cjs`).
- [x] **Hintergrundmusik:** Die acht bereitgestellten Titel starten mit jedem neuen Lauf in zufälliger Reihenfolge. Nach jedem vollständigen Durchlauf wird neu gemischt. M pausiert die Musik und schaltet die Effekte stumm. Automatisiert sind Titelwechsel, Wiederholung, Stummschaltung, Stopp und Neustart geprüft (`node test-game.cjs`).
  - Offen: Hörprobe im tatsächlichen Spiel durch den Nutzer; Klangcharakter, Unterschiede aller Waffen und Ereignisse, Lautstärke und Verständlichkeit bei dichten Kämpfen anhand des Feedbacks abstimmen.


### Etappe 3: Balancing

**GPT-6.1 Terra · High**

- [ ] **Bossleben, Weinanziehung und Sonderangriffe:** Bossleben um weitere 150 % erhöht und Weinanziehung begrenzt; Sonderangriffe verbrauchen den Weinbalken. `node test-game.cjs` und `node test-meta-game.cjs` nach Anpassung bestanden. Offen: Talentbeschreibungen und weitere praktische Prüfung der neuen Mechanik.

- [ ] **Gesamtbalance und Endlosphase:** Waffen-DPS automatisiert verglichen. Erfahrungsschwelle ab Stufe 10 auf 12 % Wachstum und höchstens 1500 begrenzt; Langzeitwirkung muss praktisch überprüft werden. Schadenspfade, Bosszielzeit von 45–90 Sekunden einschließlich geheimer Bosse, Käserausch-Häufigkeit, Gegner, Builds und Heilung bis Minute 30 sowie längere Endlosläufe bleiben praktisch zu erproben und abzustimmen.

### Etappe 6: Metaprogression

**GPT-6.1 Terra · Extra High**

- [ ] **Talentbaum und Metaprogression:** Talentbaum mit 210 sichtbaren Knoten und mehrfach kaufbaren Verbesserungen vorsehen: fünf gemeinsame Startknoten, je drei Spezialisierungen in den Hauptbereichen Angriff, Überleben und Bewegung, Käserausch, Beute und Erfahrung sowie Waffen und Sonderangriffe und zehn Querverbindungsknoten. Weitere Unterzweige und Querverbindungen ermöglichen Mischungen. Ein Knoten setzt einen gekauften, direkt verbundenen Knoten voraus; S1 ist ohne Voraussetzung kaufbar. Alle Bereiche dürfen kombiniert und langfristig vollständig freigeschaltet werden.
  - Ausführlicher, noch ungeprüfter Entwurf: [Meta progression.md](Meta%20progression.md).
  - Neue Gestaltung: Pferdesilhouette mit räumlich durchmischten Clustern; gekaufte und direkt benachbarte Knoten werden sichtbar. Q10 „Eichelkranzkäse“ sitzt unter dem Pferd und verstärkt Schaden während des Käserauschs. Visuelle Qualität, Lesbarkeit und tatsächliche Bedienbarkeit müssen noch im Browser geprüft werden; zusätzliche ungewöhnliche Spezialknoten bleiben offen.
  - Teilfortschritt: Die Knoten einschließlich Präzision, Elementarschmiede und Querverbindungen sind angelegt und kaufbar; Wirkungen sind eingebunden, aber noch nicht einzeln vollständig gegen den Entwurf geprüft. Speicherung, Punktvergabe, Rücksetzen und die Baumansicht sind integriert. Automatisiert wurden Erreichbarkeit aller Knoten, ausgewählte Wirkungen aller Zweige, eine Kombination mit vollem Baum und die bestehenden Spieltests geprüft. Der Punkt bleibt offen: Browser-Spieltest mit Maus, Tastatur und Controller, eine umfassende Prüfung aller Einzelwirkungen und Kombinationen sowie praktische Balance und Spielzeit stehen aus.
  - Kleine Verbesserungen führen zu sichtbaren besonderen Zielen. Große Spezialknoten dürfen neue Mechaniken wie Begleiter, Blitzketten oder Explosionen einführen. Manche sind übermäßig stark und haben einen Nachteil, bleiben nach dem Kauf bis zum Zurücksetzen aktiv und müssen auch zusammen sinnvoll funktionieren. Im Käserausch-Baum schalten drei getrennte Meilensteine insgesamt höchstens drei zusätzliche Projektile während des Käserauschs frei.
  - Dauerhafte Talentpunkte für überlebte Zeit und besiegte reguläre sowie geheime Bosse vergeben. Der vollständige Ausbau soll ungefähr 20–50 Spielstunden benötigen; die Vergaberate anhand praktischer Rundenlängen abstimmen. Ein vollständig ausgebautes Pfert soll deutlich stärker sein.
  - Fortschritt lokal im Browser speichern. Eine zusammenhängende, ohne Scrollleisten verschiebbare und zoombare Baumansicht mit Maus, Tastatur und Controller bedienen. Die Talentverteilung lässt sich kostenlos zurücksetzen; der gesamte Fortschritt kann nach Bestätigung gelöscht werden.
  - Talentwirkungen, Kombinationen, Punktevergabe, Speicherung und beide Rücksetzarten prüfen; `node test-game.cjs` ausführen; den visuellen Browser-Spieltest übernimmt der Nutzer. Teilweise erledigte Punkte offen lassen und Einschränkungen dokumentieren.
  - **Noch zu prüfen und abzustimmen:** Knoteneffekte, Verbindungen, konkrete Zahlenwerte und Punktevergabe anhand des Entwurfs und praktischer Spieltests. Die spätere Balanceüberarbeitung bleibt offen.

### Etappe 7: Online-Multiplayer – Konzept

**GPT-6 Astra · High – Konzept**

- [ ] **Konzept für Online-Multiplayer:** Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen. Bei schwierigen Architekturentscheidungen Extra High.

### Etappe 8: Online-Multiplayer – Umsetzung

**GPT-6.1 Terra · High – Umsetzung**

In kleinen, einzeln geprüften Schritten nach dem Konzept.

- [ ] **Online gemeinsam spielen:** Spielen über das Internet auf getrennten Geräten ermöglichen. Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen.

## Abgeschlossene Punkte

### Talentbaum: wiederholbare Verbesserungen

- [ ] **Gesamtwerte anzeigen:** Beschreibungen mehrfach kaufbarer Talente zeigen den investierten Rang und den daraus berechneten Gesamtwert; bei Rang null den Wert pro Rang. Automatisiert für Ränge und alle wiederholbaren Beschreibungen geprüft; Browserprüfung steht aus.

- [ ] **Kaufvoraussetzungen:** Ein gekaufter direkt verbundener Knoten schaltet den nächsten frei; bei mehrstufigen Knoten reicht ein Rang. Ohne Verbindung bleibt der Kauf gesperrt. Automatisiert geprüft, einschließlich verschiedener Ränge; Browser-Spieltest steht aus.

- [ ] **Einzelne Talente zurückgeben:** Linksklick beziehungsweise Controller-A kauft einen Rang, Rechtsklick beziehungsweise kurzes Controller-B gibt einen Rang samt Punkt zurück. Langes Halten von B verlässt den Baum; Stick und Steuerkreuz navigieren zwischen sichtbaren verbundenen Knoten. Das Entfernen wird verhindert, wenn dadurch gekaufte Knoten vom Start getrennt würden. Kauf, Rückgabe, Verbindungsschutz und Controller-Eingaben automatisiert geprüft; Bedienung im Browser noch nicht geprüft.

- [x] **Knoten bündeln:** Aufeinanderfolgende gleiche Verbesserungen sind in bis zu fünf Rängen zusammengefasst. Ein Rang öffnet den weiteren Weg; bestehende Käufe bleiben mit ihren Wirkungen erhalten. Kauf, Freischaltung, alte Spielstände und Rücksetzen sind automatisiert geprüft; visueller Spieltest durch den Nutzer steht aus.

### Testfeedback: Elemente, Karten und Spielfluss

- [x] **Weinflaschen und Elemente:** Flaschen sind nach Feuer, Frost, Blitz und Erde eingefärbt; Traubenmost und Sonderwein bleiben unterscheidbar. Elementeffekte erscheinen an Geschossen, Lasern und Treffern, auch kombiniert. Elementzuordnung und bestehende Angriffstests automatisiert geprüft; visuelle Beurteilung übernimmt der Nutzer.
- [x] **Standardschusskarten:** Doppelter Käse, Streuflug, Schlangenlinie, Spürnase und Käsebruch wirken auf Standardschüsse und Wein-Sonderangriffe, einschließlich Laser. Streuflug erzeugt zwei weitere Fächerschüsse je Rang; zusätzliche Standardschüsse sind versetzt. Kartenränge, Kombinationen, Treffer und Waffenwechsel automatisiert geprüft; praktische Balanceprüfung übernimmt der Nutzer.
- [x] **Käserausch und Geschosse:** Sichtbare gegnerische Geschosse werden bei Aktivierung entfernt, später erzeugte bleiben. K3-22 und K3-23 gewähren 1,5 beziehungsweise 3 Sekunden Schutz; beide Wirkungen und der bestehende Nachteil sind automatisiert geprüft.
- [x] **Orb-Fortschritt:** Orbs geben nach Boni 25 % mehr Erfahrung; ein durchgehender Balken am unteren Spielfeldrand zeigt den Fortschritt. Füllstände, Überlauf und Stufenaufstieg automatisiert geprüft; praktische Balance und visuelle Prüfung übernimmt der Nutzer.

### Spielgefühl und Talentbaum

- [ ] **Knotenabstände und Kontrast:** Knoten erhalten feste, voneinander getrennte Positionen und Größen; gekaufte Knoten sind hell mit Häkchen, nicht gekaufte dunkel und der angewählte Knoten ist türkis umrandet. Abstand und stabiles Layout automatisiert geprüft; tatsächliche Lesbarkeit und Auswahl im Browser stehen noch zur Prüfung aus.

- [ ] **Talentbaumdarstellung:** Die Silhouette verwendet die erste Flügelstellung der Pfert-Grafik; Cluster wurden auf den Charakter verteilt. Die Übersicht passt sich beim Öffnen an die verfügbare Fläche an und bildet die kleinste Zoomstufe; Vergrößern schafft Platz für einzelne Knoten. Verdeckte Knoten werden über benachbarte Käufe sichtbar. Bereiche sind farblich unterscheidbar, mit dem Mausrad zoombar und per Ziehen verschiebbar; Beschreibungen erscheinen beim Überfahren oder Fokussieren. Automatisierte Spieltests bestehen; visuelle Prüfung der Positionierung und Bedienung im Browser steht aus.
- [x] **Schutzanzeige:** Leuchtring und Zahl zeigen bereite Treffer- und Geschossblocks; nicht bereite Ringsegmente sind abgedunkelt. Browserprüfung steht aus.
- [x] **Sonderangriffe und Schlangenlinie:** Sondergeschosse und Laserbreiten auf das Dreifache vergrößert; Schlangenlinie schwingt stärker. Automatisiert geprüft; praktische Balance und Browserprüfung stehen aus.


### Etappe 1: Steuerung und Spielfluss

**GPT-6.1 Terra · Medium**

- [x] **Orb-Bewegung und Fortschrittsbalken:** Orbs wandern mit halber aktueller Geschwindigkeit ihres Gegners nach links und verschwinden am linken Rand; Ansaugen bleibt möglich. Boss-Orbs nutzen die halbe Grundgeschwindigkeit des ersten Gegnertyps. Der Fortschrittsbalken liegt inzwischen über die gesamte Breite am unteren Spielfeldrand. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

- [x] **Controller-Unterstützung**: Standard-Gamepads unterstützen. Linker Stick oder Steuerkreuz bewegt das Pfert; A löst einen Sonderangriff aus, B aktiviert Käserausch. A startet auch eine Runde und bestätigt Karten. Eine Stick-Totzone verhindert unbeabsichtigte Bewegung. Tastatur und Maus bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

- [x] **Kartenwahl**: Die erste Karte sichtbar markieren; links und rechts wechseln zyklisch, Enter oder A bestätigt. Gedrückte Tasten dürfen keine unbeabsichtigte Mehrfachauswahl auslösen. Maus und Zahlentasten bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

- [x] **Seltene Karten**: Die zuletzt angebotene seltene Karte pro Runde merken. Bei der nächsten Auswahl erhält jede andere berechtigte seltene Karte das dreifache Auswahlgewicht; die vorherige bleibt möglich. Voraussetzungen, Ranggrenzen und der Zeitpunkt ab Minute 2 bleiben erhalten. Spätere legendäre Karten im selben Angebotspool erhalten dieselbe Behandlung; neue legendäre Karten sind nicht Teil dieser Etappe. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

### Etappe 2: Stufensystem und Levelwechsel

**GPT-6.1 Terra · High**

- [x] **Orb- und Stufensystem:** Gegner und Bosse hinterlassen einsammelbare Erfahrungsorbs; Punktewert abhängig vom Gegnertyp, Elite doppelt, Boss 10. Karten gibt es bei Stufenaufstieg statt jede Minute. Startbedarf 10, danach jeweils aufgerundet das 1,5-Fache; Überschuss bleibt erhalten. Orbs bleiben über Ruhrpott-Wechsel bestehen, solange sie den linken Rand nicht verlassen. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

- [x] **Levelwechsel**: Beim Betreten und Verlassen beider Ruhrpott-Abstecher wirbelt das gesamte sichtbare Spielbild einschließlich Anzeigen je 1,5 Sekunden hinein und das neue Bild heraus. Spieluhren und Kampf pausieren; begonnene Ladeangriffe werden abgebrochen, danach gilt der bestehende Trefferschutz. Implementiert und automatisiert geprüft; visueller Browser-Spieltest steht aus, da der Zugriff auf die lokale Datei durch die Browser-Sicherheitsrichtlinie gesperrt war.

### Etappe 3: Balancing

**GPT-6.1 Terra · High**

- [x] **Schaden:** Grundwert mit 1,5 multipliziert und automatisiert geprüft.

- [x] **Gegnerzahl:** Reguläre Gegner erscheinen durch 25 % längere Spawn-Abstände durchschnittlich 20 % seltener. Automatisiert geprüft; praktische Wirkung prüft der Nutzer.

- [x] **Waffenbalance:** Automatisches Feuer aller Weinwaffen automatisiert gegen ein großes stationäres Einzelziel ohne Karten und Metafreischaltungen abgestimmt. Anschließend auf Nutzerwunsch Schaden der Weinwaffen um 15 % erhöht; der Standardschuss bleibt unverändert. Praktische Balanceprüfung übernimmt der Nutzer. Sonderangriffe sind nicht Teil der DPS-Messung.

- [x] **Bosse:** Lebenspunkte aller Bosse und ihrer Segmente verfünffacht und automatisiert geprüft.

- [x] **Käserausch:** Halbe Aufladerate und Heilung um bis zu zwei Herzen implementiert und automatisiert geprüft.

### Etappe 4: Käserausch und Effekte

**GPT-6.1 Terra · Medium**

- [x] **Käserausch als Notfallknopf:** Bei Aktivierung nur sichtbare reguläre Gegner entfernen; vorhandene Orbs und Belohnungen bleiben; sichtbare feindliche Geschosse werden ebenfalls entfernt. Besiegte Gegner hinterlassen ihre normalen Belohnungen und Orbs; Bosse bleiben. Neue Gegner erscheinen nach dem regulären Spawn-Timer. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

- [x] **Boss-Treffer:** Das getroffene Segment bei jedem Schadensereignis einschließlich Schaden über Zeit unmittelbar kurz weiß aufblitzen lassen und danach seine ursprüngliche Grafik wiederherstellen. Treffer und Schaden über Zeit setzen den Blitz am betroffenen Segment.

### Etappe 5: Sonderwaffen und Power-up

**GPT-6.1 Terra · High**

- [x] **Sonderwaffen:** Drei Einsätze, sofortige Auslösung per Leertaste oder Controller und vollständig auffüllender Sonderwein implementiert. Die bisherigen Waffenvarianten werden als Sonderangriffe genutzt und automatisiert geprüft. Browser-Spieltest und praktische Balanceprüfung übernimmt der Nutzer.

- [x] **Ansaug-Power-up:** Korkenzieher erhöht den Flaschenradius um 240 Pixel pro Rang, den Orb-Radius weiterhin um 12 Pixel. Automatisiert geprüft; den Browser-Spieltest übernimmt der Nutzer.

### Etappe 9: Geschosskarten und Kombinationen

**GPT-6.1 Terra · High**

- [x] **Standardschuss und Kombinationen:** Doppelter Käse, Streuflug, Schlangenlinie, Spürnase und Käsebruch ergänzen den Standardschuss und die Wein-Sonderangriffe, einschließlich Laser, und sind kombinierbar. Automatisiert geprüft; Browser-Spieltest und praktische Balanceprüfung übernimmt der Nutzer.

### Grafiküberarbeitung · 12.11.2026

- [x] **Pferd:** Freigegebenen Entwurf als separate transparente Grafik mit zwei ausgerichteten Flügelstellungen eingebaut; klarere Silhouette, ausgearbeitete Federn, kräftigere Schatten und größerer Auftritt. Weißen Dauerschein entfernt; Lade-, Schuss-, Schutz- und Käserausch-Effekte bleiben erhalten. Alte Rastergrafik und gezeichnetes Pferd dienen weiter als Ladefehler-Fallback.
  - Geprüft: `node test-game.cjs`, `node render-preview.cjs`; beide Flügelstellungen, Lade-/Schusseffekte, Käserausch, Trefferschutz und beide Fallbacks mit echtem Canvas. Spielvorschau: `previews/horse-v2-in-game.png`. Browser-Spieltest offen: lokaler Server im Browser nicht erreichbar, Datei-URLs durch Browserrichtlinie gesperrt.

- [x] **Standardschuss:** Darstellung der normalen Käseschüsse um 30 % verkleinert; Trefferfläche und Schaden bleiben erhalten. Automatisiert geprüft; Browser-Spieltest offen.
