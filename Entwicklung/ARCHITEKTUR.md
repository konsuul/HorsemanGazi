# Pfert – Spielarchitektur

Stand der Einzelspieler-Implementierung in Version 1.0.6. Die Formeln beziehen sich auf Spielzeit in Sekunden, Positionen in Canvas-Pixeln und intern ungerundete Schadenswerte. Die [Spielanleitung](README.md) beschreibt die Bedienung. Anforderungen und offene Balancefragen stehen in der [Roadmap](ROADMAP.md).

## Einstiegspunkte

| Datei | Verantwortung |
| --- | --- |
| [Pfert/index.html](../Pfert/index.html) und [style.css](../Pfert/style.css) | Einstieg per Datei-URL, Canvas mit 960 × 540 Pixeln, Menüs und sichtbare Versionsnummer |
| [game.js](../Pfert/game.js) | Spielzustand, Eingaben, Begegnungen, Schaden, Progression und HUD-Daten in einer geschlossenen Browserfunktion |
| [art.js](../Pfert/art.js) und [assets.js](../Pfert/assets.js) | Canvas-Zeichnung, Sprites und Fallbacks, Effektformen sowie Bosssegmente einschließlich Trefferpolygonen |
| [sound.js](../Pfert/sound.js) | Synthetische Kampfsignale mit Stimmenlimit und Prioritäten, Musikplaylist und Lautstärke |
| [meta.js](../Pfert/meta.js) und [meta-data.js](../Pfert/meta-data.js) | Talentgraph, Kauf, Verkauf, Speicherung, importierbare Sicherung sowie generierte Texte und Icons |

`index.html` lädt `sound → assets → art → meta → meta-data → game`. Die Skripte laufen direkt im Browser. `Pfert/` ist der vollständige Spielordner für ZIP und GitHub Pages. [Deployment](DEPLOYMENT.md)

## Rundenablauf und Zeitsystem

- Vom Menü oder der Rundenauswertung führt die Basisskill-Auswahl über `reset` zu `startRun('regular', skill)`. Der Start setzt Karten, Ausrüstung, Projektile, Gegner, Begegnungszähler und beide Uhren zurück. Das Pfert startet mit fünf Herzen, Stufe 1 und 10 XP bis zur ersten Karte. Die letzte Skill-Auswahl bleibt innerhalb derselben Seiteninstanz vorausgewählt.
- `frame` fragt den Controller ab, begrenzt den Simulationsschritt auf 0,05 s und ruft `update` über `requestAnimationFrame` auf. `updateGameplay` läuft in `playing`. Kartenauswahl (`upgrade`), Pause samt Ausrüstung (`paused`), Talentbaum und Rundenauswertung halten die Simulation an. Fokusverlust setzt Bewegungs- und Tastenzustand zurück und pausiert die laufende Runde. Der Controller muss nach blockierten Zustandswechseln erst losgelassen werden.
- `runTime` zählt aktive Zeit in Haupt- und Geheimgebieten für Talentpunkte, Patronen, Windschatten und Rundenauswertung. `t` zählt Hauptspielzeit für Gebiete, Wellen, Hauptbosse und Portale. `secretTime` läuft im aktuellen Ruhrpott-Abstecher. `transition` hat eine eigene Zeitspanne von 3 s und wechselt das Gebiet nach 1,5 s.
- Ein Spielschritt prüft zuerst fällige Karten und aktualisiert Uhren, Bedrohung und Timer. Danach folgen Bewegung, Autofeuer und Spawns, die Bewegung der Projektile und Gegner, Bossverhalten, Treffer, Orbs, Flaschen und Ausrüstung. Ein Tod stoppt die weitere Simulation im selben Schritt. `beginTransition` beendet den aktuellen Spielschritt gezielt, damit nach dem Portalwechsel keine alten Kollisionen verarbeitet werden.
- Tastatur und Controller speisen dieselbe Bewegung. `updateGameplay` normalisiert diagonale Eingaben und begrenzt die Figur auf x = 30–928 und y = 90–506. Die Basisgeschwindigkeit beträgt `220 × 1,15 × 1,05 × 1,15` px/s vor Karten, Talenten und Ausrüstung. Beim Schaumwein ersetzt 300 den Wert 220.

[Rundenstart](../Pfert/game.js#L809) · [Simulation](../Pfert/game.js#L2714) · [Frame und Portalübergänge](../Pfert/game.js#L3210)

## Begegnungen und Schwierigkeitsanstieg

- Fünf Hauptgebiete wechseln alle 180 s Hauptspielzeit. Die ersten 90 s verwenden `introWaves`. Weitere feste Wellen liegen im Basar von 4:00 bis 5:00 vor dem ersten Boss und ab 12:00 bis 12:28 nach zwei gestarteten Hauptbossen. Außerhalb dieser Abschnitte tickt das reguläre Spawnbudget mit `(25 + 125 × min(t / 1200, 1)) / 60` pro Sekunde. Nach dem ersten Großwesir-Sieg kommt der Faktor 0,85 hinzu. Im Hauptspiel schaltet die Zeit alle 32 s einen weiteren Grundtyp frei, bis alle zehn Typen verfügbar sind.
- Hinterhalt, Blocker und Blockerpatrouillen laufen über eigene Zeitpläne. Fünf Bezirksformationen beginnen mit einer 1,6-s-Warnung, erstmals bei 2:12. Fällige Formationen werden bei Boss, Portal oder Sternenpost übersprungen. Die Sternenpost wartet auf eine freie Strecke. Ab 1:40 können Maschinen reguläre Spawns ersetzen. Seltene Sondergegner rotieren aus einem gemischten Vorrat, die Zeit bis zum nächsten beträgt 120–145 s.
- **Umgebungsgefahren.** Pro Hauptgebiet startet an einer festen Gebietssekunde eine Gefahrenfolge. Die Tabelle nennt Achse und freie Breite je Welle. `y` bedeutet eine horizontale Flugspur, `x` eine vertikale Passage. Auf derselben Achse wechselt die freie Spur zwischen y = 216 und 324 oder x = 340 und 620. Beim Achsenwechsel wird die erste Lage aus der Pfert-Position bestimmt.

| Gebiet | Sekunde im Gebiet | Herausforderung | Freie Spuren in Pixeln |
| --- | ---: | --- | --- |
| Goldene Stadt | 169 | Arkadenfeuer | y 144 → y 144 |
| Basar | 16 | Fallgitter | x 230 → x 212 |
| Wüste | 92 | Kreuzfeuer | y 120 → x 220 → y 108 |
| Bosporus | 70 | Flutkammer | y 120 → y 108 → y 96 |
| Palast | 110 | Palastgitter | x 226 → y 100 → x 196 |

- Die erste und alle vertikalen Warnphasen dauern 1,45 s, weitere horizontale Phasen 1,05 s. Jede Gefahrenzone ist 0,32 s aktiv. Ein überstehendes Kollisionsrechteck zählt einmal pro Welle als Kontakt und verwendet den normalen Schutz- und Schadenspfad. Eine berührungsfreie Passage bringt für zwei Wellen 350 und für drei Wellen 450 Punkte. Kartenwahl und Pause frieren die Phase ein. Die Gefahr fällt bei Bossen, einem Bossstart innerhalb von 6 s, Portalzielen, Ruhrpott, Sternenpost oder laufenden Formationen aus. Neue Sternenpost und Formationen warten bei aktiver Gefahr.
- **Vorstoß der Säbelteppiche.** Normale Säbelteppiche (Typ 6) erhöhen ihr Flugtempo ab Phase 1,1 s im 3-s-Zyklus für 0,63 s um 180 px/s. Das ergibt 113,4 zusätzliche Pixel statt 81 ohne Verlangsamung. Der Bewegungsschritt berücksichtigt den Zeitanteil im Sturmfenster. Die festen Flugspuren der Formationen behalten ihr eigenes Tempo.
- Die Bedrohung bildet aktive Karten und Hauptspielzeit ab. `komfort` ist die Rangsumme aus Heilung, Flugtempo, Magnet und Schutzimpuls. `synergien` ist `0,30 × Splittergelage + 0,25 × Kettenreaktion + 0,30 × Thermischer Schock + 0,35 × Echokammer + 0,30 × Mondschmelze`.

```text
Ziel = min(4,5, t / 440 + 0,055 × (alle Kartenränge − komfort)
                     + 0,5 × synergien + (Wein aktiv ? 0,1 : 0))
threat += (Ziel − threat) × min(1, dt × 0,25)

Standardgegner-HP = round(Typbasis × (1 + threat × 0,6) × (Elite ? 1,4 : 1))
                  × (Elite ? 1 : 0,9)
Typbasis nach Index 0–9 = [2, 3, 4, 5, 4, 6, 6, 9, 9, 14]
Elite-Chance = t > 120 ? min(0,22, 0,06 + t / 4500) : 0
```

Seltene Gegner haben `8 × (1 + threat × 0,6)` HP. Der reguläre Feuerabstand sinkt mit dem Faktor `1 / (1 + threat × 0,16)` und bei Eliten zusätzlich mit `1 / 1,12`. Der Feuertimer normaler Gegner einschließlich Eliten und Einführungswellen läuft mit Faktor 0,7: dadurch entstehen langfristig 30 % weniger Projektile, bei unveränderten Salven. Das gilt bereits für den ersten Schuss; ein bisheriger Abstand von 2 s dauert nun rund 2,86 s. Die Zielposition wird weiterhin 0,55 s vor dem Schuss gespeichert. Formationen, Maschinen, rückwärtige Gegner, Blocker und seltene Gegner behalten ihre bisherigen Feuertimer; Bosse bleiben unverändert.

[Wellen und Spawns](../Pfert/game.js#L1694) · [Standardgegner](../Pfert/game.js#L1779) · [Bedrohung](../Pfert/game.js#L2718)

## Bosse und Segment-Lebenspunkte

Hauptbosse sind erstmals ab 5:00 und danach im Raster von 300 s Hauptspielzeit fällig. `bossCount` zählt gestartete Hauptbosse. Ruhrpott-Bosse haben eine eigene Uhr und erhöhen diesen Zähler nicht. Die Sucuk und die Grubenlampe erscheinen einmal pro Runde ab Hauptspielminute 7 bzw. 14, sobald Platz zwischen Bosskämpfen ist. Ein erfolgreicher Abschuss öffnet das Portal, die Ziele können vorbeifliegen.

| ID | Boss | Erste Begegnung laut Zeitplan | Segmentgewichte in Layout-Reihenfolge | Gesamt-HP bei `threat = 0` |
| --- | --- | --- | --- | ---: |
| 0 | Großwesir der Teppiche | 5:00 | 1 / 1,5 / 1 | 427,2 |
| 1 | Sultan der Kaffeekessel | 10:00 | 1 / 1 / 2 / 1 | 556,8 |
| 2 | Pascha der Sucuk | 15:00 | 1 / 1 | 1.620 |
| 3 | Dschinn der Gewürzmühle | 20:00 | 1 / 1,5 / 1 | 1.822,8 |
| 4 | Großmeister der Basarkarawane | 25:00 | 1 / 1 / 1 / 1 / 1 | 2.028 |
| 7 | Prisma-Observatorium | 30:00 | 1 / 1 / 1 / 1 | 2.635,2 |
| 8 | Gezeitenwerft | 35:00 | 1 / 1 / 1 / 1 | 2.836,8 |
| 5 | Krasser Schalke-04-Fan | Ruhrpott 1 nach 45 s | 1 / 1 / 1 / 2 | 972 |
| 6 | Hochofen-Horst | Ruhrpott 2 nach 60 s | 1 / 1 / 2 / 1 / 1 | 330 |

```text
Zyklus = floor(bossCount / 7) vor dem Start
Hauptboss-Rohwert = (90 + Zyklus × 30 + Boss-ID × 15) × (1 + threat × 0,2)
Ruhrpott-Rohwert  = (Fan ? 120 : 155) × (1 + threat × 0,22)
Kalibrierung     = { Großwesir: 0,35, Sultan: 0,39, Horst: 0,155 }, sonst 1
HP-Topf          = Rohwert × 12,5 × 0,9 × Kalibrierung
Segment-HP       = ceil(HP-Topf × Segmentgewicht / Summe der Gewichte)
                   × 1,2 × (Fan ? 0,6 : 1)
Boss-HP          = Summe aller Segment-HP
```

Die Aufrundung erfolgt pro Segment vor den letzten Multiplikatoren. Beispiel Großwesir im ersten Zyklus bei `threat = 1`: Rohwert 108, HP-Topf 425,25, Segmente 146,4 / 219,6 / 146,4, zusammen 512,4 HP. Der Wert `boss.max` wird beim Aufbau vom Rohwert zur Summe der Segment-Maxima. Änderungen an Segmentgewichten oder Segmentzahl beeinflussen auch die Rundung und damit die Summe.

`PfertArt.bossLayout` liefert lokale Polygone, Zielpunkte `aim`, Rollen und Gewichte. `setupSegments` ergänzt Kollisionsgrenzen und HP. `partHit` schneidet die Segmentpolygone gegen das Trefferrechteck, bei gedrehten Strahlen nach Koordinatentransformation. Zerstörte Segmente können weder feuern noch Kontakt- oder Schusstreffer auslösen. Das letzte zerstörte Segment beendet den Kampf. Beim Start werden Flaschen zwischengespeichert und normale Gegner und Feindgeschosse entfernt. Nach dem Sieg kehren die Flaschen zurück, im Ruhrpott startet zusätzlich der Rückübergang.

`bossAttackPatterns` und `bossSpecials` definieren die Reihenfolge der normalen Angriffe und zwei Spezialangriffe je Boss. `bossVolley` wechselt zwischen lebenden Segmenten und speichert die Spezialwellen beim Warnsignal. Der Feuerabstand ist `Phasenintervall / ((1 + threat × 0,12) × attackRate)`. Die normale Basis beträgt 2,5 s, beim Großmeister 1,8 s und beim Sultan gilt `attackRate = 1,5`. Der Basar-Großwesir, der Sultan, beide Ruhrpott-Bosse sowie Prisma-Observatorium und Gezeitenwerft wechseln bei höchstens halben Gesamt-HP in Phase 2. Die Folge aus Warnung (1,1 s), Positionswechsel (0,65 s) und profilspezifischem Angriffsfenster steht in `updateBossEncounter`.

[Boss-Layout](../Pfert/art.js#L1330) · [Segment-HP und Kollision](../Pfert/game.js#L2293) · [Spawns und Phasen](../Pfert/game.js#L2396)

## Schaden vom Abschuss bis zum Treffer

**1. Angriff erzeugen.** `fireCharge(false)` erzeugt das Dauerfeuer des Basisskills oder der aktiven Weinwaffe. `fireSpecial` ruft mit aktivem Wein `fireCharge(true)` auf. Das Grundintervall eines Käseschusses beträgt `0,24 / 1,5 = 0,16 s`. Für die Lichtlanze gilt `0,62 / 1,5 ≈ 0,413 s`. Die Waffenintervalle und Boni für Feuerrate stehen in `shotInterval`. Der Spieler schießt automatisch. Ein Wein-Sonderangriff kostet standardmäßig 10 % der ursprünglichen Kapazität der Flasche, auch wenn weniger Restzeit vorhanden ist. Ausrüstung und Talente können die Kosten beeinflussen. Wein startet mit 18 s Grunddauer, die mit Karten, Talenten und Ausrüstung skaliert.

**2. Schaden beim Abschuss.** `damage` legt für einen neu erzeugten Grundangriff den Schaden und den Krit-Wurf fest. Kopien und Folgeeffekte können den Wert der Vorlage übernehmen. Käsereifung und Feinschliff sind getrennte Faktoren. Ausrüstungsboni für den Angriffstyp werden bei Standard-, Wein- und Sonderangriffen am Ende von `fireCharge` additiv im Ausrüstungsfaktor zusammengezählt und einmal multipliziert.

```text
Schaden = 0,8625 × Basis × S1-Faktor × 1,12^Käsereifung × (1 + 0,01 × Feinschliff)
          × Rauschfaktor × Niedrige-Herzen-Faktor × Q10-Rauschfaktor
          × (1 + Q1-Bonus + Vergeltungsbonus) × Wein-Talentfaktor × Krit-Faktor
0,8625 = 1,5 × playerHitDamage (0,575)
Krit-Chance = min(1, 0,05 × Goldene Rinde + A2-Krit-Chance + Ausrüstungs-Krit-Chance)
Ausrüstungsfaktor = 1 + Angriffstyp-Bonus + aktiver Rauschbonus
                      + aktiver Vollherzenbonus + aktiver Niedrige-Herzen-Bonus
```

S1 gibt ×1,03. Käserausch gibt aktiv ×1,35 vor weiteren Talenten, Q10 im Rausch zusätzlich ×1,5. Der normale Krit-Faktor ist 2 bei Erfolg und 1 sonst. A2-Talente und Ausrüstung können ihn ändern, A2-23 setzt den Faktor ohne Krit auf 0,85. Der Basiswert ist 1 für den Hauptschuss des Eisfächers und vor Stilfaktoren 6,5 für ein Standardprojektil aus dem Sonderangriff. Der Erdbolzen multipliziert den Hauptschuss mit 1,18 vor seinen Talentboni, der Glutkern mit 0,9 plus Nachbrennen. `fireCharge` ergänzt Angriffsmuster, den Indexfaktor für automatisches Weinfeuer, den Weinbonus ×1,15 und bei Sonderangriffen den Faktor `1 + 0,09 × Schnellgärung + 0,01 × Fingerfertigkeit` vor Sonderangriffstalenten. Die Lichtlanze startet mit `Basis = 1,22 × 1,6` vor Boni. Mehr Laserdauer erhöht bei ihr zusätzlich Schaden und Lebensdauer.

**3. Treffer auswerten.** Ein direkter Treffer startet mit dem gespeicherten Schaden des Angriffs. Bei Bossen erhalten geladene Projektile und Laser davor einen Faktor 0,35, mit Q8 zusätzlich ×1,075. `modifyDirectHit` berechnet direkte Zielboni, etwa Ersttreffer, hohe HP, Krit am Boss, Zielserie und vorhandene Elemente. Die Basarlaterne erhält für Treffer aus ihrer gepanzerten Vorderseite ×0,55. Beim Großwesir bekommt `Arme & Gewand` während Vorwarnung und Vorstoß ×0,65. `damageEnemy` und `damagePart` ergänzen bei weniger als 35 % Ziel-HP den Faktor `1 + 0,10 × Letzter Bissen`. Am Boss greift zusätzlich der gespeicherte Ausrüstungsfaktor `1 + bossDamage`. HP bleiben gebrochen. Der Kampf zeigt Trefferzustände und Balken über HUD und Effekte an.

**Vergleichswerte ohne Talente oder Ausrüstung.** Ein unverstärkter Eisfächer-Schuss trifft für 0,8625 und liefert theoretisch rund 5,39 Schaden/s auf ein durchgehend getroffenes Ziel. Zwei Ränge Käsereifung ergeben 1,08192 pro Hauptschuss. Der Lichtlanzen-Impuls trifft vor Boni für 1,6836 pro erfasstem Ziel. Beim Balancing einer Waffe zählen zusätzlich Trefferfläche, Anzahl der Ziele, Zweiteffekte und nutzbare Zeit mit Wein.

[Grundschaden](../Pfert/game.js#L1211) · [Angriffsaufbau](../Pfert/game.js#L1549) · [Treffermodifikatoren](../Pfert/game.js#L2422)

## Projektile, Laser und Elemente

| Mechanik | Berechnung und Zuständigkeit |
| --- | --- |
| Spielerprojektil | `addBullet` startet bei `player.x + 28 − offset, player.y − 2`. Geschwindigkeit `(geladen ? 650 + 170 × power : 470)`, bei schnellen Nadeln zusätzlich 260. Die Winkelkomponenten werden mit `1 + 0,06 × Rückenwind` multipliziert. Grundkantenlänge `(geladen ? 22 + 18 × power : Standardschuss ? 14 : 11) × (1 + 0,06 × Große Portion) × sqrt(scale)`. Standardlebensdauer 3,5 s. Waffenmuster und Talente verändern die Werte danach. |
| Zusatzschüsse | `extraShotScale` verteilt maximal sechs Plätze mit 24 / 24 / 17 / 17 / 11 / 11 % Stärke. Doppelter Käse belegt die ersten Plätze und setzt zusätzlich ×0,48 an. Streuflug belegt zwei weitere Plätze je Rang. Bei Eisfächer ohne Wein kommen passende Talente hinzu. Für andere Skills und Wein-Sonderangriffe gilt vor weiteren Effekten ×0,85 auf die Platzwerte. Zusätzliche Eisfächer-Schüsse aus Doppelter Käse starten damit bei je 11,52 % Grundstärke. Rückendeckung verwendet `1,2 × Rang` statt `0,2 × Rang`: 500 % mehr Schaden, also sechsfache bisherige Stärke (Rang 1: 120 %, Rang 4: 480 %). |
| Flug und Kollision | `updateGameplay` bewegt die Geschosse mit `vx × dt` und `vy × dt`. Waffen können Gravitation, Wellenwachstum, Orbit, Rückflug oder Vortexpulse hinzufügen. Spürnase lenkt zum nächsten sichtbaren, noch ungetroffenen Gegner in Flugrichtung, sonst zu einem lebenden Bosssegment. Schlangenlinie addiert eine Sinusverschiebung. Spielerprojektil und regulärer Gegner kollidieren über achsenparallele Rechtecke, Bosse über ihre Segmentpolygone. |
| Durchschlag und Kartenformen | `hit` am Projektil ist eine Zielmenge gegen Mehrfachtreffer. `remaining` aus Harte Kruste zählt zusätzliche Ziele, `pierce` erlaubt fortlaufenden Durchschlag. Bumerangkäse dreht nach dem letzten erlaubten Treffer oder einer Sekunde freiem Flug um, setzt die Zielmenge zurück und senkt den Schaden auf 55 %. Sprungkruste fügt einen Abpraller bei y = 80 bzw. 510 hinzu und erzeugt beim ersten Abpraller einen Splitter mit 21 % Schaden. |
| Lichtlanze und Weinlaser | `updateBeam` bindet den Ursprung an die aktuelle Pfert-Position. `traceBeam` prüft alle Ziele entlang des Strahls. Die Lichtlanze trifft einmal pro Impuls, bei suchenden oder schlängelnden Impulsen sichert eine Zielmenge einen Treffer pro Ziel. Port- und Tokaj-Laser treffen bei aktivem Strahl im Abstand von 0,12 s. |
| Umlaufgeschosse | Käsekarussell ergänzt den automatischen Angriff um eine Kugel im Radius 96 px mit 55 % seines Schadens. Mondorbit (Muskat) feuert geradeaus und ergänzt zwei um 180° versetzte Monde im Radius 46 px mit je 45 % des Schussschadens bis zum Weinende. Der gerade Schuss nutzt den automatischen Mondorbit-Balancefaktor 1,875 und zielt auf rund 6,2 Schaden/s am einzelnen Ziel außerhalb der Umlaufbahn. Der Sonderangriff behält drei abfliegende Monde. Jedes bleibende Geschoss trifft je Ziel einmal pro 0,65-s-Umlauf. Die Umläufer teilen sich den Treffercode mit den Projektilen und liegen außerhalb des 360er-Pools. |
| Feindprojektile | `hostileProjectile` skaliert die vorgegebene Startgeschwindigkeit mit `1,3 × 1,1 × (1 + threat × 0,075)` und die Gravitation mit `1,3 × 1,1`. `emitHostileShot` dosiert Gegnerprojektile über ein 3/4-Budget und ergänzt jeden vierten aufgenommenen Boss-Schuss um eine Variante. `projectile` versucht außerdem bei jedem fünften bewegten Aufruf ein Zusatzgeschoss. Minen und Splitter können zeitgesteuert zerplatzen. Boss-Fußbälle enden nach fünf Abprallern. |
| Obergrenzen | Höchstens 360 Spielerprojektile und 216 Feindgeschosse. Bei vollem Spielerpool räumt ein neuer physischer Hauptangriff dem Hauptschuss Platz ein. Lebensdauer und Spielfeldgrenzen entfernen verbrauchte Projektile. Laser haben eine eigene Liste. Die Darstellung behält Formen und Spuren auch bei hoher Dichte. |

Die Elemente werden beim Abschuss in `elements` festgehalten. Frost addiert den neuen Anteil auf den noch unverlangsamten Rest, bis höchstens 65 % erreicht sind. Feuer setzt die Brenndauer auf 1,8 s vor Talentfaktoren und behält den höchsten anliegenden Brennschaden pro Sekunde. Normale Gegner brennen pro Simulationsschritt, Bosssegmente in gesammelten Ticks ab 0,25 s. `onHit` leitet Brennen, Frost, elektrische Ketten, Thermischen Schock und Splitter ein. Ketten suchen nacheinander reguläre Gegner im Radius 120 px, bei Waffen-Ketten 175 px, und beginnen bei 20 % bzw. 50 % des gespeicherten Schadens vor Kettenreaktion `1,45^Rang`. Erde liefert mindestens zwei Basissplitter. Käsebruch-Splitter übernehmen 12,6 % des auslösenden Schadens, andere Treffer-Splitter 21 %. Pro Treffer entstehen höchstens sieben Splitter und höchstens eine Kindgeneration.

Direkttreffer, Brennen, Splitter, Ketten und Flächenschaden haben eigene Pfade. Bei neuen Effekten die gewünschten Zielklassen ausdrücklich prüfen. `splash` und der Thermische Schock verteilen ihre Flächentreffer auf reguläre Gegner. Bosssegmente können direkt getroffen, verlangsamt und in Brand gesetzt werden. Suchraketen und Räumstrahl haben eigene Schadenspfade.

[Projektilanlage](../Pfert/game.js#L1285) · [Feindgeschosse](../Pfert/game.js#L1922) · [Laser](../Pfert/game.js#L2327) · [Elemente und Splitter](../Pfert/game.js#L2454)

## Überleben, Beute und Karten

- **Schutz.** Feindgeschosse werden zuerst vom aktiven Räumstrahl, dann vom temporären Schild, der Talentwache und der nachladenden Schutzkapsel abgefangen. Ein durchgekommener Treffer geht an `hurt`. Dort folgen Unverwundbarkeit, einmaliger Talentschutz, Rosé-Schutz und sonst ein Herzverlust. Gegner- und Bosskontakt rufen `hurt` direkt auf. Unverwundbarkeit nach einem Treffer dauert vor Boni 1,5 s. Alle 300 s aktiver Spielzeit füllt das Spiel ein Herz auf. Bei null Herzen beendet `end` die Runde, sofern kein Talent sie rettet.
- **Käserausch und Flugmanöver.** `addRage` sammelt Käserausch aus Abschüssen, Blocks und Streifpunkten bis 100. `activateRage` leert den Vorrat, heilt vor Modifikatoren zwei Herzen, entfernt sichtbare Feindgeschosse und besiegt sichtbare Gegner einschließlich seltener Gegner und ihrer regulären Belohnungen. Bosssegmente bleiben im Kampf. Der Rausch dauert 12 s vor Boni und ergänzt das Dauerfeuer um Seitenangriffe. Drei unterschiedliche knappe Ausweichmanöver in 2,5 s gewähren Windschatten mit 125 Zusatzpunkten und bis zu 1,5 s Nachladeschub für jede gerade nachladende Patrone.
- **Flaschen und Feld-Power-ups.** `updatePickupSpawns` behandelt Wein, Heilmost und Sonderwein. Von Sekunde 45 bis vor Sekunde 90 kann ein ersatzweiser Waffenwein in Pfert-Höhe erscheinen, wenn im Run bisher keiner aufgetaucht ist. `updateFieldPowerupSpawns` zählt 45–65 s spielbare Hauptzeit außerhalb von Bosskämpfen und zieht aus einer gemischten Dreierfolge. Das Raketenset hat fünf Ladungen. Suchraketen sind doppelt breit und hoch (Trefferrechteck 24 × 20 statt 12 × 10 px); kreisende und gestartete Raketen verwenden dieselbe doppelt große Canvas-Grafik mit Metallrumpf, Spitze, Heckflossen und beim Flug einer Triebwerksflamme. Bei Zielen bis 200 px liegen mindestens 0,6 s zwischen Starts. Der Schild absorbiert zwei Geschosse in acht Sekunden vor Boni. Der Räumstrahl hält vier Sekunden, prüft sein Ziel in 0,16-s-Ticks und entfernt Feindgeschosse auf der Strahllinie.
- **XP und Stufen.** `death` erzeugt Gegner-Orbs mit Typbasis, Elite- und möglichen Talentfaktoren. Rote und goldene Orbs und Boss-Orbs verdoppeln bei `dropOrb` den übergebenen XP-Wert einmal. Beim Einsammeln ergibt sich `Orbwert × 1,875 × (1 + Talentbonus) × (1 + Ausrüstungsbonus)`. Der Ansaugradius startet bei 78 px. Bei Stufenaufstieg zieht `chooseCard` die Kosten ab und erhöht den Bedarf auf `min(1500, ceil(alte Kosten × (neue Stufe < 10 ? 1,5 : 1,12)))`. Rest-XP können sofort eine weitere Auswahl öffnen.
- **Kartenauswahl.** `cardDefs` definiert Ränge und Voraussetzungen, `cardValues` die Rechenwerte. `offerCards` entfernt ausgeschöpfte und für den aktuellen Build unbrauchbare Karten und zieht bis zu drei verschiedene Angebote. Ein möglicher dritter Platz wird für eine passende Skill-Empfehlung genutzt, sofern noch keine enthalten ist. Seltene Synergien werden ab 120 s aktiver Spielzeit mit passenden Vorstufen berücksichtigt. Wiederholbare Karten füllen einen zu kleinen normalen Kartenpool. Die Karten gelten bis zum Ende dieser Runde.
- **Patronen und Sternenpost.** Karten AK–AT legen je eine Patronenart frei. Das Nachladeintervall ist `Tabellenbasis / 2,60`, die Hälfte des bisherigen Intervalls `Tabellenbasis / 1,30`, und liegt bei rund 0,92 bis 2,46 s. Die Zündrakete lädt zum Beispiel in rund 1,77 s. `dischargeCartridge` feuert bei einem automatischen Basisskill-Angriff höchstens eine bereite Patrone ab; tatsächliche Starts bleiben damit an Basisskill-Angriffe gebunden. `cartridgeReady` hält absolute Zeitpunkte auf `runTime`. Sternenpost verlangt drei Siegel in Reihenfolge und gibt nach Abschluss zehn Orbs plus 30 % Itemchance, wenn ein Item verfügbar ist. Die nächste Gelegenheit ist frühestens 110 s Hauptspielzeit später.
- **Ausrüstung.** `gearCatalog` definiert 50 Items für fünf Plätze. Boss-Siege, seltene Gegner und Sternenpost können gezielt Beute auslösen. `chooseGearDrop` würfelt unter den verfügbaren Seltenheiten und schließt bereits getragene, eingelagerte und offen liegende Items aus. `equipGear` summiert die Effekte der getragenen Items neu. Zwischen acht Reserveplätzen und fünf Ausrüstungsplätzen wird im Pausenmenü getauscht. Offene Beute läuft nach 20 s aktiver Spielzeit ab, die Beute eines Ruhrpott-Bosses wartet auf die Rückkehr ins Hauptspiel.

[Schutz und Punkte](../Pfert/game.js#L2193) · [Kartenwahl](../Pfert/game.js#L1158) · [Inventar und Beute](../Pfert/game.js#L288)

## Dauerhafte Talente und Punktetafel

- `PfertMeta` verwaltet die fünf Startknoten, 15 Talentcluster und zehn Querverbindungen. Ein Kauf kostet einen Punkt und erfordert außer bei S1 einen erreichbaren Nachbarn. Gebündelte Knoten haben bis zu fünf Ränge. `canonical` und `rank` halten frühere Knoten-IDs als Käufe gültig. Der Verkauf ist nur möglich, wenn danach alle gekauften Knoten mit S1 verbunden bleiben.
- `bankRunTalents` bucht einen Punkt je 600 s kumulierter aktiver Spielzeit und je Boss-Sieg. Es speichert bei fälligen Punkten sowie den Zeitrest beim regulären Rundenende, beim Verbergen des Tabs oder bei `pagehide`. `metaSavedAt` verhindert doppelte Zeitgutschrift. Der versionierte Stand `{version, points, seconds, purchased}` liegt in `localStorage` unter `pfert.meta.v1`. Import und Export nutzen dieselbe Validierung. Debug-Runden werden getrennt geführt.
- `game.js` wertet Talente über `owns` und `metaCount` aus. Änderungen an Talenttexten und Icons werden mit `node tests/build-meta-data.cjs` in [meta-data.js](../Pfert/meta-data.js) übernommen. Der Generator liest den [Talentbaum-Entwurf](Meta%20progression.md) und [die Icon-Daten](../tests/assets/tabler-talent-icons.json).
- Normale Abschüsse zählen `round((100 + Gegnerindex × 35) × Elitefaktor × (1 + min(2, combo × 0,04)) × Ladefaktor)` Punkte. Die Kette hält vier Sekunden seit dem letzten Abschuss. Ein Bosssegment bringt 500 Punkte, der Bossabschluss zusätzlich `2000 + Boss-ID × 500`. `saveScore` schreibt bei regulärem Tod die jüngsten zehn Runs unter `pfert-scoreboard-v1` und sortiert für die Anzeige nach Punkten, bei Gleichstand jüngere Runs zuerst. Freiwilliges Rundenende erzeugt eine Auswertung ohne Punktetafeleintrag.

[Talentgraph und Speicherung](../Pfert/meta.js) · [Talentgutschrift](../Pfert/game.js#L431) · [Punktetafel](../Pfert/game.js#L2242)

## Darstellung, Audio und Debug

- `render` zeichnet zuerst das Parallax-Panorama, dann Objekte und Kampf in Canvas-Ebenen und zuletzt das HUD über `PfertArt.hud`. Umgebungsgefahren entsättigen den gesamten Hintergrund unter dem HUD. Die Gefahrenflächen liegen hinter den Spielfiguren, Spurmarkierungen über den dekorativen Effekten und Feindgeschosse darüber. Segmentbrüche am Zielpunkt nutzen einen 0,55-s-Effekt mit weniger Bruchstücken bei reduzierter Bewegung. Ausrüstungsmedaillons nutzen pro Slot und Seltenheitsfarbe einen gecachten Sprite mit separatem Zeitbalken. Das HUD liest unter anderem aktuelles und maximales Segmentleben, Weinfüllstand, Patronen, Käsekette, Talente und XP aus dem Spielzustand. Menüs liegen als HTML-Overlay über dem Canvas. Das Pausenmenü verwendet dieselben gesammelten Karten wie das HUD und zeigt sie direkt mit ihrem Rang in einer bei Bedarf scrollbaren Liste. Die Systemeinstellung für reduzierte Bewegung wirkt auf Bildwackeln, Schadensrahmen und reguläre Gebietsüberblendungen.
- `PfertAssets` lädt Laufzeitbilder relativ zu `Pfert/index.html`. `PfertArt` skaliert Sprite-Ausschnitte mit deaktivierter Bildinterpolation und nutzt Canvas-Zeichnungen bei fehlenden Bildern. Boss-Polygone sind gemeinsame Daten für Kampf und Grafik. Vor Änderungen an einem Boss-Sprite müssen sichtbare Flächen, Trefferpolygon und Zielpunkt zusammenpassen. [Grafikrichtlinie](ARTWORK.md)
- Beim ersten Zeichnen speichert `PfertArt` die Leuchthöfe von Projektilen je Farbe und die vier weichgezeichneten Frost-, Feuer- und Erdpartikel in Canvas-Sprites. Beim Zeichnen bleiben Radius und additive Überblendung der Leuchthöfe sowie Anzahl, Flugbewegung und Farben der Partikel erhalten. Blitzlinien, Leuchtspuren und Warnmarkierungen werden weiter pro Frame gezeichnet.
- `PfertSound.play` mischt synthetische Effekte mit 16 Stimmen, davon vier für wichtige Signale reserviert. Die Musik-Playlist startet gemischt mit der Runde und stoppt beim Rundenende. Hintergrund-Tabs pausieren Musik, und die Lautstärke liegt unter `pfert-music-volume`. [Audiocode](../Pfert/sound.js)
- Numpad 0 schaltet ausschließlich im Hauptmenü die Unsterblichkeit um; Tastenwiederholung wird ignoriert. Das Hauptmenü zeigt keinen Hinweis auf den versteckten Schalter. Neue Runden übernehmen den Wert als `player.immortal`; `hurt` fängt damit jeden Herzschaden vor Talenten und Schutzverbrauch ab. Die Einstellung bleibt bis zum Umschalten oder Neuladen erhalten.
- `debugBossJump` benutzt dieselben Startfunktionen wie reguläre Begegnungen. Der Debug-Einstieg setzt den Bosszähler für die jeweilige Begegnung und die Runde wertet Ergebnisse separat aus. Die Tasten für direkte Boss-Sprünge stehen in der [Spielanleitung](README.md#fortschritt-und-geheimnisse).

[Canvas-Renderer und HUD-Daten](../Pfert/game.js#L3072) · [Debug-Einstieg](../Pfert/game.js#L1015)

## Änderungen vorbereiten

1. Bei einer neuen Regel zuerst in der [Roadmap](ROADMAP.md) den gewünschten Effekt und die betroffenen Fälle festhalten. Für Zahlenänderungen Startwert, Multiplikatoren, Rundung und mindestens einen konkreten Zielwert angeben. Bei Bossen zusätzlich Boss-ID, Segment und Vergleichs-Bedrohung festlegen.
2. Den zuständigen Einstiegspunkt in diesem Dokument verwenden. Für eine Schadensänderung getrennt Abschuss und Treffer prüfen, für einen Boss neben den HP auch Teilegeometrie, Feuermuster und Belohnungen. Für eine neue Karte gehören Angebot, Ranggrenze, Texte und tatsächliche Wirkung zusammen.
3. Die neue Regel mit dem passenden Test aus der [Testanleitung](../tests/README.md) prüfen. Formel, Beispiel und Auswirkungen hier zusammen mit dem Code aktualisieren. Beobachtungen zu Spielgefühl und Darstellung beim manuellen Spieltest in der Roadmap dokumentieren.
