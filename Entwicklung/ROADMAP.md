# Pfert – Roadmap

Die Einträge nennen die Urheberschaft. Vorschläge sind keine Zusage zur Umsetzung.

## Vorschläge von Konsuul

- [ ] **Unterschiedliche Gegner-Flugprofile.** Standardgegner kommen nicht alle gerade vom Bildschirmrand. Einige fliegen diagonal ein; andere preschen vor, halten kurz an, erfassen die Position des Pferts und stoßen dann gezielt vor. Das Pfert soll in Bewegung bleiben und auf unterschiedliche Muster reagieren. Anstürme gut ankündigen und im frühen Spiel sparsam einsetzen. Bestehende Boss-, Formations- und Spezialabläufe bewahren.

- [ ] **Basarwachen ohne Texte intuitiv erkennbar machen.** „Wache 1/2“ nicht durch Ziffern, Striche oder andere Zählzeichen ersetzen. Wachen und Anführer durch sichtbares Verhalten und ihre Beziehung zueinander unterscheiden, etwa durch ein am Gegner befestigtes Eskortenband, das beim Abschuss einer Wache sichtbar nachgibt. Die Darstellung darf keine Unverwundbarkeit vortäuschen. In einem kurzen Spieltest prüfen, ob jemand ohne Erklärung erkennt, dass beide Wachen vor dem Anführer fallen sollen. Keine eingeblendeten Texte im Spielfeld; die Regel in den Entwicklungsvorgaben festhalten.

### Stage 2 · Pfreferanch

Stage 1 bleibt als manueller Pfert-Run spielbar. Stage 2 baut darauf auf: **Eier finden → Pfohlen aufziehen → Anatolien-Missionen → Berufe meistern → Fame sammeln**. Die folgende Reihenfolge ist verbindlich für die Umsetzung. Zahlen außerhalb der Brutzeiten sind Startwerte für Spieltests.

1. [ ] **Ranch-Grundlage und Speicherstand.** Die Pfreferanch als eigenen Menübereich mit Brutübersicht und Pfohlen-Liste anlegen. Einen separaten, versionierten lokalen Save für Eier, Pfohlen und aktive Spielzeit einführen; bestehende Talente und Bestzeiten nicht verändern. IDs und Speicherpfad so anlegen, dass Schlüpfen und spätere Belohnungen auch nach Neustart nicht doppelt verbucht werden.
2. [ ] **Ei-Drops und Schlüpfen.** Ab Minute **30:00** eines regulären Runs können besiegte Gegner einsammelbare Eier hinterlassen. Reihenfolge und Brutzeit: **pleb** (common, 5 Min.), **otto** (uncommon, 10 Min.), **wallach** (rare, 20 Min.), **hengst** (mythic rare, 60 Min.). Die Brut startet beim Einsammeln und läuft über mehrere Runs hinweg nur während aktiver Spielzeit weiter, nicht in Pause, Menüs, beim geschlossenen Spiel oder in Debug- und Übungsmodi. Die Ranch zeigt Rang und Restzeit; beim Schlüpfen erscheint genau ein Pfohlen. Ersten Drop-Pass mit moderater Rate, globalem Mindestabstand und seltenem Mythic-Tier testen. Unterschiede im Spielfeld über Form und Farbe, nicht über eingeblendeten Text, zeigen.
3. [ ] **Anatolien-Missionen und Vorräte.** Zwei erste Aufträge entwerfen: Weinberg für Wein, Dorfmarkt für Käse. Eine aktive Ausfahrt pro Ranch zum Start. Pfert kann selbst manuell losfliegen oder ein Pfohlen dorthin schicken. Ausgeschickte Pfohlen sind zeitweise nicht fürs Training verfügbar. Handspiel gibt mehr Kontrolle und einen Leistungsbonus; Aussenden gibt verlässliche Grundbeute. Beide Wege liefern dieselben Ranch-Ressourcen, keine neue Pflichtwährung und keine Abwertung der normalen Runs.
4. [ ] **Aufzucht, Level und Berufsskills.** Pfohlen starten auf Stufe 1. Käse bezahlt Trainingseinheiten und gibt EP; Wein schaltet ausgewählte Skillränge frei. Startmodell: Stufen 1–10, wachsender EP-Bedarf, ein Skillpunkt pro Stufe; Berufswahl ab Stufe 3. **Voltigierhengst**: Ausweichmanöver und schnelle Missionen. **Bauarbeiterhengst**: Tragkraft und Abkürzungen über Hindernisse. **Bauerhengst**: verlässliche Käse-Ausbeute und weniger Ressourcenverlust. **Currywurststandhengst**: Vorräte in Proviant umwandeln, der die nächste Ausfahrt verbessert. Jeder Beruf erhält einen nützlichen Startskill und einen späteren Spezialeffekt. Seltenheit gibt eine Startneigung, aber kein exklusives Berufsrecht.
5. [ ] **Fame und Stage-3-Schwelle.** Startmodell: +3 Fame pro geschlüpftem Pfohlen, +10 je Pfohlen beim ersten Berufsmeilenstein, +8 pro erstmals gemeistertem Missionsziel. Dasselbe Ziel nicht durch Wiederholung farmbar machen. Richtwert zum Öffnen der Schwelle: 100 Fame, drei ausgebildete Pfohlen und mindestens zwei verschiedene Berufe. Der Bestand zählt, aber gemeinsam mit Ausbildung und Leistung. Nur Fortschritt und Freischaltung anzeigen; keine Inhalte von Stage 3 verraten oder umsetzen.
6. [ ] **Zusammenspiel und Balancing.** Regulären Lauf ab Minute 30, Verteilung der Eier, Brut über mehrere Runs, beide Missionswege und den Weg zur Fame-Schwelle testen. Kein Pflichtgrind durch ein einzelnes seltenes Ei. Erfolgsmaßstab: frühe sichtbare Ranch-Fortschritte, später echte Berufswahl und weiterhin fordernde manuelle Missionen.

## Vorschläge vom Dot

### P1 · Schwierigkeit und Lesbarkeit

- [ ] **Boss-Balancing mit drei Builds prüfen.** Sultan und Pascha jeweils mit frischem, typischem und starkem Build unter vergleichbaren Bedingungen testen. Zeit bis zum Sieg, verlorene Herzen und ausgespielte Angriffsmuster erfassen. In 1.1.4 ergeben fünf Ränge Käsereifung allein rund 2,93× statt 1,76× Schaden; ob dadurch ganze Bossphasen entfallen, ist noch nicht im Spiel belegt. Falls das regelmäßig passiert, zuerst Ausreißer oder gezielte Angriffsmuster anpassen. Wertvolle Power-ups erhalten; Gegnerleben nicht pauschal erhöhen.
- [ ] **Basar und Großwesir lesbarer inszenieren.** Einen 20-Sekunden-Vergleich mit Einflug, sichtbarem Ausholen und Armbruch bauen. Die Flugbahn bleibt kontrastarm, der gebrochene Arm am Boss sichtbar. Beim Laser einen schmalen hellen Kern mit transparenter Außenkante erproben. Ziel: Gefahr und Trefferfortschritt bleiben ohne Ton und bei halber Fenstergröße erkennbar.

### P2 · Übung und Wiederspielwert

- [ ] **Boss-Training.** Mit dem vorhandenen Debug-Einstieg zunächst nur den Großwesir als regulär auswählbare Übung anbieten: Basisskill wählen, direkt starten und schnell wiederholen. Keine Talentpunkte oder Ranglisteneinträge; ideal zum Lernen der Angriffsmuster und Vergleichen beider Bruchreihenfolgen.
- [ ] **Bestlauf pro Basisskill in der Rundenauswertung.** Neben der bestehenden gemeinsamen Punktetafel anzeigen, wie viel länger der aktuelle Lauf gegenüber der bisherigen Bestzeit desselben Basisskills war. Arcade und Zugabe getrennt vergleichen; ältere Einträge ohne Basisskill nicht falsch zuordnen.
- [ ] **Sternenpost-Kurierlauf.** Einen separaten 90-Sekunden-Kurs mit festen Siegeln und Gegnerwellen prototypen. Der Schwerpunkt liegt auf Fluglinie und Ausweichen, nicht auf Abschüssen. Zustellungen sollen im Kurs einen spürbaren Vorteil bringen; Punkte allein sind nicht der Anreiz.
