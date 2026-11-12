# Meta-Progression: Talentbaum

## Status und Grundlagen

Dies ist ein **ungeprüfter Balanceentwurf**, keine bereits implementierte Funktion. Werte, Kombinationen, Punktevergabe und Spielzeit müssen praktisch getestet und gemeinsam abgestimmt werden. Die offene Waffen- und Gesamtbalance der Roadmap berücksichtigen: Insbesondere multiplizieren sich Feuerrate und Schaden in ihrer Gesamtwirkung. Die positiven Zahlenwerte des ursprünglichen Entwurfs wurden grundsätzlich um 50 % angehoben; Nachteile bleiben unverändert. Feste Mengen und Einmaleffekte bleiben, soweit unten nicht ausdrücklich geändert, erhalten und sind gezielt zu prüfen. Dezimalwerte dürfen intern ungerundet verarbeitet und verständlich angezeigt werden.

Der Baum hat **360 einzeln kaufbare Knoten**, jeder kostet einen Talentpunkt: fünf Startknoten, 15 Spezialisierungen mit je 23 Knoten und zehn Querverbindungsknoten. Die Querverbindungen ersetzen die frühere Aufteilung in je 71 Knoten pro Hauptbereich.

## Fortschritt, Speicherung und Bedienung

- Vorläufige Vergabe: ein Punkt pro zehn Minuten überlebter Zeit und ein Punkt pro besiegtem regulärem oder geheimem Boss. Zeitfortschritt als Bruchteil zwischen abgeschlossenen Runden erhalten. Vergabe beim regulären Rundenende; beim Schließen während der Runde keine nachträgliche Belohnung. Keine doppelte Vergabe.
- Ziel für den vollständigen Ausbau sind ungefähr 20–50 Spielstunden; anhand realer Rundenlängen und Bossabschlüsse überprüfen. Der voll ausgebaute Baum soll Pfert deutlich stärker machen.
- Fortschritt und Talentverteilung lokal im Browser dauerhaft speichern. Bei nicht verfügbarer oder beschädigter Speicherung verständlich informieren; ohne dauerhafte Speicherung spielbar bleiben. Laufende Runden werden nicht gespeichert.
- Die Talentverteilung zwischen Runden kostenlos vollständig zurücksetzen und alle investierten Punkte zurückgeben. Den gesamten Fortschritt nach eindeutiger Bestätigung löschen.
- Im Hauptmenü eine zusammenhängende, verschiebbare und zoombare Karte mit sichtbaren Verbindungen, Kosten, Wirkungen und verfügbaren Punkten anbieten. Maus, Tastatur und Controller unterstützen. Talente wirken ab der nächsten Runde.

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
| S1 · Erste Reifung | +3 % Schaden |
| S2 · Flinke Hufe | +3 % Bewegungsgeschwindigkeit |
| S3 · Käsefunke | +3 % Käserausch-Aufladung |
| S4 · Spürnase | +7,5 % Orb-Ansaugradius |
| S5 · Kellermeister | +4,5 % Waffen-Power-up-Dauer |

## Angriff — S1

### A1 · Salvenkunst

- A: +1,5 % Schaden automatischer Angriffe. B: +3 % Geschossgeschwindigkeit. C: +1,5 % Feuerrate automatischer Angriffe.
- 13 · Nachschlag: Jeder zwölfte automatische Angriff verursacht 45 % zusätzlichen Schaden.
- 16 · Weitflug: Automatische Geschosse bleiben 22,5 % länger bestehen.
- 20 · Taktgefühl: Nach fünf automatischen Angriffen verursacht der nächste 30 % zusätzlichen Schaden.
- 22 · Doppelschuss: Jeder 15. automatische Angriff feuert ein zusätzliches Geschoss mit 60 % Schaden.
- 23 · Schwere Salve: Automatische Angriffe feuern 20 % langsamer, verursachen aber 60 % mehr Schaden.

### A2 · Präzision

- A: +1,5 % Schaden gegen Gegner mit mehr als 70 % Leben. B: +1,5 Prozentpunkte kritische Trefferchance. C: +3 % kritischer Trefferschaden.
- 13 · Eröffnung: Der erste Treffer gegen einen Gegner verursacht 30 % zusätzlichen Schaden.
- 16 · Schwachstelle: Kritische Treffer gegen Bossegmente verursachen 15 % zusätzlichen Schaden.
- 20 · Trefferfolge: Drei aufeinanderfolgende Treffer auf dasselbe Ziel erhöhen den vierten Treffer um 37,5 %.
- 22 · Scharfer Blick: +6 Prozentpunkte kritische Trefferchance.
- 23 · Alles oder nichts: Kritische Treffer verursachen 75 % zusätzlichen Schaden; nicht kritische Treffer verursachen 15 % weniger Schaden.

### A3 · Elementarschmiede

- A: +1,5 % Schaden gegen brennende oder verlangsamte Gegner. B: +6 % Dauer von Brennen und Verlangsamung. C: +3 % Brennschaden.
- 13 · Glutspur: Jeder zehnte Treffer entzündet das Ziel für zwei Sekunden mit 22,5 % des auslösenden Trefferschadens pro Sekunde.
- 16 · Kälteschock: Jeder zehnte Treffer verlangsamt das Ziel zwei Sekunden lang um 22,5 %.
- 20 · Funkenflug: Einmal pro Sekunde springt ein Treffer auf einen weiteren Gegner über und verursacht 37,5 % seines Schadens.
- 22 · Würzexplosion: Stirbt ein brennender Gegner, erleiden Gegner im Radius von 67,5 Pixeln 30 % seines letzten erlittenen Trefferschadens.
- 23 · Elementarsturm: Elementare Zusatzeffekte verursachen 75 % mehr Schaden; direkter Geschossschaden sinkt um 10 %.

## Überleben und Bewegung — S2

### V1 · Fluchtwege

- A: +0,75 % Bewegungsgeschwindigkeit. B: +3 % Abstand für knappes Ausweichen. C: +0,75 % Bewegungsgeschwindigkeit.
- 13 · Schwung: Nach knappem Ausweichen zwei Sekunden lang +12 % Bewegungsgeschwindigkeit.
- 16 · Seitensprung: Nach einem Treffer zwei Sekunden lang +22,5 % Bewegungsgeschwindigkeit.
- 20 · Windschatten: Nach zwei Sekunden ohne Treffer +7,5 % Bewegungsgeschwindigkeit bis zum nächsten Treffer.
- 22 · Unfassbar: Nach knappem Ausweichen 0,3 Sekunden Unverwundbarkeit, höchstens einmal alle acht Sekunden.
- 23 · Rennpferd: +37,5 % Bewegungsgeschwindigkeit; Waffen-Power-ups halten 15 % kürzer.

### V2 · Schutzgarde

- A: +1,5 % Unverwundbarkeitsdauer nach Treffer. B: −4,5 % Abklingzeit des bestehenden Geschossblocks. C: −1,5 % Abklingzeit des bestehenden Geschossblocks.
- 13 · Käsegarde: Ein Begleiter kreist um Pfert und blockt alle 16,67 Sekunden ein feindliches Geschoss.
- 16 · Hartkäse: Die Käsegarde blockt alle 13,33 statt alle 16,67 Sekunden.
- 20 · Schutzhaut: Der erste Treffer jeder Runde wird verhindert.
- 22 · Schutzwelle: Nach einem verhinderten Treffer werden feindliche Geschosse im Radius von 90 Pixeln entfernt.
- 23 · Festung: Geschossblock und Käsegarde laden 60 % schneller; Bewegungsgeschwindigkeit −12 %.

### V3 · Letzter Galopp

- A: +1,5 % Schaden bei höchstens zwei Herzen. B: +4,5 % Bewegungsgeschwindigkeit bei höchstens zwei Herzen. C: +3 % Unverwundbarkeitsdauer nach Treffer.
- 13 · Trotz: Bei höchstens zwei Herzen +15 % Schaden.
- 16 · Aufrappeln: Einmal pro Runde nach einem Treffer bei einem verbleibenden Herzen ein Herz heilen.
- 20 · Überlebenswille: Einmal pro Runde wird ein tödlicher Treffer verhindert; Pfert bleibt mit einem Herzen zurück.
- 22 · Galopp: Bei einem Herzen +22,5 % Bewegungsgeschwindigkeit und +22,5 % Schaden.
- 23 · Draufgänger: Bei höchstens zwei Herzen +60 % Schaden; erhaltene Heilung ist um 50 % reduziert, auf halbe Herzen gerundet. Die Darstellung und Unterstützung halber Herzen muss bei der Umsetzung geprüft werden.

## Käserausch — S3

### K1 · Käsegewitter

- A: +1,5 % Schaden während des Käserauschs. B: +3 % Käserausch-Dauer. C: +1,5 % Schaden während des Käserauschs.
- 13 · Erste Käsesalve: Während des Käserauschs feuern automatische Angriffe ein zusätzliches Projektil mit 52,5 % Schaden.
- 16 · Zweite Käsesalve: Ein zweites zusätzliches Projektil mit 52,5 % Schaden.
- 20 · Käseblitz: Während des Käserauschs trifft jede Sekunde ein Blitz einen nahen Gegner und verursacht 60 % des Standardschussschadens.
- 22 · Dritte Käsesalve: Ein drittes zusätzliches Projektil mit 52,5 % Schaden. Höchstens drei zusätzliche Projektile aus dem Käserausch-Baum.
- 23 · Gewitterfront: Käseblitze treffen ein zusätzliches Ziel; Käserausch lädt 15 % langsamer.

### K2 · Rauschdauer

- A: +0,75 % Käserausch-Aufladung. B: +3 % Käserausch-Dauer. C: +1,5 % Käserausch-Dauer.
- 13 · Vorfreude: Die Runde beginnt mit 15 % gefüllter Käserausch-Leiste.
- 16 · Restwärme: Der bestehende Schadensbonus des Käserauschs hält nach dessen Ende 1,5 Sekunden an.
- 20 · Käsereifung: Die ersten zwei Sekunden des Käserauschs gewähren zusätzlich 15 % Schaden.
- 22 · Langer Abgang: Restwärme hält weitere 1,5 Sekunden an; ohne K2-16 gilt der bestehende Schadensbonus nach Ende des Käserauschs für diese 1,5 Sekunden.
- 23 · Marathonrausch: Käserausch hält 52,5 % länger; seine Aufladung ist 20 % langsamer.

### K3 · Notfallkäse

- A: +1,5 % Käserausch-Aufladung durch knappes Ausweichen. B: +4,5 % Orb-Ansaugradius während des Käserauschs. C: +1,5 % Käserausch-Aufladung.
- 13 · Schutzrausch: Bei Aktivierung 0,75 Sekunden Unverwundbarkeit.
- 16 · Käseernte: Im Käserausch besiegte Gegner geben 12 % mehr Orb-Erfahrung.
- 20 · Notreserve: Einmal pro Runde werden bei einem verbleibenden Herzen 30 % Käserausch aufgefüllt.
- 22 · Rettungsring: Bei Aktivierung mindestens 1,5 Sekunden Unverwundbarkeit.
- 23 · Überladung: Bei Aktivierung mindestens drei Sekunden Unverwundbarkeit; danach kann fünf Sekunden lang kein Käserausch aufgeladen werden.

## Beute und Erfahrung — S4

### B1 · Orbjagd

- A: +3 % Orb-Ansaugradius. B: +1,5 % Orb-Erfahrung. C: +1,5 % Orb-Erfahrung.
- 13 · Erster Fund: Die Runde beginnt mit zwei Erfahrungspunkten.
- 16 · Elite-Beute: Elite-Orbs geben 15 % mehr Erfahrung.
- 20 · Orb-Überladung: Nach jeweils 25 eingesammelten Orbs entsteht eine Schadenswelle im Radius von 112,5 Pixeln, die 150 % Standardschussschaden verursacht.
- 22 · Große Welle: Orb-Überladung erhält 37,5 Pixel Radius und 75 Prozentpunkte Schaden. Ohne B1-20 wird keine zusätzliche Welle erzeugt.
- 23 · Wissenshunger: +30 % Orb-Erfahrung; Waffen-Power-ups halten 15 % kürzer.

### B2 · Flaschensammler

- A: +4,5 % Ansaugradius für Flaschen. B: +4,5 % Waffen-Power-up-Dauer. C: +1,5 % Waffen-Power-up-Dauer.
- 13 · Korkensinn: Flaschen werden zusätzlich aus 60 Pixeln Entfernung angezogen.
- 16 · Frischer Jahrgang: Die erste Waffenflasche jeder Runde hält 30 % länger.
- 20 · Nachschub: Die erste aufgesammelte Waffenflasche füllt einen fehlenden Sonderangriff auf.
- 22 · Kellerfund: Einmal pro Runde heilt eine Waffenflasche ein fehlendes Herz.
- 23 · Sammlertrieb: Flaschen-Ansaugradius +150 %; Bewegungsgeschwindigkeit −10 %.

### B3 · Entdecker

- A: +1,5 % Orb-Erfahrung von Elitegegnern. B: +3 % Orb-Ansaugradius. C: +1,5 % Orb-Erfahrung von Bossen.
- 13 · Bossbeute: Boss-Orbs geben 22,5 % mehr Erfahrung.
- 16 · Elite-Spürnase: Elite-Orbs werden aus zusätzlich 45 Pixeln Entfernung angezogen.
- 20 · Fundfreude: Nach einem besiegten Boss fünf Sekunden lang +15 % Bewegungsgeschwindigkeit.
- 22 · Schatzwelle: Beim Einsammeln eines Boss-Orbs entsteht die Schadenswelle aus B1-20, auch wenn B1-20 nicht gekauft ist; B1-22 verstärkt sie, wenn gekauft.
- 23 · Forscherdrang: Elite- und Boss-Orbs geben 45 % mehr Erfahrung; reguläre Gegner-Orbs geben 10 % weniger Erfahrung.

## Waffen und Sonderangriffe — S5

### W1 · Sonderreserve

- A: +1,5 % Sonderangriffsschaden. B: +3 % Sonderangriffsschaden. C: +1,5 % Sonderangriffsschaden.
- 13 · Sparsamer Korken: Einmal pro Runde verbraucht ein Sonderangriff keine Ladung.
- 16 · Eröffnungsfeier: Der erste Sonderangriff verursacht 30 % zusätzlichen Schaden.
- 20 · Sondernachschub: Einmal pro Runde wird nach dem Besiegen eines Bosses ein fehlender Sonderangriff aufgefüllt.
- 22 · Letzter Tropfen: Der letzte verfügbare Sonderangriff verursacht 30 % zusätzlichen Schaden.
- 23 · Große Flasche: Sonderangriffe verursachen 90 % mehr Schaden; maximal verfügbare Einsätze sinken von drei auf zwei.

### W2 · Waffenliebhaber

- A: +1,5 % Waffen-Power-up-Dauer. B: +3 % Schaden bei aktivem Waffen-Power-up. C: +1,5 % Schaden bei aktivem Waffen-Power-up.
- 13 · Hausmarke: Automatische Angriffe verursachen mit aktivem Waffen-Power-up 12 % mehr Schaden.
- 16 · Fliegender Wechsel: Beim Aufsammeln einer Waffenflasche erhält Pfert zwei Sekunden lang +15 % Bewegungsgeschwindigkeit.
- 20 · Korkenbombe: Ein Sonderangriff hinterlässt eine Bombe, die nach einer Sekunde im Radius von 90 Pixeln 150 % Standardschussschaden verursacht.
- 22 · Große Bombe: Korkenbomben erhalten 30 Pixel Radius und 75 Prozentpunkte Schaden; ohne W2-20 entsteht keine Bombe.
- 23 · Hochprozentig: Korkenbomben verursachen 150 % mehr Schaden; Waffen-Power-ups halten 20 % kürzer.

### W3 · Waffenkombinationen

- A: +1,5 % Geschossgeschwindigkeit bei aktivem Waffen-Power-up. B: +3 % Sonderangriffsschaden bei aktivem Waffen-Power-up. C: +1,5 % Schaden automatischer Angriffe bei aktivem Waffen-Power-up.
- 13 · Flaschenfunke: Beim Aufsammeln einer Waffenflasche erleiden Gegner im Radius von 90 Pixeln 75 % Standardschussschaden.
- 16 · Echoschuss: Jeder 15. automatische Angriff mit aktivem Waffen-Power-up erzeugt ein Echo mit 60 % Schaden.
- 20 · Nachbrenner: Nach einem Sonderangriff verursachen automatische Angriffe drei Sekunden lang 15 % mehr Schaden.
- 22 · Wechselwirkung: Nach dem Aufsammeln einer Waffenflasche verursacht der nächste Sonderangriff 30 % mehr Schaden.
- 23 · Waffenrausch: Mit aktivem Waffen-Power-up +37,5 % Feuerrate automatischer Angriffe; ohne aktives Waffen-Power-up −15 % Feuerrate.

## Querverbindungsknoten

Jeder Q-Knoten verbindet die beiden genannten Knoten beidseitig; er ist von jeder Seite zugänglich und erschließt nach Kauf die andere. Die Effekte gelten zusätzlich zu den verbundenen Spezialisierungen.

| Knoten | Verbindung | Effekt |
| --- | --- | --- |
| Q1 · Kampfgalopp | A1-10 ↔ Q1 ↔ V1-10 | +4,5 % Schaden und +4,5 % Bewegungsgeschwindigkeit |
| Q2 · Vergeltung | A2-20 ↔ Q2 ↔ V3-20 | Nach einem Treffer fünf Sekunden lang +15 % Schaden |
| Q3 · Feuerkäse | A3-10 ↔ Q3 ↔ K1-10 | +12 % Brennschaden während des Käserauschs |
| Q4 · Schutzrausch | V2-10 ↔ Q4 ↔ K3-10 | −7,5 % Geschossblock-Abklingzeit während des Käserauschs |
| Q5 · Käseernte | K3-20 ↔ Q5 ↔ B1-20 | +7,5 % Orb-Erfahrung während des Käserauschs |
| Q6 · Kellerrausch | K2-10 ↔ Q6 ↔ B2-10 | +7,5 % Waffen-Power-up-Dauer während des Käserauschs |
| Q7 · Sonderfund | B2-20 ↔ Q7 ↔ W1-20 | Erste Waffenflasche jeder Runde gewährt zusätzlich 7,5 % Käserausch |
| Q8 · Bossjäger | B3-10 ↔ Q8 ↔ W1-10 | +7,5 % Sonderangriffsschaden gegen Bosse |
| Q9 · Elementarwein | A3-20 ↔ Q9 ↔ W2-20 | +12 % Elementarschaden mit aktivem Waffen-Power-up |
| Q10 · Fluchtflasche | V1-20 ↔ Q10 ↔ W3-20 | Nach Aufsammeln einer Waffenflasche drei Sekunden lang +12 % Bewegungsgeschwindigkeit |

## Prüfung bei Umsetzung

Knotenzahl, Voraussetzungen und Verbindungen prüfen; alle Effekte einzeln und in Kombination testen, insbesondere Extremtalente, Lebenspunkte, Aufladung, Waffen, Bosse, Erfahrung und Projektilgrenze. Vergabe, einmalige Verbuchung, Speicherfehler, Browserneustart und beide Rücksetzarten prüfen. `node test-game.cjs` ausführen und nach Möglichkeit Maus, Tastatur, Controller sowie Spielabläufe im Browser erproben. Ergebnisse und offene Balancefragen in der Roadmap dokumentieren.
