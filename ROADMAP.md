# Pfert – Testfeedback vom 11.11.2026

Diese Übersicht hält die geplanten Änderungen und ihren Fortschritt fest. Ein Punkt wird erst nach Umsetzung und Prüfung abgehakt. Teilfortschritt und offene Entscheidungen stehen direkt beim jeweiligen Punkt. Die Modell- und Reasoning-Empfehlungen sind Ausgangspunkte und können je nach Verfügbarkeit und tatsächlicher Schwierigkeit angepasst werden.

## XP-Orbs · 20.11.2026

- [x] **Ansaugreichweite:** XP-Orbs fliegen nur innerhalb des Magnetradius zum Pferd. Außerhalb driften sie nach links. Grundradius, Korkenzieher und getrennte Flaschenreichweite sind mit gezielten Orb-Assertions geprüft.

## Grafikpolitur · 20.11.2026

- [x] **Startbildschirm und Menüs:** Neuer Pixel-Schriftzug, animiertes Pfert vor dem Bosporus-Panorama, größerer 16:9-Spielrahmen und neu gestaltete Karten und Pause.
- [x] **Darstellung im Spiel:** Eigene Lichtstimmung pro Schauplatz, dezente Pixelpartikel hinter der Spielebene, Flugspur am Pfert, Boss-Funken und neu gefasste Statusanzeigen. Bestehende Zeichenreihenfolge für Gefahren bleibt erhalten.
- [x] **Technische Prüfung:** Asset- und Fallback-Pfade, HUD und Geschossmerkmale, Gegner- und Boss-Zeichenpfade, Eingaben sowie Pause und Kartenwahl gezielt geprüft. Die Startseite verweist auf vorhandene lokale Assets und eindeutige Bedienelemente.
- [x] **Detaillierte Bosporus-Parallax:** Transparente Uferhäuser und Basar-Terrassen scrollen in getrennten Ebenen vor dem Panorama. Asset-Laden, Scrollversatz, Kachelanschluss und unabhängige Ersatzgrafiken sind mit `node test-assets.cjs` geprüft.
- [x] **Talentbaum im Arcade-Look:** Bosporus-Karte mit Pfert-Motiv, farbigen Talentabzeichen sowie goldenen und gestrichelten Pfaden. Detailtafel zeigt Effekt, Rang und Kaufstatus. Zoom, Kauf, Rückkehr zum Menü und Controller geprüft.
- [ ] **Browser-Spieltest:** Übergänge und Kontrast der neuen Parallax-Ebenen, Startbildschirm und Talentbaum bei unterschiedlichen Fenstergrößen und die Lesbarkeit im dichten Kampf beurteilen.

## Neues Spieltest-Feedback · 18.11.2026

1. [x] **Astra 6.2 · High – Schalke-Fan:** Der Fußball wechselt sich mit Zielnadeln und Splitterkugeln ab und kann zweimal an den oberen und unteren Feldgrenzen abprallen. Angriffsfolge und Zeichnen sind geprüft.
2. [x] **Astra 6.2 · High – Power-ups bei Bossen:** Noch nicht eingesammelte Flaschen behalten Position und Alter. Sie erscheinen nach dem Hauptboss oder beim Rückwechsel aus dem Ruhrpott wieder. Aufbewahrung und einmaliges Einsammeln sind geprüft.
3. [x] **Astra 6.2 · High – Angriffe für alle Gegner:** Simit und der zweite Gegnertyp dürfen beim ersten Auftreten feuern. Heckfledermäuse schießen in Flugrichtung und Blocker feuern auf zwei Bahnen. Reguläre Typen, Sondergegner und Bossangriffe sind automatisiert geprüft.
4. [x] **Astra 6.2 · High – Klarere Benutzeroberfläche:** Statusleiste mit getrennten Anzeigen für Leben, Käserausch, Talentpunkte, Karten und Rundenscore. Die technische Zeichenprüfung ist abgeschlossen. Lesbarkeit im Kampf prüft der Nutzer.
5. [x] **Sol 6.2 · High – Talentnamen:** Alle 210 sichtbaren Knoten haben einen deutschen Namen. Detailansicht, Tooltip und zugängliche Beschriftung verwenden ihn.
6. [x] **Sol 6.2 · High – Talent-Icons:** Alle 210 Knoten haben ein lokal mitgeliefertes Tabler Icon. Rang, Kaufstatus und Auswahl sind gekennzeichnet. Die praktische Lesbarkeit beim Zoomen bleibt offen.
7. [x] **Sol 6.2 · High – Talentpunkte im Run:** Die obere Leiste zeigt die in dieser Runde erhaltenen Zeit- und Bosspunkte. Die unmittelbare Aktualisierung ist geprüft.
8. [x] **Astra 6.2 · High – Standardschuss nach schnellem Verbrauch:** Zehn schnelle Sonderangriffe leeren den Balken vollständig. Der letzte Angriff verwendet den Wein bis zur Auslösung. Der Standardschuss übernimmt spätestens im Intervall seiner regulären Feuerrate.
9. [x] **Astra 6.2 · High – Durchgängiges automatisches Schießen:** Auch bei einem vollen Projektilpool bekommt ein neuer Hauptschuss Platz. Wechsel nach Verbrauch oder natürlichem Ablauf sind für Fächer, Laser und Vortex geprüft.
10. [x] **Astra 6.2 · High – Fehler beim Zeichnen eines Gegners:** Seltenen Gegnern fehlte die Bewegungsphase. Die Höhe wurde dadurch ungültig und die Aufladegrafik des Impulsstrahls brach beim Radialgradienten ab. Initialisierung und Zeichenprüfung mit endlichen Koordinaten sind umgesetzt.
11. [x] **Astra 6.2 · High – Talentpunkte während des Runs speichern:** Zeit- und Bosspunkte werden bei Vergabe gespeichert. Das Rundenende verbucht die verbleibende Spielzeit. Geprüft sind Laden, Rundenzähler, doppelte Vergabe und die unveränderte Behandlung von Debug-Runden.

Alle 15 Testsuiten in `node test-all.cjs` bestanden. Browser-Spieltest und praktische Balanceprüfung stehen aus.

## Nächste Überarbeitung der Gegnerangriffe

- [x] **Fliegender Teppich und drei weitere Blocker:** Der bisherige Blocker hat eine gewellte Pixelgrafik mit gewebtem Muster und Fransen. Die Basarlaterne kommt von rechts und sinkt, der Messingvogel kommt von links und steigt, die Gewürzbarke kommt von rechts und zieht nach unten und wieder hoch. Die drei neuen Blocker wiederholen sich in gemischter Reihenfolge. Nach ihrem ersten Zeitfenster von 95 bis 120 Sekunden wird nach jedem Auftritt eine Pause von 65 bis 95 Sekunden gezogen. Blocker erscheinen einzeln im Hauptspiel außerhalb von Bosskämpfen. `node test-encounters.cjs` prüft Zeichnen, Eintritt, Höhenwechsel, Kontakt, Treffer und Abflug.
- [ ] **Blocker im Browser spielen:** Lesbarkeit der Pixelgrafiken und Ausweichbarkeit bei dichtem Gegneraufkommen prüfen.

- [x] **Zwei Angriffe pro Boss.** Alle sieben Bosse wechseln zwischen zwei Angriffstypen. Vorstoßwarnung und versetzte Salven der zweiten Phase bleiben Teil der jeweiligen Angriffe. Der Wechsel wurde automatisiert geprüft.

- [x] **Zehn seltene Gegner:** Eigene Pixelgrafiken und je ein angekündigter Angriff. Im Hauptspiel ersetzt nach 120 bis 145 Sekunden ein Sondergegner einen regulären Spawn. Nach jedem Auftritt wird der Cooldown neu gezogen. Pro Runde wird die Reihenfolge gemischt. Alle zehn Typen erscheinen einmal pro Durchgang durch die Liste, danach wird neu gemischt. Reihenfolge, Cooldown, Spawns, Angriffe und Sprite-Zeichenpfade sind automatisiert geprüft. Der visuelle Browser-Spieltest steht aus.

- [x] **Eigene Grafiken für Pfert-Geschosse.** Der transparente Atlas `assets/player-projectiles-v1.png` enthält 16 Motive für Standard-, Waffen- und Zusatzgeschosse. Der aufgeladene Standardschuss nutzt sein Motiv aus dem bisherigen Effektatlas. Port-Laser und Gewitterkanone erhalten unterschiedliche Grafiken am Strahlausgang. Atlas-Laden, Zuschnitte und Canvas-Fallback sind automatisiert geprüft. Die Lesbarkeit im laufenden Spiel bleibt praktisch zu beurteilen.

- [x] **Kleinste Gegnergeschosse vergrößert.** Zielnadeln und Splitter mit 8 Pixeln Trefferbreite werden 50 % größer gezeichnet.

- [x] **Gegnerische Geschosse besser sichtbar machen.** Geschossformen größer zeichnen und je nach Typ mit einem dezenten warmen Leuchtschein versehen. Der Impulsstrahl wird dicker gezeichnet. Trefferflächen folgen der bisherigen Spielmechanik. Warnmarkierungen sind automatisiert geprüft, die Sichtbarkeit im Spiel bleibt praktisch zu beurteilen.

- [x] **Power-up-Weine fliegen von rechts ein.** Zufällige Weine und der garantierte erste Waffenwein starten vollständig außerhalb des rechten Bildschirmrands und sind auf ihrer Flugbahn einsammelbar. Eintritt und Aufsammeln des garantierten Weins sind automatisiert geprüft.

- [x] **Gegnerdichte von 25 auf 150 pro Minute neu abstimmen.** Die erste Minute hat 25 fest geplante Gegner. Die reguläre Spawnrate steigt linear bis Minute 20 und bleibt anschließend bei 150 pro Minute. Sonderwellen folgen ihrem eigenen Zeitplan und reguläre Spawns pausieren bei Bosskämpfen. Einstieg, Kurvenwerte und Basarwellen sind automatisiert geprüft.

- [x] **Gegner-Spawnrate verdoppelt.** Die zeitabhängige Spawnrate nutzt zusätzlich den Faktor 2. Die Basarwellen erreichen ihre Obergrenze von 27 Gegnern. Im simulierten 20-Minuten-Hauptlauf mit 60 Sekunden Kampfzeit je Boss und ohne Abstecher erschienen 2780 Gegner und vier Bosse. Basarwellen und Bossübergang sind geprüft.

- [x] **Gegner-Spawnrate um weitere 20 % erhöht.** Die bestehende Dichtekurve für Hauptspiel, Basar und Ruhrpott-Abstecher nutzt zusätzlich den Faktor 1,2. Die Basarwellen umfassen jetzt 26 statt 22 Gegner. Gegnerwellen, Wellenbonus und Übergang zum ersten Boss sind automatisiert geprüft.

- [x] **Gegner-Spawnrate um weitere 10 % erhöhen.** Die bestehende Dichtekurve für reguläre Spawns im Hauptspiel, Basar und Ruhrpott-Abstecher mit 1,1 multiplizieren. Fest geplante Auftritte folgen ihren bisherigen Zeitplänen. Der automatisierte Vergleich bestätigt die höhere Spawnrate und 22 statt 20 Gegner in den Basarwellen. Der Gesamttest scheitert weiterhin an der Prüfung des Bossvorstoßes. Der separat ausgeführte Waffentest scheitert weiterhin am erwarteten Standardschaden pro Sekunde.

1. [x] **Wiederkehrende Gegner von hinten.** Den einzelnen Basar-Auftritt durch kleine Gruppen ersetzen, die im Hauptspiel in wechselnden Abständen vom linken Rand einfliegen. Die Gruppen erscheinen wie reguläre Gegner. Text, Pfeile und Vorwarnung der bisherigen Heckwelle entfallen. Eintrittshöhen so wählen, dass auch am linken Bildrand eine Ausweichmöglichkeit bleibt. Start, Wiederholung, Ausweichen und die Übergänge zu Bosskämpfen prüfen.
2. [x] **Kartengeschosse um 70 % abschwächen.** Zusatzgeschosse von Doppelter Käse und Streuflug verursachen 30 % des Schadens der entsprechenden Hauptgeschosse. Käsebruch-Splitter verursachen 30 % des auslösenden Treffers. Das gilt auch für Kartenkopien von Sonderangriffen und Lasern. Pro Geschoss den passenden Faktor einmal anwenden. Waffeneigene Splitter behalten ihren eigenen Schadenswert. Kartentexte anpassen. Einzeltreffer und Kartenkombinationen automatisiert prüfen.
3. [x] **Flugbahnanzeige entfernen.** Bei normalen Gegnern und Bossen die schwarz-gelbe Vorschau gezielter Geschosse entfernen. Die frühzeitige Zielfestlegung und die Warnung vor dem körperlichen Vorstoß des Großwesirs bleiben bestehen. Prüfen, dass sich die Geschossrichtung nach dem Abschuss weiterhin vorhersehbar verhält.
4. [x] **Sechs gegnerische Schusstypen einführen.** Jeder Typ erhält eine erkennbare Silhouette und ein eigenes Flug- oder Angriffsmuster. Pro Boss ein Hauptmuster und optional ein zweites für seine nächste Phase auswählen. Standardgegner nutzen schwächere Varianten derselben sechs Typen. Dafür je nach Typ die Zahl der Geschosse, den abgedeckten Raum, die Reichweite oder die Angriffshäufigkeit reduzieren.

| Schusstyp | Verhalten | Boss |
| --- | --- | --- |
| Zielnadel | Schneller gerader Schuss auf eine festgelegte Position | Großwesir |
| Kurvensichel | Geschoss biegt in einem festen Bogen ab | Sultan der Kaffeekessel |
| Splitterkugel | Teilt sich nach einer kurzen Flugzeit in mehrere Geschosse | Pascha der Sucuk |
| Mörsergeschoss | Steigt erst auf und fällt anschließend in einem Bogen | Hochofen-Horst |
| Treibmine | Driftet langsam und gibt nach kurzer Zeit einen kleinen Ring ab | Dschinn der Gewürzmühle |
| Impulsstrahl | Kurzer Strahl mit Aufladeeffekt an der Quelle | Großmeister der Basarkarawane |

Der Schalke-Fan wechselt von Zielnadeln zu Splitterkugeln. Heckgruppen erscheinen im achtminütigen Zyklus bei 1:53, 4:28 und 6:37, sofern gerade weder ein Bosskampf noch ein Abstecher läuft. Die beiden Gegner starten mit Höhenabstand zum Pfert. Alle neun Testsuiten in `node test-all.cjs` bestehen. Geprüft sind wiederkehrende Heckgruppen, Kartenschaden, Zielbindung, die sechs Schusstypen und die Bossübergänge. Lesbarkeit und Schwierigkeit bleiben im Browser zu beurteilen.

## Heckwelle, Schussvorschau und Blocker · 18.11.2026

- [x] **Heckwelle im Großen Basar:** Ab 4:26 markieren Pfeile am linken Rand die beiden Eintrittshöhen. Bei 4:28 greifen zwei schnelle Fledermäuse einmal pro Runde von links an. Sie ziehen nach rechts und verfolgen das Pfert vertikal, solange sie hinter ihm sind. Ein Höhenwechsel schafft Abstand. Rückendeckung und Käserausch treffen die Angreifer über die bestehenden Kampfregeln.
- [x] **Vorhersagbare Feindgeschosse:** Gegner und Bosse zeigen kurz vor einer Salve den Anfang einer repräsentativen Flugbahn als gestrichelte Linie. Gezielte Salven legen ihr Ziel zu Beginn der Vorwarnung fest. Abgefeuerte Geschosse folgen ihrer festen Flugbahn. Startgeschwindigkeit und Schwerkrafteinfluss steigen gegenüber dem vorherigen Stand um jeweils 10 %.
- [x] **Langsame Blocker:** Im Hauptspiel erscheinen in unregelmäßigen Abständen große gepanzerte Gegner, erstmals bei 1:08. Pro Auftritt blockiert ein Gegner mit 330 × 210 Pixeln rund 13,4 % des Spielfelds. Er zieht auf wechselnder Höhe langsam nach links, kann abgeschossen werden und verschwindet spätestens nach 15 Sekunden. Die jeweils andere Höhenzone bleibt passierbar. Die Auftritte finden außerhalb aktiver Bosskämpfe und Abstecher statt.

Dieser Abschnitt dokumentiert den früheren Stand. Die neue Überarbeitung ersetzt Heckwarnung und Flugbahnvorschau und ergänzt den bisherigen Blocker um drei Varianten. Die damaligen automatisierten Tests prüften die Vorwarnung und Einmaligkeit der Heckwelle, Treffer durch Rückendeckung, Zielbindung und Geschosstempo sowie Größe, Wechsel der Höhenzone und Ablauf der Blocker. Lesbarkeit der Hinweise und Ausweichbarkeit im Kampf prüft der Nutzer im Browser.

## Weiteres Spieltest-Feedback vom 18.11.2026

- [x] **Gegner-Spawnrate:** Die aktuelle Spawnrate über die gesamte Gegnerdichte-Kurve um 15 % erhöhen. Den Anstieg über die Hauptspielzeit auch bei Basarwellen und Abstechern berücksichtigen. Die Bossauftritte folgen ihrem eigenen Zeitplan.
- [x] **Käserausch:** Die Dauer um 50 % erhöhen, von 8 auf 12 Sekunden ohne Talente. Die bestehenden Dauerboni auf die neue Basis anwenden. Während des Käserauschs zusätzlich nach hinten, oben und unten schießen.
- [x] **Erfahrungsorbs:** Gegnertypen drei Schwierigkeitsklassen zuordnen. Einfache Gegner lassen blaue Orbs fallen, mittlere grüne und schwere rote. Jede Kugel gibt beim Einsammeln das 1,5-Fache ihrer bisherigen XP. Die Multiplikation genau einmal zusätzlich zu den bisherigen XP-Regeln anwenden.
- [x] **Schlangenlinie:** Die Schwingamplitude der durch die Karte veränderten Geschosse um 15 % verringern. Die Verringerung gilt für jeden Kartenrang.
- [x] **Vorstoß des Großwesirs:** Die Warnlinie während der gesamten Vorwarnzeit sichtbar halten. Die Zeichenreihenfolge und den Kontrast so abstimmen, dass die Linie auch bei vielen Geschossen, Treffereffekten und auf hellen Hintergründen erkennbar bleibt.
- [x] **Bossleben:** Die Lebenspunkte regulärer und geheimer Bosse gegenüber dem aktuellen Stand um etwa 10 % senken. Den Faktor auf die Segmentlebenspunkte anwenden und das Gesamtleben aus deren Summe ableiten.

Umgesetzt und mit allen neun Testsuiten in node test-all.cjs geprüft. Die Gegnerklassen folgen den bisherigen Basis-XP (1 blau, 2 grün, ab 3 rot). Boss-Orbs sind rot. Die Erkennbarkeit der Warnlinie und der Orb-Farben prüft der Nutzer im Browser.

## Spieltest-Feedback vom 18.11.2026

Diese neuen Anforderungen ändern die bisherigen Vorgaben zu Waffen und Darstellung. Alle Prozentangaben beziehen sich auf den Stand vor dieser Änderung. Das Spieltest-Feedback ist umgesetzt. Die praktische Abnahme im Browser steht aus.

### 1. Bewegung und Angriffstempo

- [x] **Sol 6.2 – High:** Bewegungsgeschwindigkeit des Pferdes um 15 % erhöhen, einschließlich bestehender Boni und Steuerungsarten. Angriffe des Pferdes um 50 % schneller machen. Als Ausgangspunkt die Feuerrate mit Faktor 1,5 umsetzen, also die Intervalle durch 1,5 teilen. Normale und automatische Waffenangriffe sowie relevante Sonderangriffe prüfen. Schaden pro Treffer bei allen Angriffen des Pferdes um 50 % gegenüber dem bisherigen Stand reduzieren, einschließlich automatischer Waffen und Sonderangriffe. Vorhandene Schadensboni und Kombinationen entsprechend berücksichtigen. Rechnerisch ergeben 1,5-fache Feuerrate und halber Trefferschaden bei gleichbleibender Trefferquote 75 % des bisherigen Schadens pro Sekunde.
- [x] **Sol 6.2 – High:** Gegnerische Angriffe um 30 % beschleunigen. Als Ausgangspunkt die Fluggeschwindigkeit gegnerischer Geschosse mit Faktor 1,3 multiplizieren und dabei Gegner- und Bossangriffe einschließlich gezielter, gebogener und fallender Geschosse berücksichtigen. Feuerrate und Gegnerleben erhalten. Prüfen, ob Beschleunigung und Lebensdauer der Geschosse zu ihrem Verhalten passen.
- **Prüfung:** Bewegung, Feuerrate und Geschwindigkeiten mit und ohne Boni sowie Boss- und Gegnerangriffe mit `node test-game.cjs` prüfen. Spielgefühl und Ausweichbarkeit beurteilt der Nutzer.

### 2. Power-up-Übersicht

- [x] **Astra 6.2 – High:** Rechts in der oberen Statusleiste gesammelte Power-up-Karten mit eindeutiger, stabiler Kurzkennung und Rang anzeigen. Möglichst je ein Buchstabe, bei mehr Karten als verfügbaren Buchstaben eindeutige kurze Kombinationen verwenden. Eine im Spiel zugängliche Zuordnung zu den Kartennamen vorsehen, damit sich Builds nachstellen lassen. Wiederholbare Karten und Platzbedarf bei vielen unterschiedlichen Karten berücksichtigen; bestehende Anzeigen lesbar halten.
- **Prüfung:** Auswahl, wiederholte Ränge, Neustart und umfangreiche Kombinationen mit `node test-game.cjs` und `node test-progress.cjs` prüfen. Lesbarkeit im Browser prüft der Nutzer.

### 3. Kälte und Zielverfolgung

- [x] **Astra 6.2 – High:** Wiederholte Kältetreffer verstärken die Verlangsamung zusätzlich. Stapelung, sinnvolle Obergrenze und Ablauf so festlegen, dass Gegner nicht dauerhaft bewegungsunfähig werden. Bestehende Kältequellen, Kombinationen und Bosssegmente berücksichtigen. Die Stapelung wirkt auf das verbleibende Tempo und bremst höchstens um 65 %. Ein Kältetreffer verlängert die Wirkung auf mindestens 1,8 Sekunden, zuzüglich Dauerboni.
- [x] **Sol 6.2 – High:** Die Lenkstärke der eigenen Zielverfolgung durch das Power-up Spürnase gegenüber dem bisherigen Wert um etwa 30 % reduzieren. Bestehende Ränge und Kombinationen einschließlich automatischer Geschosse und Laser berücksichtigen.
- [x] **Astra 6.2 – High:** Suchende eigene Angriffe sollen lebende Bosssegmente anvisieren, wenn die Mitte zerstört ist. Geeignete Trefferpunkte der verbleibenden Segmente verwenden, bei Zerstörung ein anderes lebendes Segment wählen und bestehende Trefferregeln berücksichtigen. Geschosse und zielverfolgende Laser prüfen.
- **Prüfung:** Mehrere Kältetreffer, Obergrenze und Ablauf sowie Zielwechsel bei zerstörten Segmenten mit `node test-game.cjs` und `node test-meta-game.cjs` prüfen. Praktische Stärke beurteilt der Nutzer.

### 4. Parallax-Hintergründe

- [x] **Sol 6.2 – High:** Die Parallax-Ebenen sichtbar und deckend zeichnen. Einen grauen Nebel über den fertig gezeichneten Hintergrund legen, um ihn gegenüber Spielfiguren und Gefahren zurückzunehmen. Versetzte Bewegung, vorhandene Assets und prozedurale Fallbacks für die betroffenen Hintergründe erhalten; Nebel hinter Spielfiguren und Geschossen platzieren.
- **Prüfung:** Asset- und Fallback-Abläufe mit `node test-assets.cjs` und `node test-game.cjs` prüfen. Deckung, Nebelstärke und Kontrast beurteilt der Nutzer im Browser.

### 5. Großwesir und Gegnerdichte

- [x] **Astra 6.2 – High:** Beim angekündigten Vorstoß des Großwesirs einen Bewegungsbereich ermöglichen, der 75 % der Spielfeldbreite umfasst. Ausgangsposition, Bewegungsgrenzen und Rückkehr festlegen; Angriff früh erkennbar und ausweichbar gestalten. Bestehende Bosssegmente und Phasen berücksichtigen.
- [x] **Gegnerdichte:** Die Spawnrate startet bei 50 % des bisherigen Werts und steigt linear mit der Hauptspielzeit. Nach 15 Minuten liegt sie bei 75 %, nach 30 Minuten bei 100 %. Der Basar nutzt dieselbe Kurve und behält alle vier Wellengruppen. Abstecher übernehmen die erreichte Dichte.
- **Prüfung:** Vorwarnung, Vorstoß und Rückkehr sowie reduzierte Spawnrate am Anfang und den Anstieg während der Runde mit `node test-game.cjs` prüfen. Den tatsächlichen Schwierigkeitsgrad beurteilt der Nutzer.

Nach Umsetzung der übergreifenden Änderungen `node test-all.cjs` ausführen. Browser-Spieltests übernimmt der Nutzer. Teilweise erledigte Aufgaben offen lassen und Ergebnisse dokumentieren.

## Entwicklungsziele: 16-Bit-Shoot-'em-up

Grundlage: [Implementierungsroadmap für das bestehende Shoot-’em-up](https://chatgpt.com/library?file_id=libfile_62a946b4f4688191852a4e11b6f7842a&account_id=personal). Diese Ziele ergänzen die übrige Roadmap; sie ersetzen keine offenen Aufgaben. Die Modellzuordnung ist eine Empfehlung, keine Voraussetzung.

**Rahmen für alle Ziele:** Bestehendes Canvas-Browserspiel und Start über `index.html` beibehalten. Waffen, Schildsystem und Eingaben nicht verändern. Keine kollidierende Landschaft, Alternativrouten, Videoaufnahmen oder aufwendige Schussbahn-Testreihen. Gelände ist Kulisse; ein Engine-Wechsel gehört nicht zum Umfang. Vor jedem Ziel den aktuellen Stand prüfen und bereits vorhandene Funktionen übernehmen. Bestehende Speicherstände und andere Spielabläufe erhalten. Für betroffene Abläufe die kleinste notwendige Prüfung anhand der README auswählen. Den Gesamttest auf ausdrückliche Anforderung ausführen. Visuelle Spieltests und Hörproben übernimmt der Nutzer. Erst nach Umsetzung und Prüfung abhaken; nicht geprüfte Aspekte offen dokumentieren.

Die Vorlage setzt eine feste Stage voraus; Pfert besitzt derzeit ein zeitbasiertes Hauptspiel mit geheimen Abstechern und Bossen. Daher wird zunächst ein geeigneter bestehender Abschnitt ausgewählt und sein Ablauf geklärt. Keine neue feste Spielstruktur oder Wiedereinstiegsmechanik voraussetzen.

### Ziel 1 – Abschnitt und Umsetzung festlegen

- [x] **Astra 6.2 · High:** Spielablauf, Zeichenreihenfolge, Gegner, Bossphasen und vorhandene Schutz- bzw. Wiederaufnahmeregeln im Code aufnehmen. Einen bestehenden Abschnitt einschließlich zugehörigem Boss für die folgenden Ziele vorschlagen; seine Grenzen, vorhandene Mechaniken und Auswirkungen auf Hauptspiel und Abstecher dokumentieren. Klären, wie eine erkennbare Wellenfolge zur bestehenden Zeitsteuerung passt, ohne die übrige Runde unbeabsichtigt umzubauen. Eine grundlegende Änderung der Spielstruktur vor Umsetzung gesondert mit dem Nutzer abstimmen.
  - Umgesetzt: Die letzte Minute im Großen Basar beginnt bei 4:00 und führt zum ersten regulären Boss bei 5:00. Die Wellen nutzen die bestehende Hauptspieluhr in `updateGameplay`. Kartenwahl, Abstecher und Übergänge pausieren sie. Die reguläre Gegnererzeugung setzt nach dem Sieg wieder ein; die Ruhrpott-Auslöser bleiben bei 7:00 und 14:00 Hauptspielzeit. `render` und `PfertArt` steuern die Zeichenreihenfolge; `updateBoss` nutzt die vorhandenen Segmente. Trefferblitze und Trefferschutz waren bereits vorhanden.
- **Ergebnis:** Kurzer umsetzbarer Abschnittsplan mit betroffenen Codebereichen, Abhängigkeiten und erkennbar bereits erfüllten Anforderungen; keine Implementierung vorwegnehmen.
- **Prüfung:** Code und vorhandene Tests gegen den Plan abgleichen; Annahmen und offene Entscheidungen nennen.

### Ziel 2 – Geschosse und Treffer erkennbar machen

- [x] **Sol 6.2 · High** nach Ziel 1: Zeichenreihenfolge im gewählten Abschnitt so anpassen, dass gegnerische Geschosse vor Explosionseffekten sichtbar bleiben. Vorhandenes Trefferaufblitzen oder vorhandenen Ton nutzen; nur erkennbare Lücken schließen. Darstellung von Waffen und Schildfunktion unverändert lassen.
  - Umgesetzt: Feindgeschosse werden nach Explosionen, Partikeln und Trefferblitzen gezeichnet. Bestehende Trefferblitze für Gegner und Bosssegmente sind automatisiert geprüft. Offen: Lesbarkeit im dichten Kampf.
- **Akzeptanz:** Feindgeschosse werden nach Explosionseffekten gezeichnet; getroffene Gegner geben ein kurzes Signal. Vorhandenes Bosssegment-Trefferfeedback bleibt erhalten.
- **Prüfung:** Relevante Zeichen- und Trefferabläufe sowie `node test-game.cjs`, bei Soundänderungen auch `node test-sound.cjs`. Lesbarkeit im dichten Kampf durch Nutzer offen.

### Ziel 3 – Gegnerrollen und Wellenfolge

- [x] **Astra 6.2 · High** nach Ziel 1: Bestehende Gegner und Angriffe für gezielten Schützen, kreuzenden Gegner und Flächensperrer prüfen und geeignet einsetzen. Rollen zunächst einzeln, anschließend kombiniert im ausgewählten Abschnitt auftreten lassen; vorhandene Zeitsteuerung und Wechsel berücksichtigen. Scrolltempo nur anpassen, wenn der Bestand dies für die gewählte Folge erfordert.
  - Umgesetzt: Messingkanne (gezielter Schütze), Säbelteppich (kreuzender Angreifer) und Janitscharen-Kessel (Flächensperrer) treten einzeln und anschließend gemischt auf. Die festen Spawn-Zeiten, der natürliche Bossstart und die Rückkehr zur regulären Gegnererzeugung sind automatisiert geprüft. Offen: Rhythmus und Ausweichbarkeit.
- **Akzeptanz:** Die Abfolge ist nachvollziehbar im Code definiert, die Rollen nutzen vorhandene Mechaniken und der übrige Spielablauf bleibt funktionsfähig. Keine Änderungen an Spielerwaffen oder Eingaben.
- **Prüfung:** Start, Reihenfolge, Übergang und Rückkehr des betroffenen Abschnitts mit passenden bestehenden Tests, insbesondere `node test-game.cjs`; Ausweichbarkeit und Rhythmus im Spiel durch Nutzer prüfen.

### Ziel 4 – Erholung nach einem Fehler

- [x] **Sol 6.2 · High** nach Ziel 3: Vorhandene Abläufe nach Treffer, Schutzzeit und gegebenenfalls Wiedereinstieg prüfen. Nur falls die Wellenfolge unmittelbar danach überfordert, deren Platzierung oder Abfolge anpassen. Keine neue Wiederaufnahme und keine Änderung des Schildsystems einführen.
  - Geprüft: Nach einem nicht tödlichen Treffer schützt die bestehende Unverwundbarkeit; Wellen und Runde laufen weiter. Die Abstände zwischen den Gruppen und vor dem Boss geben Zeit zur Neuorientierung. Offen: praktische Erholung im Kampf.
- **Akzeptanz:** Spiel kann nach einem nicht tödlichen Treffer regulär fortgesetzt werden; vorhandene Schutz- und Lebensregeln bleiben bestehen. Falls keine Änderung nötig ist, Befund und Prüfung dokumentieren.
- **Prüfung:** Treffer, Schutzzeit und Fortsetzung mit `node test-game.cjs`; tatsächliche Erholungsmöglichkeit durch Nutzer beurteilen.

### Ziel 5 – Boss mit zwei lesbaren Phasen

- [x] **Astra 6.2 · High** nach Zielen 1 und 3: Vorhandenen Boss des gewählten Abschnitts verwenden. Phase eins greift ein bekanntes Angriffsmuster auf; Phase zwei kündigt einen Positionswechsel an und bietet ein erkennbares Gegenangriffsfenster. Bestehende Segment- und Schadensmechanik erhalten.
  - Umgesetzt: Der Großwesir startet mit seiner bestehenden Salve. Bei halben Gesamtlebenspunkten kündigt ein Richtungspfeil den Positionswechsel an. Danach hält er seine Position rund 2,75 Sekunden ohne neue Salve. Segmenttreffer, Phasenwechsel, Bossende und Rückkehr zum regulären Spiel sind automatisiert geprüft. Offen: Verständlichkeit und praktische Besiegbarkeit.
- **Akzeptanz:** Phasenwechsel und angekündigter Positionswechsel sind im Ablauf erkennbar; Boss ist mit vorhandener Bewaffnung besiegbar und der anschließende Spielablauf wird erreicht.
- **Prüfung:** Phasenübergang, Segmenttreffer, Bossende und anschließenden Übergang mit `node test-game.cjs`; Verständlichkeit und praktische Besiegbarkeit durch Nutzer prüfen.

### Ziel 6 – 16-Bit-Präsentation

- [x] **Sol 6.2 · High** nach Zielen 2 und 3: Gewählten Abschnitt mit klarer Farbgestaltung, unterscheidbaren Silhouetten und versetzt scrollenden Hintergrundebenen gestalten. Vordergrund und Gefahren deutlich absetzen; vorhandene Assets und ihre Fallbacks berücksichtigen. Gelände bleibt nicht kollidierende Kulisse.
  - Umgesetzt: Der Basar kombiniert langsam scrollende Stadtkulisse und schnellere Silhouetten sowie Marktmarkisen. Die Zeichenprüfung deckt die versetzten Ebenen mit geladenem Panorama und mit prozeduralem Fallback ab. Offen: visuelle Wirkung und Kontrast im Browser.
- **Akzeptanz:** Mindestens zwei erkennbare Hintergrundebenen bewegen sich versetzt; Spielfiguren und Gefahren bleiben von der Kulisse abgesetzt. Bestehender Spielstart und Asset-Fallback funktionieren.
- **Prüfung:** Asset-Laden und Fallback mit `node test-assets.cjs`, betroffene Abläufe mit `node test-game.cjs`; visuelle Wirkung und Lesbarkeit durch Nutzer prüfen.

### Ziel 7 – Zusammenspiel und Abnahme

- [ ] **Astra 6.2 · High** nach Zielen 2–6: Änderungen gemeinsam auf Wechselwirkungen mit Hauptspiel, Abstechern, Boss, Fortschritt und Speicherung prüfen; festgestellte Fehler gezielt beheben. Keine zusätzliche Spielmechanik ergänzen.
  - Automatisierte Abnahme mit `node test-all.cjs` umfasst Basar, Boss, Abstecher, Fortschritt und Speicherung. Offen bis zur Rückmeldung aus dem Browser-Spieltest zu Lesbarkeit, Wellen, Erholung, Boss und Präsentation.
- **Akzeptanz:** Automatisierte Prüfungen bestehen; Einschränkungen und offene praktische Bewertungen sind dokumentiert. Nutzer kann den ausgewählten Abschnitt bis zum Bossende spielen und Lesbarkeit, Angriffe, Erholung und Präsentation beurteilen.
- **Prüfung:** Betroffene Abläufe gezielt prüfen. Den Gesamttest auf ausdrückliche Anforderung ausführen. Das Ziel bis zur visuellen und spielerischen Abnahme durch den Nutzer offen lassen.

**Später / optional:** Kollidierendes Terrain ist für diese Version ausgeschlossen. Ein sichtbarer Bonus für vollständig besiegte Wellen bleibt eine optionale spätere Scoring-Idee und gehört nicht zu den obigen Zielen.

### Weitere Bosskämpfe

- [ ] **Sultan der Kaffeekessel, Krasser Schalke-04-Fan und Hochofen-Horst:** Zwei Phasen mit angekündigtem Positionswechsel bei halben Gesamtlebenspunkten und 2,5 bis 2,75 Sekunden Gegenangriffsfenster. In Phase 2 feuert der Sultan gebogene Doppelschüsse, der Schalke-Fan einen gezielten Dreierfächer und Hochofen-Horst versetzte Fallgeschosse. Automatisiert sind Phasenwechsel, Angriffspause, neue Salven, Bossbelohnung und Rückkehr aus den Abstechern geprüft. Schwierigkeit und Lesbarkeit bleiben im Browser zu beurteilen.

## Offene Punkte

- [x] **Sonderwein ohne Weinwaffe:** Der Standardschuss feuert nach Aufnahme zehn Sekunden lang zusätzlich nach oben und unten. Bei aktiver Weinwaffe füllt der Sonderwein weiterhin deren Balken auf. Automatisierte Funktionsprüfung; den visuellen Spieltest übernimmt der Nutzer.

- [x] **Wein-Power-ups:** Waffenweine erscheinen bei unverändertem Drop-Timer mit 60 % geringerer Wahrscheinlichkeit. Traubenmost und Sonderwein behalten ihre bisherige Chance. Automatisiert geprüft; den Spieltest übernimmt der Nutzer.

### Soundeffekte

- [ ] **Sound verfeinern:** Kräftigeres klassisches Arcade-Retro-Sounddesign mit eigenem Klangcharakter für Waffen und Ereignisse; wichtige Ereignisse wie Schaden, Bossauftritte und Käserausch sollen im Kampf hervorstechen. Keine Musik; Ton weiterhin mit M ein- und ausschaltbar.
  - Teilfortschritt: Waffen um eine tiefere Klangschicht ergänzt, mehrere Ereignisse eigenständiger gestaltet und vier Stimmen für wichtige Ereignisse reserviert. Weiterhin synthetisch, ohne zusätzliche Audiodateien. Automatisiert: Soundausgabe, Stummschaltung, Stimmenbegrenzung und Schadenssignal bei hoher Auslastung sowie bestehende Spielabläufe geprüft (`node test-game.cjs`).
  - Überarbeitung vom 13.11.2026: Alle Waffen mit eigenen mehrschichtigen Texturen, kurzen Impulsen, Körper und Nachklang versehen; Sonderangriffe mit eigenem Bassimpuls. Dynamische Filterverläufe, artikulierte Lautstärkehüllen, variierendes Rauschen und eine leise frühe Raumreflexion ergänzen die Synthese. Wichtige Signale senken Kampfklänge kurz ab; Tonumschaltung blendet weich. Keine zusätzlichen Downloads oder Musik. Geprüft mit `node test-sound.cjs`, `node test-game.cjs` und `node test-progress.cjs`: Waffenrezepte, Sonderangriffe, Stummschaltung, Priorität und Stimmenlimits sowie Kampf und Käserausch.
  - Offen: Hörprobe im tatsächlichen Spiel durch den Nutzer; Klangcharakter, Unterschiede aller Waffen und Ereignisse, Lautstärke und Verständlichkeit bei dichten Kämpfen anhand des Feedbacks abstimmen.

### Etappe 3: Balancing

**GPT-6.1 Terra · High**

- [ ] **Bossleben, Weinanziehung und Sonderangriffe:** Bossleben um weitere 150 % erhöht und Weinanziehung begrenzt; Sonderangriffe verbrauchen den Weinbalken. `node test-game.cjs` und `node test-meta-game.cjs` nach Anpassung bestanden. Talentbeschreibungen an den Weinbalken angepasst. Offen ist die praktische Prüfung der Mechanik.

- [ ] **Gesamtbalance und Endlosphase:** Waffen-DPS automatisiert verglichen. Erfahrungsschwelle ab Stufe 10 auf 12 % Wachstum und höchstens 1500 begrenzt; Langzeitwirkung muss praktisch überprüft werden. Schadenspfade, Bosszielzeit von 45–90 Sekunden einschließlich geheimer Bosse, Käserausch-Häufigkeit, Gegner, Builds und Heilung bis Minute 30 sowie längere Endlosläufe bleiben praktisch zu erproben und abzustimmen.

### Etappe 6: Metaprogression

**GPT-6.1 Terra · Extra High**

- [x] **Talentbaum und Metaprogression:** Talentbaum mit 210 sichtbaren Knoten und mehrfach kaufbaren Verbesserungen vorsehen: fünf gemeinsame Startknoten, je drei Spezialisierungen in den Hauptbereichen Angriff, Überleben und Bewegung, Käserausch, Beute und Erfahrung sowie Waffen und Sonderangriffe und zehn Querverbindungsknoten. Weitere Unterzweige und Querverbindungen ermöglichen Mischungen. Ein Knoten setzt einen gekauften, direkt verbundenen Knoten voraus; S1 ist ohne Voraussetzung kaufbar. Alle Bereiche dürfen kombiniert und langfristig vollständig freigeschaltet werden.
  - Ausführlicher, noch ungeprüfter Entwurf: [Meta progression.md](Meta%20progression.md).
  - Neue Gestaltung: Pferdesilhouette mit räumlich durchmischten Clustern; gekaufte und direkt benachbarte Knoten werden sichtbar. Q10 „Eichelkranzkäse“ sitzt unter dem Pferd und verstärkt Schaden während des Käserauschs. Visuelle Qualität, Lesbarkeit und tatsächliche Bedienbarkeit müssen noch im Browser geprüft werden; zusätzliche ungewöhnliche Spezialknoten bleiben offen.
  - Implementierungsstand: Die Knoten einschließlich Präzision, Elementarschmiede und Querverbindungen sind angelegt und kaufbar; Wirkungen sind eingebunden, aber noch nicht einzeln vollständig gegen den Entwurf geprüft. Speicherung, Punktvergabe, Rücksetzen und die Baumansicht sind integriert. Automatisiert wurden Erreichbarkeit aller Knoten, ausgewählte Wirkungen aller Zweige, eine Kombination mit vollem Baum und die bestehenden Spieltests geprüft. Ausstehende Prüfungen: Browser-Spieltest mit Maus, Tastatur und Controller, eine umfassende Prüfung aller Einzelwirkungen und Kombinationen sowie praktische Balance und Spielzeit stehen aus.
  - Kleine Verbesserungen führen zu sichtbaren besonderen Zielen. Große Spezialknoten dürfen neue Mechaniken wie Begleiter, Blitzketten oder Explosionen einführen. Manche sind übermäßig stark und haben einen Nachteil, bleiben nach dem Kauf bis zum Zurücksetzen aktiv und müssen auch zusammen sinnvoll funktionieren. Im Käserausch-Baum schalten drei getrennte Meilensteine insgesamt höchstens drei zusätzliche Projektile während des Käserauschs frei.
  - Dauerhafte Talentpunkte für überlebte Zeit und besiegte reguläre sowie geheime Bosse vergeben. Der vollständige Ausbau soll ungefähr 20–50 Spielstunden benötigen; die Vergaberate anhand praktischer Rundenlängen abstimmen. Ein vollständig ausgebautes Pfert soll deutlich stärker sein.
  - Fortschritt lokal im Browser speichern. Eine zusammenhängende, ohne Scrollleisten verschiebbare und zoombare Baumansicht mit Maus, Tastatur und Controller bedienen. Die Talentverteilung lässt sich kostenlos zurücksetzen; der gesamte Fortschritt kann nach Bestätigung gelöscht werden.
  - Talentwirkungen, Kombinationen, Punktevergabe, Speicherung und beide Rücksetzarten prüfen; die passenden Metaprogressionstests gemäß README ausführen; den visuellen Browser-Spieltest übernimmt der Nutzer. Teilweise erledigte Punkte offen lassen und Einschränkungen dokumentieren.
  - **Noch zu prüfen und abzustimmen:** Knoteneffekte, Verbindungen, konkrete Zahlenwerte und Punktevergabe anhand des Entwurfs und praktischer Spieltests. Die spätere Balanceüberarbeitung bleibt offen.

### Etappe 7: Online-Multiplayer – Konzept

**GPT-6 Astra · High – Konzept**

Sites und die darauf aufbauende Online-Umsetzung sind auf Nutzerwunsch zurückgestellt, bis der Nutzer Sites erneut anspricht.

- [ ] **Konzept für Online-Multiplayer:** Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen. Bei schwierigen Architekturentscheidungen Extra High.
  - Architekturentwurf für bis zu vier Personen: [MULTIPLAYER-ARCHITEKTUR.md](MULTIPLAYER-ARCHITEKTUR.md). Vollständig über Sites mit Browser-Host und Sites-/D1-Vermittlung; kein separater Server oder externer Echtzeitdienst. Konzept vom Nutzer bestätigt; gehosteter Machbarkeitsnachweis für Latenz und Verbrauch steht aus.

### Etappe 8: Online-Multiplayer – Umsetzung

**GPT-6.1 Terra · High – Umsetzung**

In kleinen, einzeln geprüften Schritten nach dem Konzept.

- [ ] **Online gemeinsam spielen:** Spielen über das Internet auf getrennten Geräten ermöglichen. Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen.
  - Teilfortschritt: Privates Sites-Projekt angelegt und projektlokale Buildumgebung eingerichtet. Ein Sites-/D1-Verbindungstest für vier simulierte Teilnehmer wurde gebaut; lokal wurden vier gleichzeitige Teilnehmer, das Verwerfen veralteter Daten und ungültige Eingaben geprüft. Der Übertragungsversuch zum Sites-Quellserver scheiterte an dessen Namensauflösung. Raum-API mit bis zu vier Plätzen, Host-Berechtigung und versionsgeprüftem Zustand ergänzt; gleichzeitige Beitritte, Berechtigungen und veraltete Zustände lokal mit D1 geprüft. Sites enthält eine Kopie des Einzelspielers. Die gehostete Latenzmessung, die Verbindung der Raum-API mit dem Spiel, die Koop-Spielregeln und Veröffentlichung stehen aus.

## Abgeschlossene Punkte

### Zuletzt umgesetzt

- [x] **Lokales Scoreboard:** Die letzten zehn Rundenergebnisse lokal im Browser speichern und im Spiel als Punktetafel anzeigen. Nach jeder abgeschlossenen Runde das neueste Ergebnis aufnehmen und ältere Ergebnisse über zehn hinaus entfernen. Nach dem Tod die gespeicherten Ergebnisse nach Punkten sortiert mit der Platzierung der aktuellen Runde anzeigen; ihren Eintrag durch Blinken hervorheben. Speicherung, Reihenfolge, Platzierung und Verhalten bei nicht verfügbarer Speicherung automatisiert geprüft; visuelle Prüfung übernimmt der Nutzer.

- [x] **Spürnase:** Automatische Weingeschosse erhalten ebenfalls Zielverfolgung; Geschosse lenken stärker auf nahe sichtbare Gegner zu. Automatisiert geprüft, praktische Prüfung durch den Nutzer offen.

- [x] **Sonderangriff-Verbrauch:** Ein Einsatz verbraucht 10 % des vollen Weinbalkens; der Hinweis im oberen Band wurde entfernt. Automatisiert geprüft; die praktische Prüfung übernimmt der Nutzer.

### Teststruktur

- [x] **Tests nach Bereich:** Kampf, Eingaben, Fortschritt, Sound, Assets, Balance und Metaprogression sind gezielt ausführbar; ein Gesamtlauf steht für übergreifende Änderungen bereit. Alle Bereiche automatisiert geprüft.

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

- [x] **Orb-Bewegung und Fortschrittsbalken:** Orbs fliegen aus jeder Richtung zum Pferd und beschleunigen in Magnetreichweite. Der Fortschrittsbalken liegt inzwischen über die gesamte Breite am unteren Spielfeldrand. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

- [x] **Controller-Unterstützung**: Standard-Gamepads unterstützen. Linker Stick oder Steuerkreuz bewegt das Pfert; A löst einen Sonderangriff aus, B aktiviert Käserausch. A startet auch eine Runde und bestätigt Karten. Eine Stick-Totzone verhindert unbeabsichtigte Bewegung. Tastatur und Maus bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.
- [x] **Controller-Tastensymbole:** Tastenhinweise in Menüs, Talentbaum, Kartenauswahl und Spielanzeige verwenden die zum erkannten Controller passenden Symbole. Die PlayStation-Zuordnung lautet × / ○ / □ / △, bei unklarer Gerätekennung gilt die Xbox-Beschriftung. Controllerwechsel in der Kartenauswahl und die Rückkehr zum Tastaturhinweis nach Trennung sind automatisiert geprüft.

- [x] **Kartenwahl**: Die erste Karte sichtbar markieren; Pfeiltasten oder A / D wechseln zyklisch, Enter, Leertaste oder Controller A bestätigt. Gedrückte Tasten dürfen keine unbeabsichtigte Mehrfachauswahl auslösen. Maus und Zahlentasten bleiben nutzbar. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

- [x] **Seltene Karten**: Die zuletzt angebotene seltene Karte pro Runde merken. Bei der nächsten Auswahl erhält jede andere berechtigte seltene Karte das dreifache Auswahlgewicht; die vorherige bleibt möglich. Voraussetzungen, Ranggrenzen und der Zeitpunkt ab Minute 2 bleiben erhalten. Spätere legendäre Karten im selben Angebotspool erhalten dieselbe Behandlung; neue legendäre Karten sind nicht Teil dieser Etappe. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus, da der lokale Server nicht erreichbar und das direkte Öffnen der Datei gesperrt war.

### Etappe 2: Stufensystem und Levelwechsel

**GPT-6.1 Terra · High**

- [x] **Orb- und Stufensystem:** Gegner und Bosse hinterlassen einsammelbare Erfahrungsorbs; Punktewert abhängig vom Gegnertyp, Elite doppelt, Boss 10. Karten gibt es bei Stufenaufstieg statt jede Minute. Startbedarf 10, danach jeweils aufgerundet das 1,5-Fache; Überschuss bleibt erhalten. Orbs bleiben über Ruhrpott-Wechsel bestehen. Implementiert und automatisiert geprüft; Browser-Spieltest steht aus.

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

- [x] **Heilungskarte:** Bei Stufenaufstiegen kann eine mehrfach wählbare Karte ein Herz auffüllen, begrenzt durch das Herzmaximum und bestehende Heilungsregeln. Automatisiert geprüft; visueller Spieltest durch den Nutzer.

- [x] **Durchhalte-Heilung:** Alle fünf Minuten aktiver Spielzeit wird ein Herz aufgefüllt, begrenzt durch das Herzmaximum und bestehende Heilungsregeln. Automatisiert geprüft; visueller Spieltest durch den Nutzer.

- [x] Bossprobe aus Start- und Game-over-Menü entfernt. Reguläre Nicht-Elite-Gegner erhalten 90 % ihrer bisherigen HP.

- [x] Nach dem Sieg über den ersten Hauptboss sinkt die zeitabhängige Spawnrate für den Rest der Runde um 15 %. Fest geplante Wellen behalten ihren Zeitplan.

- [x] Balrog's Theme läuft ab Rundenstart in Endlosschleife. N schaltet Musik, M separat die Soundeffekte.

- [x] **Musiklautstärke im Pausemenü:** Esc öffnet den Regler für 0 bis 100 %. Änderungen wirken sofort und bleiben beim erneuten Öffnen des Menüs erhalten. Automatisiert geprüft mit `node test-pause-cards.cjs`, `node test-input.cjs` und `node test-sound.cjs`.
