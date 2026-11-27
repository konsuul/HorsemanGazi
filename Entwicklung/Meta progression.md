# Meta-Progression: Talentbaum

## Status und Grundlagen

Die [Spielarchitektur](ARCHITEKTUR.md#dauerhafte-talente-und-punktetafel) beschreibt die aktuelle Vergabe und Speicherung. Aus den Talenttexten dieses Entwurfs erzeugt `node tests/build-meta-data.cjs` die Texte in `Pfert/meta-data.js`. Die Talentwirkungen stehen in `Pfert/game.js`.

Dies ist ein **noch nicht vollständig geprüfter Balanceentwurf** für den implementierten Talentbaum. Werte, Kombinationen, Punktevergabe und Spielzeit müssen praktisch getestet und gemeinsam abgestimmt werden. Die offene Waffen- und Gesamtbalance der Roadmap berücksichtigen: Insbesondere multiplizieren sich Feuerrate und Schaden in ihrer Gesamtwirkung. Positive Rangwerte wurden gegenüber dem vorherigen Spielstand verdoppelt. Grundwerte, Nachteile, Auslösebedingungen, Projektilgrenzen und die festen Schutz- und Heilungsregeln gelten weiter. Dezimalwerte dürfen intern ungerundet verarbeitet und verständlich angezeigt werden.

Der ursprüngliche Entwurf hat **360 einzelne Käufe**, jeder kostet einen Talentpunkt: fünf Startknoten, 15 Spezialisierungen mit je 23 Knoten und zehn Querverbindungsknoten. Die Querverbindungen ersetzen die frühere Aufteilung in je 71 Knoten pro Hauptbereich.

## Fortschritt, Speicherung und Bedienung

- Vorläufige Vergabe: ein Punkt pro zehn Minuten überlebter Zeit und ein Punkt pro besiegtem regulärem oder geheimem Boss. Zeitfortschritt als Bruchteil zwischen abgeschlossenen Runden erhalten. Vergabe beim regulären Rundenende; beim Schließen während der Runde keine nachträgliche Belohnung. Keine doppelte Vergabe.
- Ziel für den vollständigen Ausbau sind ungefähr 20–50 Spielstunden; anhand realer Rundenlängen und Bossabschlüsse überprüfen. Der voll ausgebaute Baum soll Pfert deutlich stärker machen.
- Fortschritt und Talentverteilung lokal im Browser dauerhaft speichern. Bei nicht verfügbarer oder beschädigter Speicherung verständlich informieren; ohne dauerhafte Speicherung spielbar bleiben. Laufende Runden werden nicht gespeichert.
- Die Talentverteilung zwischen Runden kostenlos vollständig zurücksetzen und alle investierten Punkte zurückgeben. Den gesamten Fortschritt nach eindeutiger Bestätigung löschen.
- Im Hauptmenü eine zusammenhängende, verschiebbare und zoombare Karte mit sichtbaren Verbindungen, Kosten, Wirkungen und verfügbaren Punkten anbieten. Maus, Tastatur und Controller unterstützen. Talente wirken ab der nächsten Runde.

Gleiche aufeinanderfolgende Verbesserungen werden im Spiel zu einem Knoten mit bis zu fünf Rängen zusammengefasst. Der erste Rang öffnet verbundene Knoten; bestehende Käufe bleiben erhalten.

## Baumstruktur

S1–S5 bilden eine Kette: **S1—S2—S3—S4—S5**. S1 ist ohne Voraussetzung kaufbar. Jeder Startknoten verbindet sich mit Knoten 1 seiner drei Spezialisierungen. Gekaufte Knoten dürfen alle Bereiche kombinieren; ein noch nicht gekaufter Knoten ist erreichbar, sobald mindestens ein direkt verbundener Knoten gekauft wurde. Die Verbindungen sind beidseitig begehbar. Kosten: jeweils ein Punkt, auch für Start- und Querverbindungsknoten.

Jede Spezialisierung hat die folgenden Verbindungen:

```text
Start — 1 — 2 — 3 — 4 — 5
                         ├— 6 — 7 — 8 — 9 — 10
                         │                    ├— 11 — 12 — 13
                         │                    └— 14 — 15 — 16
                         └— 17 — 18 — 19 — 20
                                              ├— 21 — 22
                                              └— 23
```

Knoten **1–4 und 6–9** haben jeweils den angegebenen Effekt A; **5 und 10** jeweils B; **11–12, 14–15 und 17–19** jeweils C. Knoten **21** hat zweimal C als einen Effekt. **13, 16, 20, 22 und 23** sind jeweils einzeln angegeben. Gleiche prozentuale Boni innerhalb einer Kategorie addieren; unterschiedliche Kategorien wirken anschließend miteinander. Chancenangaben in Prozentpunkten erhöhen die absolute Chance. Alle Extremtalente bleiben nach Kauf bis zum Zurücksetzen aktiv und müssen zusammen sinnvoll funktionieren.

## Startknoten

| Knoten | Wirkung |
| --- | --- |
| S1 · Erste Reifung | +6 % Schaden |
| S2 · Flinke Hufe | +6 % Bewegungsgeschwindigkeit |
| S3 · Käsefunke | +6 % Käserausch-Aufladung |
| S4 · Spürnase | +15 % Orb-Ansaugradius |
| S5 · Kellermeister | +9 % Waffen-Power-up-Dauer |

## Angriff — S1

### A1 · Salvenkunst

- A: +3 % Schaden automatischer Angriffe. B: +6 % Geschossgeschwindigkeit. C: +3 % Feuerrate automatischer Angriffe.
- 5 zusätzlich: Eisfächer-Zusatzschüsse erhalten 8 % Stärke, die Lichtlanze erhält 8 % Strahlschaden.
- 13 · Nachschlag: Jeder zwölfte automatische Angriff verursacht 90 % zusätzlichen Schaden.
- 16 · Weitflug: Automatische Geschosse bleiben 45 % länger bestehen.
- 20 · Taktgefühl: Nach fünf automatischen Angriffen verursacht der nächste 60 % zusätzlichen Schaden.
- 22 · Doppelschuss: Jeder 15. automatische Angriff feuert ein zusätzliches Geschoss mit 120 % Schaden.
- 23 · Schwere Salve: Automatische Angriffe feuern 20 % langsamer, verursachen aber 120 % mehr Schaden. Eisfächer-Zusatzschüsse erhalten zusätzlich 16 % Stärke.

### A2 · Präzision

- A: +3 % Schaden gegen Gegner mit mehr als 70 % Leben. B: +3 Prozentpunkte kritische Trefferchance. C: +6 Prozentpunkte auf den kritischen Schadensmultiplikator.
- 5 zusätzlich: Der Erdbolzen erhält 8 % Hauptschussschaden.
- 13 · Eröffnung: Der erste Treffer gegen einen Gegner verursacht 60 % zusätzlichen Schaden.
- 16 · Schwachstelle: Kritische Treffer gegen Bossegmente verursachen 30 % zusätzlichen Schaden.
- 20 · Trefferfolge: Drei aufeinanderfolgende Treffer auf dasselbe Ziel erhöhen den vierten Treffer um 75 %.
- 22 · Scharfer Blick: +12 Prozentpunkte kritische Trefferchance.
- 23 · Alles oder nichts: Der kritische Schadensmultiplikator steigt um 150 Prozentpunkte. Treffer ohne Krit verursachen 15 % weniger Schaden. Der Erdbolzen erhält zusätzlich 16 % Hauptschussschaden.

### A3 · Elementarschmiede

- A: +3 % Schaden gegen brennende oder verlangsamte Gegner. B: +12 % Dauer von Brennen und Verlangsamung. C: +6 % Brennschaden.
- 5 zusätzlich: Glutkern erhält 16 Prozentpunkte zusätzlichen Brandschaden pro Sekunde.
- 13 · Glutspur: Jeder zehnte Treffer entzündet das Ziel für zwei Sekunden mit 45 % des auslösenden Trefferschadens pro Sekunde.
- 16 · Kälteschock: Jeder zehnte Treffer verlangsamt das Ziel zwei Sekunden lang um 45 %.
- 20 · Funkenflug: Einmal pro Sekunde springt ein Treffer auf einen weiteren Gegner über und verursacht 75 % seines Schadens.
- 22 · Würzexplosion: Stirbt ein brennender Gegner, erleiden Gegner im Radius von 67,5 Pixeln 60 % seines letzten erlittenen Trefferschadens.
- 23 · Elementarsturm: Brennen, Funkenflug, Würzexplosion und Kettenblitze verursachen 150 % mehr Schaden. Direkter Trefferschaden sinkt um 10 %. Glutkern erhält zusätzlich 24 Prozentpunkte Brandschaden pro Sekunde und die Lichtlanze 16 % Strahlschaden.

## Überleben und Bewegung — S2

### V1 · Fluchtwege

- A: +1,5 % Bewegungsgeschwindigkeit. B: +6 % Abstand für knappes Ausweichen. C: +1,5 % Bewegungsgeschwindigkeit.
- 13 · Schwung: Nach knappem Ausweichen zwei Sekunden lang +24 % Bewegungsgeschwindigkeit.
- 16 · Seitensprung: Nach einem Treffer zwei Sekunden lang +45 % Bewegungsgeschwindigkeit.
- 20 · Windschatten: Nach zwei Sekunden ohne Treffer +15 % Bewegungsgeschwindigkeit bis zum nächsten Treffer.
- 22 · Unfassbar: Nach knappem Ausweichen 0,6 Sekunden Unverwundbarkeit, höchstens einmal alle acht Sekunden.
- 23 · Rennpferd: +75 % Bewegungsgeschwindigkeit; Waffen-Power-ups halten 15 % kürzer.

### V2 · Schutzgarde

- A: +3 % Unverwundbarkeitsdauer nach Treffer. B: −9 % Abklingzeit des bestehenden Geschossblocks. C: −3 % Abklingzeit des bestehenden Geschossblocks.
- 13 · Käsegarde: Ein Begleiter kreist um Pfert und blockt alle 16,67 Sekunden ein feindliches Geschoss.
- 16 · Hartkäse: Die Käsegarde blockt alle 9,99 statt alle 16,67 Sekunden.
- 20 · Schutzhaut: Der erste Treffer jeder Runde wird verhindert.
- 22 · Schutzwelle: Nach einem verhinderten Treffer werden feindliche Geschosse im Radius von 90 Pixeln entfernt.
- 23 · Festung: Geschossblock und Käsegarde haben 75 % weniger verbleibende Abklingzeit. Bewegungsgeschwindigkeit −12 %.

### V3 · Letzter Galopp

- A: +3 % Schaden bei höchstens zwei Herzen. B: +9 % Bewegungsgeschwindigkeit bei höchstens zwei Herzen. C: +6 % Unverwundbarkeitsdauer nach Treffer.
- 13 · Trotz: Bei höchstens zwei Herzen +30 % Schaden.
- 16 · Aufrappeln: Einmal pro Runde nach einem Treffer bei einem verbleibenden Herzen ein Herz heilen.
- 20 · Überlebenswille: Einmal pro Runde wird ein tödlicher Treffer verhindert; Pfert bleibt mit einem Herzen zurück.
- 22 · Galopp: Bei einem Herzen +45 % Bewegungsgeschwindigkeit und +45 % Schaden.
- 23 · Draufgänger: Bei höchstens zwei Herzen +120 % Schaden; erhaltene Heilung ist um 50 % reduziert, auf halbe Herzen gerundet.

## Käserausch — S3

### K1 · Käsegewitter

- A: +3 % Schaden während des Käserauschs. B: +6 % Käserausch-Dauer. C: +3 % Schaden während des Käserauschs.
- 13 · Erste Käsesalve: Während des Käserauschs feuern automatische Angriffe ein zusätzliches Projektil mit 105 % Schaden.
- 16 · Zweite Käsesalve: Ein zweites zusätzliches Projektil mit 105 % Schaden.
- 20 · Käseblitz: Während des Käserauschs trifft jede Sekunde ein Blitz einen nahen Gegner und verursacht 120 % des Standardschussschadens.
- 22 · Dritte Käsesalve: Ein drittes zusätzliches Projektil mit 105 % Schaden. Höchstens drei zusätzliche Projektile aus dem Käserausch-Baum.
- 23 · Gewitterfront: Käseblitze treffen ein zusätzliches Ziel; Käserausch lädt 15 % langsamer.

### K2 · Rauschdauer

- A: +1,5 % Käserausch-Aufladung. B: +6 % Käserausch-Dauer. C: +3 % Käserausch-Dauer.
- 13 · Vorfreude: Die Runde beginnt mit 30 % gefüllter Käserausch-Leiste.
- 16 · Restwärme: Der Grund-Schadensbonus des Käserauschs hält nach dessen Ende 3 Sekunden an.
- 20 · Käsereifung: Die ersten zwei Sekunden des Käserauschs gewähren zusätzlich 30 % Schaden.
- 22 · Langer Abgang: Verlängert den Grund-Schadensbonus nach Käserausch um 3 Sekunden. Zusammen mit Restwärme sind es 6 Sekunden.
- 23 · Marathonrausch: Käserausch hält 105 % länger und lädt 20 % langsamer auf.

### K3 · Notfallkäse

- A: +3 % Käserausch-Aufladung durch knappes Ausweichen. B: +9 % Orb-Ansaugradius während des Käserauschs. C: +3 % Käserausch-Aufladung.
- 13 · Schutzrausch: Bei Aktivierung 0,85 Sekunden Unverwundbarkeit.
- 16 · Käseernte: Im Käserausch besiegte Gegner geben 24 % mehr Orb-Erfahrung.
- 20 · Notreserve: Einmal pro Runde werden bei einem verbleibenden Herzen 60 % Käserausch aufgefüllt.
- 22 · Rettungsring: Bei Aktivierung mindestens 1,5 Sekunden Unverwundbarkeit.
- 23 · Überladung: Bei Aktivierung mindestens drei Sekunden Unverwundbarkeit; nach Ende des Käserauschs ist die Aufladung fünf Sekunden lang gesperrt.

## Beute und Erfahrung — S4

### B1 · Orbjagd

- A: +6 % Orb-Ansaugradius. B: +3 % Orb-Erfahrung. C: +3 % Orb-Erfahrung.
- 13 · Erster Fund: Die Runde beginnt mit vier Erfahrungspunkten.
- 16 · Elite-Beute: Elite-Orbs geben 30 % mehr Erfahrung.
- 20 · Orb-Überladung: Nach jeweils 25 eingesammelten Orbs entsteht eine Schadenswelle im Radius von 112,5 Pixeln, die 300 % Standardschussschaden verursacht.
- 22 · Große Welle: Orb-Überladung erhält 75 Pixel Radius und 150 Prozentpunkte Schaden. Wirkt auf Wellen aus Orb-Überladung und Schatzwelle.
- 23 · Wissenshunger: +60 % Orb-Erfahrung.

### B2 · Flaschensammler

- A: +9 % Ansaugradius für Flaschen. B: +9 % Waffen-Power-up-Dauer. C: +3 % Waffen-Power-up-Dauer.
- 13 · Korkensinn: Flaschen werden zusätzlich aus 120 Pixeln Entfernung angezogen.
- 16 · Frischer Jahrgang: Die erste Waffenflasche jeder Runde hält 60 % länger.
- 20 · Nachschub: Die erste Waffenflasche der Runde gibt zusätzlich zwei Drittel der Basisdauer auf den Weinbalken.
- 22 · Kellerfund: Einmal pro Runde heilt eine Waffenflasche ein fehlendes Herz.
- 23 · Sammlertrieb: Flaschen-Ansaugradius +300 %; Bewegungsgeschwindigkeit −10 %.

### B3 · Entdecker

- A: +3 % Orb-Erfahrung von Elitegegnern. B: +6 % Orb-Ansaugradius. C: +3 % Orb-Erfahrung von Bossen.
- 13 · Bossbeute: Boss-Orbs geben 45 % mehr Erfahrung.
- 16 · Elite-Spürnase: Elite-Orbs werden aus zusätzlich 90 Pixeln Entfernung angezogen.
- 20 · Fundfreude: Nach einem besiegten Boss fünf Sekunden lang +30 % Bewegungsgeschwindigkeit.
- 22 · Schatzwelle: Beim Einsammeln eines Boss-Orbs entsteht die Schadenswelle aus B1-20, auch wenn B1-20 nicht gekauft ist; B1-22 verstärkt sie, wenn gekauft.
- 23 · Forscherdrang: Elite- und Boss-Orbs geben 90 % mehr Erfahrung; reguläre Gegner-Orbs geben 10 % weniger Erfahrung.

## Waffen und Sonderangriffe — S5

### W1 · Sonderreserve

- A: +3 % Sonderangriffsschaden. B: +6 % Sonderangriffsschaden. C: +3 % Sonderangriffsschaden.
- 13 · Sparsamer Korken: Der erste Sonderangriff der Runde verbraucht keinen Wein.
- 16 · Eröffnungsfeier: Der erste Sonderangriff verursacht 60 % zusätzlichen Schaden.
- 20 · Sondernachschub: Einmal pro Runde füllt ein Boss-Sieg bis zu zwei Dritteln des Weinbalkens auf, sofern eine Weinwaffe aktiv ist und Wein fehlt.
- 22 · Letzter Tropfen: Liegt der Weinbalken beim Auslösen bei höchstens 10 %, verursacht der Sonderangriff 60 % zusätzlichen Schaden.
- 23 · Große Flasche: Sonderangriffe verursachen 180 % mehr Schaden; mit Sondernachschub füllt ein Boss-Sieg den Weinbalken vollständig auf.

### W2 · Waffenliebhaber

- A: +3 % Waffen-Power-up-Dauer. B: +6 % Schaden bei aktivem Waffen-Power-up. C: +3 % Schaden bei aktivem Waffen-Power-up.
- 13 · Hausmarke: Automatische Angriffe verursachen mit aktivem Waffen-Power-up 24 % mehr Schaden.
- 16 · Fliegender Wechsel: Beim Aufsammeln einer Waffenflasche erhält Pfert zwei Sekunden lang +30 % Bewegungsgeschwindigkeit.
- 20 · Korkenbombe: Ein Sonderangriff hinterlässt eine Bombe, die nach einer Sekunde im Radius von 90 Pixeln 300 % Standardschussschaden verursacht.
- 22 · Große Bombe: Korkenbomben erhalten 60 Pixel Radius und 150 Prozentpunkte Schaden; ohne W2-20 entsteht keine Bombe.
- 23 · Hochprozentig: Korkenbomben verursachen 300 % mehr Schaden; Waffen-Power-ups halten 20 % kürzer.

### W3 · Waffenkombinationen

- A: +3 % Geschossgeschwindigkeit bei aktivem Waffen-Power-up. B: +6 % Sonderangriffsschaden bei aktivem Waffen-Power-up. C: +3 % Schaden automatischer Angriffe bei aktivem Waffen-Power-up.
- 13 · Flaschenfunke: Beim Aufsammeln einer Waffenflasche erleiden Gegner im Radius von 90 Pixeln 150 % Standardschussschaden.
- 16 · Echoschuss: Jeder 15. automatische Angriff mit aktivem Waffen-Power-up erzeugt ein Echo mit 120 % Schaden.
- 20 · Nachbrenner: Nach einem Sonderangriff verursachen automatische Angriffe drei Sekunden lang 30 % mehr Schaden.
- 22 · Wechselwirkung: Nach dem Aufsammeln einer Waffenflasche verursacht der nächste Sonderangriff 60 % mehr Schaden.
- 23 · Waffenrausch: Mit aktivem Waffen-Power-up +75 % Feuerrate automatischer Angriffe; ohne aktives Waffen-Power-up −15 % Feuerrate.

## Querverbindungsknoten

Jeder Q-Knoten verbindet die beiden genannten Knoten beidseitig; er ist von jeder Seite zugänglich und erschließt nach Kauf die andere. Die Effekte gelten zusätzlich zu den verbundenen Spezialisierungen.

| Knoten | Verbindung | Effekt |
| --- | --- | --- |
| Q1 · Kampfgalopp | A1-10 ↔ Q1 ↔ V1-10 | +9 % Schaden und +9 % Bewegungsgeschwindigkeit |
| Q2 · Vergeltung | A2-20 ↔ Q2 ↔ V3-20 | Nach einem Treffer fünf Sekunden lang +30 % Schaden |
| Q3 · Feuerkäse | A3-10 ↔ Q3 ↔ K1-10 | +24 % Brennschaden während des Käserauschs |
| Q4 · Schutzrausch | V2-10 ↔ Q4 ↔ K3-10 | −15 % Geschossblock-Abklingzeit während des Käserauschs |
| Q5 · Käseernte | K3-20 ↔ Q5 ↔ B1-20 | +15 % Orb-Erfahrung während des Käserauschs |
| Q6 · Kellerrausch | K2-10 ↔ Q6 ↔ B2-10 | +15 % Waffen-Power-up-Dauer während des Käserauschs |
| Q7 · Sonderfund | B2-20 ↔ Q7 ↔ W1-20 | Erste Waffenflasche jeder Runde gewährt zusätzlich 15 % Käserausch |
| Q8 · Bossjäger | B3-10 ↔ Q8 ↔ W1-10 | +15 % Sonderangriffsschaden gegen Bosse |
| Q9 · Elementarwein | A3-20 ↔ Q9 ↔ W2-20 | +24 % Brennschaden mit aktivem Waffen-Power-up |
| Q10 · Eichelkranzkäse | V1-20 ↔ Q10 ↔ W3-20 | Während des Käserauschs +100 % Schaden; nach Aufsammeln einer Waffenflasche drei Sekunden lang +24 % Bewegungsgeschwindigkeit |

## Prüfung bei Umsetzung

Knotenzahl, Voraussetzungen und Verbindungen prüfen; alle Effekte einzeln und in Kombination testen, insbesondere Extremtalente, Lebenspunkte, Aufladung, Waffen, Bosse, Erfahrung und Projektilgrenze. Vergabe, einmalige Verbuchung, Speicherfehler, Browserneustart und beide Rücksetzarten prüfen. `node tests/test-game.cjs` ausführen und nach Möglichkeit Maus, Tastatur, Controller sowie Spielabläufe im Browser erproben. Ergebnisse und offene Balancefragen in der Roadmap dokumentieren.
