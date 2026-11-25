# Pfert – Testfeedback vom 11.11.2026

## Kampflesbarkeit, Bedienung und Audio · 25.11.2026

- [x] Der große Teppich markiert die beiden Schusslinien vor seiner Salve. Impulsangriffe zeigen die Breite und Reichweite des Strahls. Gerade Boss-Sonderangriffe zeichnen ihre Flugspur bis zum Spielfeldrand. Warnungen und Sternenpost-Siegel bleiben vor dekorativen Effekten sichtbar. Aktive Feindgeschosse liegen weiterhin darüber.
- [x] Ein Herzverlust färbt für 180 Millisekunden nur den Spielfeldrand. Bei reduzierter Bewegung bleibt der Rand ruhig. Die vier Elementartreffer verwenden je zwei wiederverwendete Pixelgrafiken. Pause und Auswahlmenüs zeichnen das stehende Spielfeld einmal und fragen den Controller weiter ab.
- [x] Basisskill- und Kartenwahl halten Tastaturfokus und Auswahl synchron. Beim Wiederöffnen ist der zuletzt bestätigte Basisskill markiert. Ein Mausklick öffnet den Rucksack mit gültiger Auswahl. Im Pausenmenü erreicht das Steuerkreuz die Musiklautstärke und ändert sie in 5-%-Schritten.
- [x] Die Musiklautstärke bleibt nach dem Neuladen gespeichert. Im ausgeblendeten Tab pausiert der Titel an seiner Position. Alle Boss-Siege haben eine kurze Fanfare und auch die Ruhrpott-Bosse erscheinen mit Namen in der Siegesmeldung.
- [ ] Browser-Spieltest und Hörprobe für die Warnspuren bei dichtem Feuer, den Herzverlust, die Lautstärkeregelung per Controller und die Boss-Fanfare.

## Grafik und Kampf · 25.11.2026

- [x] Die 32 Gegnertypen und neun Bosse nutzen materialabhängige Lichtkanten und gestaffelte Schatten. Fünf Ruhrpott-Gegner, drei Karawanenmaschinen und fünf Bosse haben eigene neue Sprites. Die Portalziele passen zur Figurenoptik. Schlotzonen, Messingwiege und Karawanenmeister-Beine wurden an die sichtbaren Bauteile angepasst. Native Canvas-Vorschauen zeigen alle Kategorien sowie Trefferblitz und zerstörtes Segment.
- [x] Alle neun Bosse erhalten je Segment exakt 20 % mehr Lebenspunkte. Die gezielte Prüfung erfasst Hauptbosse, beide Ruhrpott-Bosse, Segmentwerte und alle 18 Sonderangriffe. Der laufende Sonderangriff hat eine eigene Zeile in der Bossanzeige. Ein dunkler Konturstrich hebt die Richtungs- und Spurenwarnung vom Panorama ab.
- [x] Vier eigenständige Panoramen, fünf Hauptgebiete mit Vordergrunddetails und zwei Ruhrpott-Abstecher mit zusätzlichen Gleisen zeichnen bei nativer Größe. Die Außenkulisse des Ruhrpotts erhält überarbeitete Spielfassaden. Die Hauptgebiete blenden kurz über und wechseln bei reduzierter Bewegung direkt. Asset-Zuschnitte, Ladefallback und Parallaxen sind gezielt geprüft.
- [x] Teppichstaffel, Basarwache, Dünenpatrouille, Zangenflug und Palastgarde setzen ab 2:12 zusätzliche Herausforderungen. Randpfeile und Signal kündigen die 1,6 Sekunden Vorwarnzeit an. Einflug, zwei gerade Salven, Pause und Abstimmung mit Bossen und Sternenpost sind gezielt geprüft.
- [x] Der Einstieg hat weiter 25 Gegner in der ersten Minute. Im stationären Prüflauf erscheint die erste Karte vor und nach dem Grafik- und Kampfpass bei 55,8 Sekunden. Der veraltete Erwartungswert von 45 Sekunden in der Prüfung wurde auf die erste Minute angepasst.
- [x] `Pfert.zip` enthält die spielbereite Fassung. Alle 40 Dateien im Archiv wurden per SHA-256 mit dem Spielordner verglichen.
- [ ] Im Browser Bildrate auf dem Zielgerät, Lesbarkeit aller Gegner unter dichtem Feuer und praktische Schwierigkeit der verlängerten Bosskämpfe mit mehreren Builds abnehmen.

## Neue Aufgaben · 25.11.2026

- [x] Sternenpost-Orbs breiten sich auf einen Kreis mit 128 Pixeln Radius aus. Sie bleiben an ihren Positionen und werden erst eingesammelt, wenn das Pfert losfliegt und sie berührt. Der Kreis bleibt auch am Rand im Spielfeld.
- [x] Splitter verursachen weitere 30 % weniger Schaden. Käsebruch liegt bei 12,6 % des auslösenden Schadens, übrige Treffer- und Abprallsplitter bei 21 %. Doppelkäse-Kopien verursachen weitere 20 % weniger Schaden.
- [x] Waffenweine mit Sonderangriffen erscheinen 70 % seltener als vor der Anpassung. Die Chance je vorgesehenem Versuch sinkt von 40 % auf 12 %.

- [x] **Cooldown-Anzeigen:** Festes 5×2-Patronenraster oben rechts. Jede Patrone hat einen eigenen Timerbalken, graue Slots bleiben sichtbar. Ein kurzer Impuls unterscheidet den tatsächlichen Abschuss von Schussbereitschaft. Rotation und Windschatten-Nachladung sind automatisiert geprüft.
- [ ] **Gegnergrafiken und Stilrichtlinie:** Der Grafik- und Kampfpass setzt die [16-Bit-Richtlinie](assets/ARTWORK.md#verbindlicher-16-bit-retrostil) für alle Gegnertypen um. Einheitlichkeit und Lesbarkeit bei dichtem Feuer im Browser abnehmen.
- [ ] **Gebäude:** Grafikrichtlinie anhand vorhandener Bosporus- und Ruhrpott-Kulissen ergänzt. Maschinenhalle Zweckel mit Rundbogenfenstern, Lisenen und gestufter Fassade überarbeitet. Getränke Kopatz übernimmt Schriftzug und Kronkorkenmotiv aus der Anzeige des Geschäfts. Eindeutiges Fassadenfoto für den Abgleich von Dach, Eingängen und Fenstern fehlt. Beide Gebäude bei Spielgröße im Browser abnehmen.
- [x] **Laser:** Lichtlanze und Sonnenlanze laden doppelt so lange und verursachen pro Schuss 60 % mehr Schaden. Die sichtbare Strahlbreite ist halbiert, die Trefferbreite bleibt gleich. Hauptstrahlen sind deckend, Kopien verwenden 80 % Deckkraft. Suchraketen, Schild und Räumstrahl mischen Rot, Grün und Blau. Der Räumstrahl behält seine eigene Pulsfrequenz. Zielwahl, Laserfarbe und Laserkreisel sind gezielt geprüft.
- [x] **Sternenpost:** Drei Siegel lösen eine Belohnung aus. 30 % Itemchance über die vorhandene Beuteverteilung, sonst zehn einsammelbare Orbs à einem Basis-EP. Ist kein Item verfügbar, fallen Orbs. Beide Ausgänge und das Zeitfenster sind automatisiert geprüft.
- [x] **Runde beenden:** Esc-Menü zeigt einen Knopf mit Bestätigung. Das freiwillige Rundenende zeigt die Auswertung ohne Eintrag in die Punktetafel. Eingaben und Auswertung sind gezielt geprüft.
- [x] **Todessound:** Vorhandenes Todessignal beim tatsächlichen Game Over einmalig auslösen. Freiwilliges Rundenende bleibt ohne Todessignal. Beide Pfade automatisiert geprüft.
- [ ] **Herzverlust bei leerem Schild:** Numerischer Herzverlust direkt nach der letzten Schildladung und Schutz während Unverwundbarkeit automatisiert bestätigt. Angezeigte Schutzgründe für Schild, Kapsel, Wein, Talente und Unverwundbarkeit ergänzt. Der gemeldete sporadische Fall ist bisher nicht reproduziert. Im Browser bei erneutem Auftreten den angezeigten Schutzgrund prüfen.
- [x] **Vier Startschüsse:** Eisfächer bremst, Glutkern brennt nach, Erdbolzen trifft einzelne Ziele schwer und die Wind-Lichtlanze trifft durch die gesamte Spur. Eigene Formen für alle vier und passende Kartenangebote ergänzt. Trefferverhalten und Auswahl geprüft.
- [x] **Schussverzweigung und Doppelkäse:** 40 % weniger Schaden für Treffer-Splitter und Doppelkäse-Kopien, bei gleicher Anzahl. Käsebruch fällt von 30 % auf 18 %, andere Treffer-Splitter von 50 % auf 30 %. Streuflug und Abprall-Splitter behalten ihre Faktoren.

## Versandordner · 25.11.2026

- [x] Spiel und Laufzeit-Assets liegen in `Pfert/`. Tests, Dokumentation, Vorschauen und Quelldaten liegen in `tests/`.

## Kampfanzeigen und Rundenauswertung · 25.11.2026

- [x] Die Käsekette zeigt ihre Restzeit im HUD. Nach dem letzten Segment erscheint bei Hauptbossen eine Siegesmeldung mit Namen.
- [x] Der Endbildschirm zeigt Stufe, Abschüsse, Boss-Siege, beste Käsekette, Windschatten und Sternenpost. Die Aktionen stehen über der Punktetafel. Der zuletzt gewählte Basisskill ist beim nächsten Run vorausgewählt.
- [x] Die Systemeinstellung „Bewegung reduzieren“ schaltet Bildwackeln und den roten Vollbildblitz ab. Der Ruhrpott-Wechsel nutzt eine Blende. In einem ausgeblendeten Tab ruht die Spielschleife samt Controller-Abfrage. Der letzte Herzverlust stoppt den Kampf sofort.
- [x] Gezielte Node-Prüfungen für neue Rundenzähler, Neustart, Timer samt Pause, Bossabschluss, Windschatten, Sternenpost, Eingaben, Punktetafel und reduzierte Canvas-Effekte bestanden.
- [ ] Browser-Spieltest für die Lesbarkeit des Endbildschirms und des Käseketten-Balkens sowie den Ruhrpott-Übergang mit aktivierter Systemeinstellung.

## Balance, Basisskills und Ruhrpott · 25.11.2026

- [x] Vier wählbare Basisskills für jeden Run. Passende Kartenempfehlungen und Talentboni geben jedem Build einen eigenen Einstieg. Zusatzgeschosse verlieren mit weiteren Kopien an Schaden. Krit und Letzter Bissen stärken Einzelziel-Builds.
- [x] Talentbaum mit fünf Bereichen, 15 benannten Clustern, hervorgehobenen Abschlussknoten und sichtbaren Querverbindungen. Talentpunkte, gekaufte Ränge und Verbindungen bleiben erhalten.
- [ ] Talenttexte nutzen zoomabhängige Bereichs- und Clusterschrift. Der Tooltip zeigt Namen und Effekt auch bei gesperrten Talenten, damit sich weitere Pfade vor dem Kauf planen lassen. Detailtexte ausgewählter Talente stehen in der Seitenleiste. Lesbarkeit auf kleinen Ansichten und über die Zoomstufen im Browser abnehmen.
- [x] Alle 15 Cluster-Einstiege sind direkt nach S1 kaufbar, einschließlich Wein, Beute und Käserausch. Alte Pfade bleiben gültig. Direkte Kaufbarkeit und vollständiger Baum sind automatisiert geprüft.
- [ ] Der Talentbaum nutzt mit 3130 × 2460 rund fünfmal so viel Layoutfläche. Direkte Einstiegslinien verlaufen radial, Querverbindungen und alte Nebenpfade sind gestrichelt. Sichtbarkeit einzelner Wege und Kreuzungen im Browser abnehmen.
- [x] Ziehen mit der Maus verschiebt die Talentansicht. Natives Drag-and-drop ist im Talentbaum deaktiviert. Kurze Klicks wählen weiterhin Talente, nach einer Ziehbewegung wird kein Knotenklick ausgelöst. Mausablauf automatisiert geprüft.
- [x] Lichtlanze als Laser-Basisskill und Sonnenlanze als echte Laserpatrone. Der Räumstrahl hält vier Sekunden, markiert einzelne Gegner und Bosssegmente, verursacht Schaden und räumt die Strahlspur.
- [x] Käsekarussell dreht die Lichtlanze einmal um das Pfert und feuert anschließend nach vorn. Doppelter Käse, Streuflug und Echos können zusätzliche Strahlen erzeugen. Unwirksame Karten werden für den Laser-Build ausgefiltert. Kreis- und Vorwärtstreffer, Strahlkopien und Kartenauswahl sind gezielt automatisiert geprüft.
- [ ] Browser-Spieltest für Sichtbarkeit, Treffergefühl und Balance des Laserkreisels.
- [x] Level-up-Karten mit Enter oder X / Quadrat bestätigen. Leertaste und A / Kreuz bleiben beim Wein-Sonderangriff.
- [x] Maschinenhalle Zweckel und Getränke Jörg Kopatz ergänzen die Puszta-Stube im ersten Ruhrpott-Abstecher.
- [ ] Browser-Spieltest für Cluster-Lesbarkeit beim Zoomen, Laser-Zielwechsel unter Beschuss, Schilder und Build-Balance über mehrere Runs. Die Mechaniken, Talentwege und Ruhrpott-Renderpfade sind gezielt automatisiert geprüft. Ein stationärer Fünf-Sekunden-Vergleich mit insgesamt sechs Kartenrängen (je zwei in Schaden, Doppelkäse und Streuflug) ergab am Einzelziel 7,40 Schaden/s für Erde und 8,42 für Wind. Bei vier Zielen in einer Spur ergaben sich 7,40 und 28,93. Live-Balance und Build-Rollen über mehrere Runs prüfen. Der breitere Asset-Test meldet einen abweichenden Erwartungswert für die Bosporus-Brüstung.

## Windschatten und Spielfluss · 25.11.2026

- [x] Windschatten verknüpft drei Streifer in 2,5 Sekunden mit Punkten und Nachladung. Rauten, Ladebalken und ein kurzer Zweiklang geben Rückmeldung.
- [x] Präzisionsflug über Shift, LB und L1 samt Trefferflächenanzeige entfernt. Das Flugtempo bleibt bei gedrückter Taste gleich.
- [x] Sternenpost ergänzt freiwillige Dreierfolgen von Flugsiegeln mit drei aufsteigenden Tönen. Ein erfolgreicher Flug bringt seit der neuen Belohnungsregel ein Item oder zehn XP-Orbs. Pausen frieren das Zeitfenster ein, Boss- und Portalwechsel räumen die Siegel ab.
- [x] Talentabfragen verwenden zwischengespeicherte Besitzstände und Gruppenränge. Kartenliste, Schildanzeige und die Punkte der Geschossschweife werden wiederverwendet. Der HUD-Platz reicht auch für alle 46 Karten.
- [x] Vergleich vor/nach der Änderung: 600 Updates à 1/60 s mit 120 gekauften Talenträngen und gleicher Zufallsfolge. Median von sechs Messläufen nach einem Warmlauf: 31,6 ms → 13,9 ms für die Spiellogik in Node.
- [x] Gezielte Tests: Windschatten und Sternenpost, Patronenrotation, Eingaben, Talentwirkungen, Soundereignisse und Darstellung unter Geschosslast.
- [ ] Browser-Spieltest: Bildrate auf dem Zielgerät, Sichtbarkeit der Siegel bei dichtem Feuer, Fluggefühl mit Controller und Lautstärke der neuen Signale.

## Ausbau · Die mechanische Karawane · 25.11.2026

1. [x] Zehn einzeln ziehbare Karten ergänzen das Standardfeuer. AK–AT laden separat nach und wechseln sich bei gleichzeitig bereiten Patronen ab.
2. [x] Spurweber, Kieltaucher und Splitterbake erscheinen ab 1:40 in regulären Wellen. Die drei Maschinen haben eigene Silhouetten, Mündungswarnungen und Angriffsmuster.
3. [x] Prisma-Observatorium und Gezeitenwerft erweitern die Hauptrotation. Beide haben vier Treffersegmente, einen Phasenwechsel und jeweils zwei angekündigte Sonderangriffe. Direkteinstieg über Umschalt + Num 2 oder Num 3.
4. [x] Facetten, versetzte Spriteschatten, gestufte Flugneigung und zwei Mauerreihen mit Parallaxe ergänzen die Pixelgrafik. Himmel, Mauerstücke und Patronenbilder werden wiederverwendet. Kettentreffer wählen Nachbarn in einem Durchlauf.
5. [x] Gezielte Prüfungen bestanden: `node test-encounters.cjs --caravan` und `node test-encounters.cjs --boss-attacks`. Geprüft wurden unter anderem Nachladung, Kartenrotation, Trefferwirkungen, drei Gegnermuster, Bossabschlüsse und die Warnungen aller 18 Boss-Sonderangriffe.
6. [ ] Im Browser offen: Tiefenwirkung und Lesbarkeit bei dichtem Feuer, Schwierigkeit der neuen Begegnungen sowie Bildrate und Gleichmäßigkeit auf dem Zielgerät.

Diese Übersicht hält die geplanten Änderungen und ihren Fortschritt fest. Ein Punkt wird erst nach Umsetzung und Prüfung abgehakt. Teilfortschritt und offene Entscheidungen stehen direkt beim jeweiligen Punkt. Die Modell- und Reasoning-Empfehlungen sind Ausgangspunkte und können je nach Verfügbarkeit und tatsächlicher Schwierigkeit angepasst werden.

## Ausrüstung im Run · 20.11.2026

- [x] **50 Items und garantierte Beute:** Alle sieben Bosse und zehn seltenen Sondergegnertypen lassen je ein Item fallen. Geprüft sind Ziehung, Ablauf, Nachbrennen, Käserausch und die Beute nach beiden Ruhrpott-Rückwegen.
- [x] **Ausrüstung und Rucksack:** Fünf Ausrüstungsplätze, vier Reserveplätze, Tausch in der Pause und Auswahl bei vollem Rucksack. `node test-items.cjs` prüft Maus, Tastatur und Controller, Reihenfolge von Kartenwahl und Beute sowie den Verlust der Items beim Tod. Geprüft sind außerdem Werte aus mehreren Slots, Zusatzherzen und laufende Effekte beim Wechsel.
- [ ] **Browser-Spieltest:** Lesbarkeit der Beutesymbole und Vergleichsansicht, Drop-Takt sowie Stärke und Zusammenspiel der Itemwerte im Kampf beurteilen.

## XP-Orbs · 20.11.2026

- [x] **Ansaugreichweite:** XP-Orbs fliegen nur innerhalb des Magnetradius zum Pferd. Außerhalb driften sie nach links. Grundradius, Korkenzieher und getrennte Flaschenreichweite sind mit gezielten Orb-Assertions geprüft.

## Schussmutationen und Power-ups · 20.11.2026

- [x] **Zielsuche um 70 % abgeschwächt:** Spürnase für Geschosse und Laser sowie die Eigenlenkung von Suchraketen und Rosé behalten 30 % ihrer bisherigen Lenkstärke. Gezielte Tests für Suchverhalten und Raketentreffer sind bestanden.

- [x] **Suchraketen:** Das Power-up füllt auf fünf Ladungen auf. Der Schaden pro Rakete ist verdoppelt. `node test-game.cjs --rockets` prüft Aufsammeln, Verbrauch, Nachladen und Trefferschaden.

- [x] **Weniger Zusatzgeschosse, 15 % mehr Basisschaden:** Doppelter Käse, Streuflug und Käsebruch enden bei Rang 2. Der Standardschuss steigt von 0,75 auf 0,8625 Schaden. Gezielte Tests prüfen Grundschaden, Geschosszahl, Splitterflug und Schadensboni im Talentbaum.

- [x] **Zielsuche endet beim ersten Treffer:** Durchschlagende Geschosse und Treffersplitter nehmen kein neues Ziel auf. `node test-game.cjs --seek-hit` prüft Zielsuche vor dem Treffer, Durchschlag, Splitterflug und Treffer auf Bosssegmente.

- [x] **Pixelart für Elementartreffer:** Flammen, Blitz-Zacken, Eiskristalle und Gesteinsbrocken treten direkt aus Gegnern und Bosssegmenten aus. Alle vier Motive, Nachbrennen, Kettenblitze und kombinierte Bosstreffer sind im Kampftest geprüft. Die spätere Blocker-Prüfung schlägt weiterhin fehl.
- [ ] **Sichtprüfung der Elementartreffer:** Erkennbarkeit der vier Motive bei gemischten Treffern und dichtem Gegnerfeuer im Browser beurteilen.

- [x] **Käse-Vortex und Rundenstart:** Anziehungsradius auf 120 Pixel im Dauerfeuer und 188 Pixel beim Sonderangriff verdoppelt. Startbanner und Orb-Hinweis entfernt. Reichweite und Einstieg sind mit `test-game.cjs` und `test-opening.cjs` geprüft.
- [x] **Spürnase:** Die Lenkstärke aller Kartenränge zuerst um rund 14 %, dann um weitere 15 % gesenkt. Die Lenkungsprüfungen laufen durch. Der spätere Blocker-Test schlägt mit beiden Lenkstärken fehl.
- [x] **Größere Flugbahnen:** Käsekarussell mit 114 Pixeln Radius und Bumerangkäse mit einer Sekunde Freiflug bis zur Umkehr. Kreisflug, Ausflug und frühere Umkehr beim Treffer sind mit `node test-game.cjs` geprüft.
- [x] **Kartenangebote und Schussformen:** Garantierter Standardschussplatz bei verfügbaren Karten, Viertelgewicht für reine Sonderschusskarten und drei neue kombinierbare Formen. Angebot, Rückflug, kombinierte Flugbahnen, Splittergrenzen und Wechsel zwischen Käse und Wein sind geprüft.
- [x] **Suchraketen, Schutzschild und Räumstrahl:** Drei Power-ups mit eigenem Drop-Zeitplan. Zielwahl, Verbrauch, Auffüllen, Bosssegmente, Abstecher, Schildtreffer und Schussbahn sind geprüft.
- [x] **Gegnerkonter:** Die Basarlaterne dämpft Fronttreffer. Beim Großwesir schützen Vorwarnung und Vorstoß das Segment Arme & Gewand. Schaden aus unterschiedlichen Winkeln und außerhalb des Schutzfensters ist geprüft.
- [ ] **Spieltest:** Wirkung der kombinierten Flugbahnen, Lesbarkeit der zusätzlichen Effekte, Häufigkeit der Power-ups und Schwierigkeit gegen Laterne und Großwesir im Browser beurteilen.

## Grafikpolitur · 20.11.2026

- [x] **Durchgehende Ruhrpott-Straßenkulisse:** Häuserzeile und zwei mitlaufende Gehwege verbinden die Buden optisch mit dem Straßenraum. Die technische Asset-Prüfung ist bestanden. Die Sichtprüfung im Browser steht aus.

- [x] **Ruhrpott-Buden als Parallax-Kulisse:** Stilisierte Puszta-Stube aus Gladbeck, detaillierte Currywurstbude und Trinkhalle mit Watt-Mann im ersten Ruhrpott-Level. Bildausschnitte, zwei Scrolltempi und Ersatzdarstellung automatisiert geprüft.
- [ ] **Ruhrpott-Buden im Browser:** Lesbarkeit der Schilder und des Watt-Mann-Cameos während des Scrollens prüfen.

- [x] **Lesbarkeit bei hoher Geschossdichte:** Kompakte Spielergeschosse, schmalere Laser und keine Leuchtspuren. Feindgeschosse behalten Silhouette und Warnzeichen. Zusatzgrafik und Spuraufzeichnung kehren bei sinkender Dichte verzögert zurück. `node test-readability.cjs` prüft die Umschaltung und die Zeichenlast mit 360 Spieler- und 216 Feindgeschossen.
- [ ] **Bildrate bei hoher Geschossdichte:** FPS und Lesbarkeit der vereinfachten Darstellung im tatsächlichen Browser-Gefecht prüfen.

- [x] **Talentbaum-Bonusübersicht:** Rechts stehen alle gekauften Talente mit ihrem aktuellen Bonus. Leerer Stand, Kauf, Rangsteigerung und Rückgabe sind mit `node test-meta-game.cjs` geprüft.

- [x] **Pfert im Talentbaum aufdecken:** Knoten liegen auf dem großen Pfert-Sprite. Der Weg beginnt an der Brust und verzweigt zu Kopf, Flügeln, Schweif und Hufen. Kauf und erreichbare Nachbarn vergrößern den sichtbaren Bereich. Sprite und Freilegungsmaske verwenden dieselben Kartenkoordinaten. Platzierung, Maskenstruktur und vollständige Freilegung sind automatisiert geprüft. Der visuelle Browser-Spieltest steht aus.
- [x] **Debug-Talentpunkte und Boss-Sprünge:** Numpad 1 gibt 360 Punkte für einen separaten Teststand. Numpad 2–8 starten die sieben Bosskämpfe direkt im Debug-Modus, Numpad 9 die Basar-Variante des Großwesirs. Direktstart aus dem Hauptmenü, Wechsel aus einer regulären Runde und Trennung vom Spielstand sind mit `node test-meta-game.cjs` geprüft.

- [x] Suchraketen, Schutzschild und Räumstrahl haben eigene Pixelsymbole und Sammelklänge. Die Rakete hat einen animierten Abgasstrahl und ein Startgeräusch. Die Säge ist um 25 % größer gezeichnet. XP-Orbs haben Glanzkanten, Boss-Orbs eine Goldpalette.
- [x] Magnetboni werden pro Objektgruppe berechnet. Bei entfernten Lichtquellen entfällt die Wurzelberechnung. Fünf volle HUD-Herzen benötigen 75 statt 275 Rechtecke. `test-progress.cjs`, `test-readability.cjs` und `test-sound.cjs` prüfen Fortschritt, Zeichenpfade und Soundereignisse. Bildrate und Klangeindruck im Browser sind offen.

- [x] **Scharfe Figuren und neue Gegnergrafiken:** Pfert, reguläre Gegner und Bosse verwenden bereinigte Pixelkonturen. Zehn seltene Gegner und vier Blocker haben eigene Rastergrafiken mit abgestuften Licht- und Schattenfarben. Zuschnitte und Laden geprüft.
- [x] **Geschosse und Klang:** Sechzehn bereinigte Geschossmotive, gestufte Leuchtspuren und klarere Flächen an Feindgeschossen. Materialabhängige Treffer, schwere Explosionen, kurze Stereo-Reflexionen und ein Level-up-Signal. Lesbarkeit, Klangvarianten, Stimmenlimit und Pause automatisiert geprüft.
- [ ] **Sicht- und Hörprobe:** Gegnerkonturen, Geschossspuren und Klangmischung im dichten Gefecht im Browser beurteilen.
- [x] **Teppich-Salve:** Prüfung auf den Abschusszeitpunkt verlegt. Die Nadeln können nach fünf Sekunden bereits das Spielfeld verlassen haben. Beide Warnlinien und beide Höhenversätze sind direkt beim ersten Abschuss geprüft.

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

- [x] **Sultan der Kaffeekessel:** 50 % mehr Basis-Lebenspunkte vor Rundung der einzelnen Segmente. Der gezielte Boss-Test läuft weiterhin durch.

- [x] **Sultan der Kaffeekessel:** Die Wartezeit bis zum ersten Angriff und die regulären Angriffspausen in beiden Phasen sind um ein Drittel kürzer. `node test-encounters.cjs --boss-attacks` prüft den 1,5-fachen Angriffstakt außerhalb der Angriffsanimationen.

- [x] **20 % mehr bewegliche Feindgeschosse:** Jeder fünfte Schuss von Gegnern und Bossen erhält ein versetztes Zusatzgeschoss. Das Limit aktiver Feindgeschosse steigt von 180 auf 216. `node test-encounters.cjs --boss-attacks` prüft die Schusszahl und die Boss-Angriffsmuster.

- [x] **Zwei zusätzliche Sonderangriffe für jeden der sieben Bosse.** Die neuen Muster nutzen versetzte Wellen, Angriffe von den Spielfeldrändern und wechselnde Ausweichspuren. Der Warnhinweis zeigt Name und Abschussrichtung oder die betroffenen Strahlspuren. Angriffsfolge, Vorwarnzeit, Wellen und Warnsignal sind mit `node test-encounters.cjs --boss-attacks` und `node test-sound.cjs` geprüft.
- [ ] **Boss-Balance im Browser.** Ausweichfenster und Schwierigkeit der 14 neuen Muster im Spiel beurteilen.

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

- [ ] **Sound verfeinern:** Kräftigeres klassisches Arcade-Retro-Sounddesign mit eigenem Klangcharakter für Waffen und Ereignisse; wichtige Ereignisse wie Schaden, Bossauftritte und Käserausch sollen im Kampf hervorstechen. Ton weiterhin mit M ein- und ausschaltbar.
  - Teilfortschritt: Waffen um eine tiefere Klangschicht ergänzt, mehrere Ereignisse eigenständiger gestaltet und vier Stimmen für wichtige Ereignisse reserviert. Soundeffekte werden weiterhin synthetisch erzeugt. Automatisiert: Soundausgabe, Stummschaltung, Stimmenbegrenzung und Schadenssignal bei hoher Auslastung sowie bestehende Spielabläufe geprüft (`node test-game.cjs`).
  - Überarbeitung vom 13.11.2026: Alle Waffen mit eigenen mehrschichtigen Texturen, kurzen Impulsen, Körper und Nachklang versehen; Sonderangriffe mit eigenem Bassimpuls. Dynamische Filterverläufe, artikulierte Lautstärkehüllen, variierendes Rauschen und eine leise frühe Raumreflexion ergänzen die Synthese. Wichtige Signale senken Kampfklänge kurz ab; Tonumschaltung blendet weich. Geprüft mit `node test-sound.cjs`, `node test-game.cjs` und `node test-progress.cjs`.
  - Offen: Hörprobe im tatsächlichen Spiel durch den Nutzer; Klangcharakter, Unterschiede aller Waffen und Ereignisse, Lautstärke und Verständlichkeit bei dichten Kämpfen anhand des Feedbacks abstimmen.
- [x] **Hintergrundmusik:** Neun Titel inklusive Balrog werden beim Rundenstart gemischt. Nach jedem vollständigen Durchlauf wird neu gemischt. N pausiert die Musik, M schaltet die Effekte separat stumm. Die Musiklautstärke lässt sich im Pausemenü einstellen. Die Konfliktmarkierungen, die das Laden von `sound.js` verhinderten, sind entfernt. Der gezielte Playlist-Test deckt Start, Titelwechsel, Stummschaltung, Stopp und Neustart ab.

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
