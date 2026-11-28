# Pfert – Roadmap

Die Einträge nennen die Urheberschaft. Vorschläge sind keine Zusage zur Umsetzung.

Jeder Punkt hat eine feste ID direkt über seinem Eintrag. IDs beim Ergänzen, Verschieben oder Erledigen nicht neu vergeben. Unterpunkte nutzen die Eltern-ID mit eigener Endnummer (z. B. `2.2.1`).

## Vorschläge von Konsuul

### Stage 1 · Gegner und Basar

#### 1.1

- [ ] **Unterschiedliche Gegner-Flugprofile.** Standardgegner kommen nicht alle gerade vom Bildschirmrand. Einige fliegen diagonal ein; andere preschen vor, halten kurz an, erfassen die Position des Pferts und stoßen dann gezielt vor. Das Pfert soll in Bewegung bleiben und auf unterschiedliche Muster reagieren. Anstürme gut ankündigen und im frühen Spiel sparsam einsetzen. Bestehende Boss-, Formations- und Spezialabläufe bewahren. In 1.1.5 umgesetzt und mit `node tests/test-encounters.cjs --flight-profiles` lokal geprüft. GitHub-Bestätigung steht aus.

#### 1.2

- [ ] **Basarwachen ohne Texte intuitiv erkennbar machen.** „Wache 1/2“ nicht durch Ziffern, Striche oder andere Zählzeichen ersetzen. Wachen und Anführer durch sichtbares Verhalten und ihre Beziehung zueinander unterscheiden, etwa durch ein am Gegner befestigtes Eskortenband, das beim Abschuss einer Wache sichtbar nachgibt. Die Darstellung darf keine Unverwundbarkeit vortäuschen. In einem kurzen Spieltest prüfen, ob jemand ohne Erklärung erkennt, dass beide Wachen vor dem Anführer fallen sollen. Keine eingeblendeten Texte im Spielfeld; die Regel in den Entwicklungsvorgaben festhalten. Bannerbänder und Wegfall beider Verbindungen lokal geprüft. Die Verständlichkeit ohne Erklärung im menschlichen Spieltest ist offen.

### Stage 2 · Pferteranch

Stage 1 bleibt als manueller Pfert-Run spielbar. Stage 2 baut darauf auf: **Eier finden → Pfohlen aufziehen → Anatolien-Missionen → Berufe meistern → Fame sammeln**. Die folgende Reihenfolge ist verbindlich für die Umsetzung. Zahlen außerhalb der Brutzeiten sind Startwerte für Spieltests.

#### 2.1

- [ ] **Ranch-Grundlage und Speicherstand.** Die Pferteranch als eigenen Menübereich mit Brutübersicht und Pfohlen-Liste anlegen. Einen separaten, versionierten lokalen Save für Eier, Pfohlen und aktive Spielzeit einführen; bestehende Talente und Bestzeiten nicht verändern. IDs und Speicherpfad so anlegen, dass Schlüpfen und spätere Belohnungen auch nach Neustart nicht doppelt verbucht werden.

#### 2.2

- [ ] **Ei-Drops und Schlüpfen.** Ab Minute **30:00** eines regulären Runs können besiegte Gegner einsammelbare Eier hinterlassen. Reihenfolge und Brutzeit: **pleb** (common, 5 Min.), **otto** (uncommon, 10 Min.), **wallach** (rare, 20 Min.), **hengst** (mythic rare, 60 Min.). Die Brut startet beim Einsammeln und läuft über mehrere Runs hinweg nur während aktiver Spielzeit weiter, nicht in Pause, Menüs, beim geschlossenen Spiel oder in Debug- und Übungsmodi. Die Ranch zeigt Rang und Restzeit; beim Schlüpfen erscheint genau ein Pfohlen. Ersten Drop-Pass mit moderater Rate, globalem Mindestabstand und seltenem Mythic-Tier testen. Unterschiede im Spielfeld über Form und Farbe, nicht über eingeblendeten Text, zeigen.

##### 2.2.1

- [ ] **Erweiterung der Ei-Drops: Mutatoren und Farbvererbung.** Beim Drop können zusätzlich zur Seltenheit **Farbe und Muster unabhängig gewürfelt und kombiniert** werden. Muster: **Kreise, Rechtecke, Rauten und Kreuze**. Varianten-ID, Farbpalette und Muster im Spielstand speichern. Beide Merkmale sind auf der Eierschale sichtbar, gehen beim Schlüpfen aufs Fell des Pfohlens über und bleiben auf der Ranch sowie nach Neuladen erhalten. Ei und Pfohlen im vorgegebenen **16-Bit-Pixelstil von Pfert** ausarbeiten: vorhandenen Pixelmaßstab, Palette, Konturen und Lichtführung übernehmen. Farbe und Muster müssen auf Schale und Fell bei tatsächlicher Spiel- und Ranchgröße zusammengehörig und ohne Spielfeldtext lesbar sein. Seltenheit zusätzlich über die Ei-Form unterscheiden. Reload und ältere Eier ohne Variante mit Standardfarbe testen. Zuerst visuelle Varianten; keine Gameplay-Boni voraussetzen.

#### 2.3

- [ ] **Anatolien-Missionen und Vorräte.** Pfert oder einzelne Pfohlen auf Missionen schicken; Pfret kann eine Mission weiterhin selbst manuell spielen. Wein und Käse fließen ins Training und in Skills. Konkrete Startregeln stehen unten bei den Dot-Systementwürfen.

#### 2.4

- [ ] **Aufzucht, Level und Berufsskills.** Pfohlen auf der Pferteranch aufziehen, trainieren und in vier Berufe entwickeln: Voltigierhengst, Bauarbeiterhengst, Bauerhengst und Currywurststandhengst. Konkrete Level- und Skillwerte stehen unten bei den Dot-Systementwürfen.

#### 2.5

- [ ] **Fame und Stage-3-Schwelle.** Mit mehr Pfohlen und aufgebauter Ranch Fame gewinnen. Ab einer Fame-Schwelle öffnet sich Stage 3; deren Inhalte bleiben geheim. Der konkrete Vorschlag für die Schwelle steht unten bei den Dot-Systementwürfen.

#### 2.6

- [ ] **Zusammenspiel und Balancing.** Regulären Lauf ab Minute 30, Verteilung der Eier, Brut über mehrere Runs, beide Missionswege und den Weg zur Fame-Schwelle testen. Kein Pflichtgrind durch ein einzelnes seltenes Ei. Erfolgsmaßstab: frühe sichtbare Ranch-Fortschritte, später echte Berufswahl und weiterhin fordernde manuelle Missionen.

## Vorschläge vom Dot

### Stage 2 · Systementwürfe zur Pferteranch

- **Missionen:** Als erste Ziele einen Weinberg (Wein) und einen Dorfmarkt (Käse) nutzen. Zum Start eine Ausfahrt pro Ranch. Ausgesandte Pfohlen können währenddessen nicht trainieren. Handspiel bietet Kontrolle und einen Leistungsbonus; Aussenden liefert verlässliche Grundbeute.
- **Level und Skills:** Stufen 1–10, steigender EP-Bedarf und ein Skillpunkt pro Stufe; Berufswahl ab Stufe 3. Käse bezahlt Training und gibt EP, Wein schaltet ausgewählte Skillränge frei. Seltenheit gibt Startneigungen, sperrt Berufe aber nicht.
- **Berufe:** Voltigierhengst erleichtert Ausweichen und schnelle Ausfahrten; Bauarbeiterhengst erhöht Tragkraft und öffnet Hindernis-Abkürzungen; Bauerhengst verbessert verlässliche Käse-Ausbeute; Currywurststandhengst macht Vorräte zu Proviant für die nächste Ausfahrt. Je ein Einstiegsskill und ein späterer Spezialeffekt.
- **Fame:** Testwerte: +3 pro geschlüpftem Pfohlen, +10 je Pfohlen beim ersten Berufsmeilenstein, +8 pro erstmals gemeistertem Missionsziel. Keine Gutschrift für wiederholte gleiche Meilensteine. Stage-3-Schwelle als Testwert: 100 Fame, drei ausgebildete Pfohlen, mindestens zwei Berufe. Fortschritt zeigen, Stage 3 selbst geheim lassen.

### P1 · Schwierigkeit und Lesbarkeit

#### 3.1

- [ ] **Boss-Balancing mit drei Builds prüfen.** Sultan und Pascha jeweils mit frischem, typischem und starkem Build unter vergleichbaren Bedingungen testen. Zeit bis zum Sieg, verlorene Herzen und ausgespielte Angriffsmuster erfassen. In 1.1.4 ergeben fünf Ränge Käsereifung allein rund 2,93× statt 1,76× Schaden; ob dadurch ganze Bossphasen entfallen, ist noch nicht im Spiel belegt. Falls das regelmäßig passiert, zuerst Ausreißer oder gezielte Angriffsmuster anpassen. Wertvolle Power-ups erhalten; Gegnerleben nicht pauschal erhöhen. Reproduzierbarer Vergleich und gezielte Sultan-Anpassung sind in der Architektur dokumentiert.

#### 3.2

- [ ] **Basar und Großwesir lesbarer inszenieren.** Einen 20-Sekunden-Vergleich mit Einflug, sichtbarem Ausholen und Armbruch bauen. Die Flugbahn bleibt kontrastarm, der gebrochene Arm am Boss sichtbar. Beim Laser einen schmalen hellen Kern mit transparenter Außenkante erproben. Ziel: Gefahr und Trefferfortschritt bleiben ohne Ton und bei halber Fenstergröße erkennbar. Einflug, Ausholen und Armbruch in drei stummen Chromium-Szenen bei halber Größe geprüft.

#### 3.3

- [ ] **Ansturm in eine Käsekiste locken.** Vorschlag: In einer einzelnen Basarwelle hängt eine optional erreichbare Käsekiste. Pfert stellt sich vor die Kiste, lässt einen Gegner seine Position erfassen und weicht seitlich aus. Nur dessen festgelegter Ansturm bricht die Kiste auf und gibt einen Schutzschild für den laufenden Run frei. Die Kiste selbst verursacht keinen Kontaktschaden; Kistenrisse und Ansturmzeichen erklären die Gelegenheit ohne Spielfeldtext. Einfache Ausweichroute offenlassen, keine Zusatztaste und keine weiteren Spawns. Erster Umfang: eine Kiste, ein bestehendes Flugprofil, ein bereits vorhandener Schild-Drop. [Ansturm in Pfert](ARCHITEKTUR.md) · [Arcade-Inspiration: Gegner als Vorteil in Darius Gaiden](https://store.steampowered.com/app/1638330/Darius_Cozmic_Collection_Arcade/).

### P2 · Übung und Wiederspielwert

#### 4.1

Großwesir-Training · Auf Wunsch in 1.1.7 entfernt.

#### 4.2

- [ ] **Bestlauf pro Basisskill in der Rundenauswertung.** Neben der bestehenden gemeinsamen Punktetafel anzeigen, wie viel länger der aktuelle Lauf gegenüber der bisherigen Bestzeit desselben Basisskills war. Arcade und Zugabe getrennt vergleichen; ältere Einträge ohne Basisskill nicht falsch zuordnen. Speicherung, Trennung und alte Einträge lokal geprüft.

#### 4.3

Sternenpost-Kurierlauf · Auf Wunsch in 1.1.7 entfernt.
