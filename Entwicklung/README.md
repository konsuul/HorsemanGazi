# Pfert – Käse über dem Bosporus

Unter goldenen Kuppeln zieht etwas seine Kreise, das besser nie hätte fliegen lernen sollen. Was in Flaschen schlummert, spaltet den Himmel – und hinter manchem Glanz wartet die Nachtschicht. Fünf Chancen bleiben dir, bevor selbst dein Scheitern eine Stimme bekommt.

[Pfert/index.html](../Pfert/index.html) im Browser öffnen. Keine Installation und kein Build nötig. Zum Verschicken den gesamten Ordner `Pfert` zippen.

- [Spielarchitektur](ARCHITEKTUR.md) mit Spielablauf, Berechnungen und Einstiegspunkten im Code
- [Roadmap](ROADMAP.md) mit Anforderungen, Spieltest-Feedback und offenen Aufgaben
- [Talentbaum-Entwurf](Meta%20progression.md) und [Grafikrichtlinie](ARTWORK.md)
- [Teaser](TEASER.md), [Deployment](DEPLOYMENT.md) und [Multiplayer-Konzept](MULTIPLAYER-ARCHITEKTUR.md)
- [Testanleitung](../tests/README.md)

- WASD / Pfeiltasten: bewegen; das Pfert schießt automatisch. Leertaste löst sofort einen Sonderangriff aus, ohne das Dauerfeuer zu unterbrechen.
- Controller: Linker Stick oder Steuerkreuz bewegt. A (PlayStation: ×) löst den Wein-Sonderangriff aus und bestätigt die Basisskill-Auswahl. X (PlayStation: □) bestätigt Level-up-Karten. B (PlayStation: ○) aktiviert Käserausch. Links/rechts wählt Karten. Die Tastenhinweise wechseln automatisch zu PlayStation-Symbolen, wenn der Browser den Controller entsprechend meldet. Bei unklarer Kennung erscheinen Xbox-Tasten.
- Eine aktive Weinwaffe ermöglicht Sonderangriffe, die ihren Weinbalken verbrauchen. Der goldene Sonderwein füllt den Balken wieder auf. Ohne aktive Weinwaffe verleiht er dem Standardschuss zehn Sekunden lang zusätzliche Projektile nach oben und unten.
- Fünf Herzen zum Rundenstart. Ausrüstung kann das Maximum erhöhen. Die Bewegung ist gegenüber der vorigen Version weitere 5 % schneller.
- N schaltet die Musik ein oder aus. M schaltet die Soundeffekte separat.
- Esc oder die Menü-Taste am Controller öffnet die Pause mit gesammelten Power-ups, Ausrüstung, Musiklautstärke und bestätigbarem Rundenende. Freiwillig beendete Runden zeigen die Auswertung und zählen nicht für die Punktetafel.
- Q: Käserausch auslösen, sobald die Anzeige voll ist. Abschüsse, Schutzblocks und einmalig gewertete knappe Ausweichmanöver laden sie auf. Zwölf Sekunden Grunddauer mit mehr Schaden und zusätzliche Seitenangriffe; bei Aktivierung werden sichtbare reguläre Gegner besiegt; ihre Belohnungen und Orbs sowie vorhandene Gegenstände bleiben erhalten. Sichtbare feindliche Geschosse werden entfernt. Bosse bleiben.
- Besiegte Gegner hinterlassen Leuchtkugeln mit Erfahrungspunkten. Bei jedem Stufenaufstieg pausiert das Spiel zur Kartenauswahl. Die erste Stufe benötigt 10 Punkte; der Bedarf steigt zunächst auf das aufgerundete 1,5-Fache, ab Stufe 10 um 12 % und höchstens auf 1500. Stärkere Gegner und Bosse geben mehr Punkte. Orbs driften mit dem Spielfeld nach links und fliegen erst in Magnetreichweite zum Pferd. Der Grundradius beträgt 78 Pixel, Korkenzieher erweitert ihn um 12 Pixel pro Rang; der Balken am unteren Spielfeldrand zeigt den Stufenfortschritt. Aufgesammelte Orbs geben vor Talent- und Ausrüstungsboni das 1,875-Fache ihres XP-Werts. Klicken, 1 / 2 / 3 oder mit Pfeiltasten oder A / D wählen und mit Enter bestätigen. Die Verbesserung gilt für die laufende Runde. Sind im späten Spiel nur noch zwei passende Karten verfügbar, zeigt die Auswahl beide.
- Türkis gerahmte Flaschen mit Pluszeichen sind Powerups. Rot umrandete, hohle Projektile sind gefährlich. Getroffene Gegner blitzen weiß auf.
- Noch nicht eingesammelte Flaschen setzen während des Bosskampfs aus. Sie erscheinen nach dem Sieg wieder, bei geheimen Bossen beim Rückwechsel ins Hauptspiel.

## Basisskills und Builds

Vor jedem Run wählst du einen Basisskill. Der gewählte Angriff kehrt zurück, sobald ein Waffenwein ausläuft oder verbraucht ist. Solange passende Karten verfügbar sind, ist unter den Level-up-Karten mindestens eine Empfehlung für deinen Skill. Die Lichtlanze bietet Karten für Projektile wie Rückenwind, Harte Kruste und Billardkäse erst an, wenn der Build regelmäßig Projektile erzeugt, etwa durch Käsebruch oder eine Geschosspatrone. Bumerangkäse, Sprungkruste und reine Wein-Sonderangriffskarten stehen bei der Lichtlanze nicht zur Wahl. Im Auswahlmenü stehen die Talente, die deinen Basisskill zusätzlich verstärken.

| Basisskill | Spielweise |
| --- | --- |
| Eisfächer | Breite Eiskristalle mit Verlangsamung. Fächer und Abpraller helfen gegen verteilte Gegner. |
| Erdbolzen | Schwerer Schuss mit 18 % mehr Grundschaden. Kritische Treffer, Käsereifung und Letzter Bissen stärken ihn gegen Einzelziele. |
| Glutkern | Brennen ab dem ersten Treffer. Elementarkarten können Ketten und Thermischen Schock ergänzen. |
| Lichtlanze · Wind | Sofortiger, durchdringender Laserimpuls. Große Portion verbreitert ihn, Langer Abgang erhöht Schaden und Dauer. Echos feuern zusätzliche Laserimpulse. |

Doppelter Käse und Streuflug erweitern die Abdeckung. Doppelter Käse verursacht mit den ersten beiden Eisfächer-Kopien je 11,52 % Grundschaden. Beim Erdbolzen, Glutkern, der Lichtlanze und bei Wein-Sonderangriffen liegen diese Werte vor Talentboni 15 % niedriger. Käsebruch-Splitter verursachen 12,6 % des auslösenden Schadens. Goldene Rinde gibt je Rang 5 Prozentpunkte kritische Trefferchance, Letzter Bissen 10 % Schaden gegen Ziele unter 35 % Leben.

## Die 15 Waffen

Die zuletzt aufgenommene Weinsorte bestimmt die Waffe für 18 Sekunden, verlängert durch Karten. Waffenweine erscheinen bei 12 % der für sie vorgesehenen Spawn-Versuche. Traubenmost und goldener Sonderwein behalten ihre bisherige Chance. Traubenmost heilt ein Herz. Karten wirken auf die Waffen mit; Laser bekommen z. B. mehr Breite und Dauer, Geschosse mehr Schaden, Abpraller oder Ketteneffekte.

| Flasche | Automatischer Schuss | Sonderangriff |
| --- | --- | --- |
| Rotwein | Glutsalve | Explosiver Komet |
| Weißwein | Dreifachfächer | Fünffachfächer |
| Rosé | Suchende Blüte und Schild | Drei Suchblüten |
| Portwein | Kurzer Laser | Langer, breiter Laser |
| Schaumwein | Zwei schnelle Nadeln | Große durchdringende Nadeln |
| Riesling | Prisma, zerfällt bei Treffer | Drei Prismen mit je fünf Splittern |
| Merlot | Rückkehrendes Sägeblatt | Zwei große Sägeblätter |
| Malbec | Kettenblitz über zwei Ziele | Kette über vier Ziele |
| Muskat | Gerader Käseschuss und zwei Monde bis zum Weinende | Drei größere Orbitgeschosse |
| Sherry | Ballistischer Sprengsatz | Drei Mörsergranaten |
| Madeira | Wachsende Schallwelle | Große durchdringende Wellenfront |
| Eiswein | Zwei bremsende Eissplitter | Fünffachfächer mit stärkerem Frost |
| Cabernet | Pulsierender Vortex mit 120 Pixeln Anziehungsradius | Länger aktiver Vortex mit 188 Pixeln Anziehungsradius |
| Tokaj | Gewitterlanze | Breiter verzweigter Gewitterstrahl |
| Burgunder | Wellenförmiger Phönix | Drei versetzte Phönixbahnen |

## Elementareffekte

Jede Weinwaffe bekommt ein Element für automatische und Sonderangriffe:

- Feuer: Rotwein, Rosé, Burgunder. Treffer brennen 1,8 Sekunden nach.
- Frost: Weißwein, Madeira, Eiswein. Treffer verlangsamen Bewegung und Angriffe.
- Blitz: Portwein, Schaumwein, Malbec, Tokaj. Schaden springt auf weitere Ziele über.
- Erde: Riesling, Merlot, Muskat, Sherry, Cabernet. Geschosse splittern bei Treffern.

Kühlkette, Räucherkammer, Statische Rinde und Splittergelage kombinieren diese Elemente. Echos und Splitter erben sie; Laser erhalten ebenfalls Treffer-Effekte. Splitter erzeugen keine endlosen weiteren Generationen. Bereits abgefeuerte Angriffe behalten ihre Elemente auch nach einem Waffenwechsel. Bossflächen können ebenfalls brennen und werden durch Frost gebremst.

Elementartreffer lassen Pixelart direkt aus dem getroffenen Gegner oder Bosssegment austreten. Feuer steigt als orange Flammen auf, Blitz zuckt als helle Zacken nach außen, Frost streut blaue Eiskristalle und Erde wirft braune Gesteinsbrocken aus. Bei kombinierten Treffern sind mehrere Motive gleichzeitig sichtbar.

Das dauerhafte schwebende Objekt vor dem Pfert-Mund wurde entfernt. Ein automatischer Schutzimpuls fängt weiterhin gelegentlich einen nahen Treffer ab und ist nur beim Auslösen kurz sichtbar. Wachsamer Mond verkürzt dessen Abklingzeit.

## Fortschritt und Geheimnisse

Es gibt 46 Kartentypen einschließlich drei endlos wiederholbarer Verbesserungen. Doppelter Käse, Streuflug, Schlangenlinie, Spürnase und Käsebruch lassen sich beim Standardschuss und bei Wein-Sonderangriffen kombinieren. Spürnase lenkt auch das automatische Weinfeuer. Aktiver Wein übernimmt das Dauerfeuer bis zum Ablauf oder Verbrauch.

- **Bumerangkäse** verbraucht auf dem Hinflug zuerst die zusätzlichen Durchschläge von Harte Kruste. Er kehrt beim nächsten Treffer oder nach einer Sekunde Flug um. Auf dem Rückweg verursacht er 55 % Schaden und kann Ziele erneut treffen. Gezielter Test: `node tests/test-game.cjs --boomerang`.
- **Käsekarussell** lässt Geschosse eine Viertelsekunde auf einer Kreisbahn mit 114 Pixeln Radius um das Pfert fliegen. Danach fliegen sie in ihrem jeweiligen Abschusswinkel los und können sich schlängeln oder Ziele suchen. Die Lichtlanze zieht in der gleichen Zeit einen vollen Kreis mit 114 Pixeln Reichweite und feuert anschließend nach vorn. Doppelter Käse, Streuflug und Echos können zusätzliche rotierende Strahlen erzeugen. Jeder Strahl trifft ein Ziel höchstens einmal pro Abschuss.
- **Sprungkruste** gibt dem Schuss einen zusätzlichen Abpraller. Beim ersten Abpraller entsteht ein Splitter mit 21 % Schaden, der Spürnase und Schlangenlinie übernimmt. Der Hauptschuss kann zusätzlich Käsebruch auslösen.

Die drei Formen wirken auf den Standardschuss und seine Kartenkopien. Käsekarussell wirkt zusätzlich auf die Lichtlanze. Schnellgärung, Käsefondue und Fingerfertigkeit haben ein Viertel des normalen Ziehgewichts. Ab Minute 2 sind seltene Synergien mit passenden Grundkarten verfügbar. Ein gezogenes Angebot für Mondschmelze erscheint mit 25 % Wahrscheinlichkeit.

### Seltene Synergien

- **Splittergelage** (Flankenkäse oder Harte Kruste): zusätzliche Verzweigungen. Die Kinder erben Ketten, Frost und Nachbrennen; ihre Generation ist begrenzt, damit keine Endlosschleife entsteht. Auch Laser können am Trefferort Splitter erzeugen.
- **Kettenreaktion** (Statische Rinde): 45 % mehr Kettenschaden pro Rang; Ketten übertragen Elementareffekte.
- **Thermischer Schock** (Kühlkette und Räucherkammer): Frost plus Glut zünden zusätzliche Flächentreffer.
- **Echokammer** (Doppelter Boden): jeder vierte Angriff erzeugt schwächere Kopien der echten Geschosse oder Laser.
- **Mondschmelze** (Wachsamer Mond): Ladeangriffe erschaffen zwei zusätzliche Orbitgeschosse.

Käsereifung multipliziert den Schaden je Rang mit 1,12. Die Boni wirken zusammen; der Angriffsdruck reagiert zeitversetzt auf starke Synergie-Builds. Treffer-, Klang-, Partikel- und Projektillimits halten die Darstellung begrenzt.

Im Hauptspiel erscheint außerhalb von Bosskämpfen alle 45 bis 65 Sekunden eines von drei Power-ups. Alle drei kommen pro Durchgang in gemischter Reihenfolge vor.

- **Suchraketen** füllen auf fünf kreisende Raketen auf. Jede Rakete verursacht vor weiteren Boni das Sechsfache des Standardschadens. Sobald ein sichtbarer Gegner oder ein lebendes Bosssegment höchstens 200 Pixel entfernt ist, startet eine Rakete. Zwischen Starts liegen mindestens 0,6 Sekunden. Ladungen bleiben bei Gebietswechseln erhalten.
- **Schutzschild** fängt zwei feindliche Geschosse innerhalb von acht Sekunden ab. Kontakt mit Gegnern bleibt gefährlich.
- **Räumstrahl** bleibt vier Sekunden aktiv, schmilzt feindliche Geschosse entlang des Strahls und beschädigt das aktuell markierte Ziel. Klicke einen Gegner oder ein Bosssegment an oder wechsle mit E bzw. Y (PlayStation △) zum nächsten Ziel. Der Strahl wählt beim Einsammeln und nach einem Abschuss automatisch ein lebendes Ziel in der Nähe.

Widerstandskraft und Angriffsdruck steigen schrittweise mit Zeit und Karten. Die Basarlaterne nimmt von ihrer gepanzerten Vorderseite 55 % des direkten Schadens. Beim Großwesir dämpft das markierte Segment **Arme & Gewand** direkten Schaden bei Vorwarnung und Vorstoß um 35 %. Elitegegner tragen ein goldenes Zeichen. Schnelle Abschussfolgen erhöhen die Punktekette.

Boss-Lebenspunkte richten sich nach Boss, Segment und Bedrohung. Ab 2:12 können in den fünf Hauptgebieten angekündigte Formationen einfliegen. Randpfeile zeigen 1,6 Sekunden lang Einflugseite und Höhe. Die Staffeln feuern zweimal in ihren festen Spuren. Wechsle beim Signal in eine freie Höhe. Während eines Bosskampfs, Portals oder einer Sternenpost wird eine fällige Formation übersprungen. Eine fällige Sternenpost wartet, bis die Staffel aus dem Spielfeld ist. [Berechnung der Boss-Lebenspunkte](ARCHITEKTUR.md#bosse-und-segment-lebenspunkte)

Bei Minute 7 öffnet eine abgeschossene goldene Sucuk den ersten Ruhrpott-Abstecher. Bei Minute 14 öffnet eine abgeschossene Grubenlampe die Nachtschicht am Hochofen. Während eines laufenden Bosskampfes warten die Zugänge. Sie erscheinen jeweils nur einmal pro Runde. Im ersten Abstecher stehen die Puszta-Stube, die Maschinenhalle Zweckel und der Getränkegroßhandel Getränke Jörg Kopatz an der Strecke. Der erste Abstecher dauert 45 Sekunden bis zum Fan-Boss, der zweite 60 Sekunden bis Hochofen-Horst. Nach dem Boss kehrt man mit seinen Herzen und Karten in das Hauptspiel zurück; dessen Uhr pausiert im Abstecher.

Die obere Leiste zählt die Talentpunkte dieser Runde. Ein besiegter Boss oder zehn angesammelte Spielminuten bringen jeweils einen Punkt. Das Spiel speichert ihn bei Vergabe im Browser. Im Talentbaum zeigen Symbole und Detailansicht, was ein Knoten verbessert.

Der Talentbaum zeigt fünf Bereiche mit 15 benannten Clustern. Große Abschlussknoten markieren die stärksten Spezialisierungen. Gestrichelte Querverbindungen erlauben Mischungen zwischen den Bereichen. Käufe geben benachbarte Knoten frei. Inspiriert von den Notables und Keystones im [passiven Talentbaum von Path of Exile 1](https://www.pathofexile.com/passive-skill-tree).

**Debug:** Numpad 1 gibt im Menü und regulären Talentbaum 360 dauerhaft gespeicherte Talentpunkte. Während einer Runde gehen die Zusatzpunkte in den getrennten Debug-Stand. Numpad 2–8 starten direkt einen Debug-Kampf gegen Großwesir, Sultan, Pascha, Dschinn, Großmeister, Schalke-Fan und Hochofen-Horst. Umschalt + Numpad 2 startet das Prisma-Observatorium, Umschalt + Numpad 3 die Gezeitenwerft. Numpad 9 startet die Basar-Variante des Großwesirs mit zweiter Phase. Die Kürzel funktionieren im Hauptmenü und während des Spiels.

Ab drei Abschüssen in Folge zeigt ein Balken unter der Käsekette, wie lange du Zeit für den nächsten Abschuss hast.

Nach dem Spielende siehst du deine Stufe, Abschüsse, Boss-Siege, beste Käsekette, Windschatten und zugestellte Sternenpost. Die lokale Punktetafel sortiert die letzten zehn Runden nach Punkten und hebt die aktuelle Runde hervor. Bei nicht verfügbarem Browserspeicher bleiben Ergebnisse für die laufende Sitzung erhalten.

Bei Herzverlust leuchtet der Spielfeldrand kurz rot. Mit der Systemeinstellung „Bewegung reduzieren“ entfallen Bildwackeln und das Randblinken. Beim Ruhrpott-Portal blenden die Schauplätze aus und wieder ein.

Das Game Over wählt einen spöttischen Roast und einen motivierenden Nachsatz. Zwei aufeinanderfolgende Runden erhalten nicht denselben Roast.

## Ausrüstung im Run

Jeder besiegte Boss und jeder der zehn seltenen Sondergegner lässt ein Ausrüstungsitem fallen. Sondergegner würfeln 75 % gewöhnliche und 25 % seltene Beute. Bei Bossen sind es 20 % gewöhnliche, 65 % seltene und 15 % legendäre Beute. Im Spiel gibt es 50 Items. Das Symbol zeigt den Ausrüstungsplatz, der Rahmen die Seltenheit. Die Beute bleibt 20 Sekunden aktiver Spielzeit liegen und wird durch Berührung aufgenommen. Die Beute der Ruhrpott-Bosse erscheint nach der Rückkehr ins Hauptspiel.

Das Pfert trägt je ein Item an Kopf, Hufen, Sattel, Geschirr und Talisman. Ein Fund belegt automatisch einen freien passenden Platz. Weitere Funde landen im Rucksack mit acht Reserveplätzen. Unter **Pause → Ausrüstung** zeigt dir jede Karte den passenden Ausrüstungsplatz. Dort kannst du die Werte ansehen und ein Reserveitem gegen das getragene Item tauschen. Ist der Rucksack voll, pausiert die Runde zur Auswahl. Du kannst das getragene Item oder einen Rucksackplatz ersetzen oder den Fund zurücklassen. Wähle per Klick oder mit Pfeiltasten, Stick oder Steuerkreuz und bestätige mit Enter oder A (PlayStation ×).

Getragene Items verstärken zum Beispiel Angriff, Flugtempo, Käserausch oder Weinwaffen. Ein erhöhtes Herzmaximum lässt sich durch Heilung auffüllen. Beim Tod gehen getragene Items, Rucksack und offene Beute verloren. Die gesammelten Talentpunkte werden wie gewohnt gespeichert.

## Aktuelles Grafikpaket

Projektlokale PNG-Assets liefern detaillierte Figuren, eigene Bosskörper, Panoramen und texturierte Effekte. `assets.js` lädt die Figuren anhand geprüfter Quellrechtecke. Bei Ladefehlern greifen die Canvas-Grafiken. Das Spiel startet direkt aus dem Spielordner.

Basar, Wüstenpass, Bosporus-Überfahrt und Palast besitzen eigene Panoramen. Die Goldene Stadt und beide Ruhrpott-Abstecher haben zusätzliche Vordergrunddetails. Gebietswechsel im Hauptspiel blenden kurz über. Bei aktivierter Systemeinstellung „Bewegung reduzieren“ wechselt die Kulisse direkt.

Kampflicht reagiert lokal auf geladene Geschosse und Treffer. Die Bosskörper besitzen je nach Figur zwei bis fünf getrennte Bereiche, etwa Kopf, Arme, Kessel, Henkel, Rüstung oder Fahrwerk. Jeder Bereich hat eigene Lebenspunkte. Nur die getroffene Körperfläche blitzt weiß auf; zerstörte Flächen werden dunkel. Pixel-Herzen, Mündungsblitze, Waffen-VFX und Explosionsphasen sind mit dem Artwork abgestimmt.

[Dateien und Erstellungsprotokoll](ARTWORK.md) · [Vollständige Prompts](../tests/assets/prompts.json)

## Flugmanöver und Sternenpost

- **Umgebungsgefahren** — Ab 2:49 können Arkadenfeuer, Fallgitter, Kreuzfeuer, Flutkammer und Palastgitter zwei oder drei Gefahrwellen auslösen. Das Spielfeld wird grau. Pfeile weisen zwischen die gestrichelten Gefahrenzonen. Wechsle rechtzeitig in die neue Spur, die auch senkrecht verlaufen kann. Eine berührungsfreie Passage bringt je nach Gebiet 350 oder 450 Punkte.

- **Windschatten** — Innerhalb von 2,5 Sekunden drei verschiedene Feindgeschosse knapp passieren. Das bringt zusätzlich zu den Streifpunkten 125 Punkte und zieht bei jeder nachladenden Patrone bis zu 1,5 Sekunden ab. Ein Herzverlust unterbricht die Serie. Im HUD zeigen drei Rauten den Stand.
- **Sternenpost** — Frühestens ab 1:40 erscheinen im Hauptspiel drei offene goldgrüne Siegel. Wer alle drei der Reihe nach durchfliegt, löst eine Explosion mit zehn XP-Orbs aus. Jeder Orb wird einzeln gewürfelt: 50 % blau (1 Basis-XP), 30 % grün (2), 15 % rot (6) und 5 % golden (20). Rote und goldene Orbs geben auch bei Gegner- und Boss-Drops doppelte XP. Nach dem Auseinanderfliegen bleiben sie 0,25 Sekunden gesperrt. Zusätzlich besteht eine Chance von 30 % auf ein Item. Die nächste Gelegenheit kommt frühestens 110 Sekunden später. Ein verpasstes Siegel beendet nur die Lieferung.
- Beim Standardschuss zeigt das mittlere HUD-Feld die nächste Patrone und ihren Ladefortschritt.

## Die mechanische Karawane

Die Karten AK–AT laden beim Spielen je nach Patrone alle rund 1,85 bis 4,92 Sekunden eine eigene Patrone. Der nächste automatische Angriff mit dem Basisskill löst eine bereite Patrone zusätzlich aus. Die Sonnenlanze durchschlägt ihre Spur sofort als Laserimpuls. Bei mehreren bereiten Karten wechselt die Reihenfolge. Während eines Waffenweins sammeln die Patronen weiter Ladezeit.

Ab 1:40 tauchen in den regulären Wellen drei Maschinen auf. Beim **Spurweber** kreuzen sich zwei Nadeln vor seinem Bug. Der **Kieltaucher** schießt eine an den Feldrändern abprallende Kugel. Die **Splitterbake** legt zwei zeitversetzt zum Abschuss aufplatzende Ladungen.

Das **Prisma-Observatorium** und die **Gezeitenwerft** folgen als sechster und siebter Hauptboss. Zum direkten Anspielen im Debuglauf dienen **Umschalt + Num 2** und **Umschalt + Num 3**.

## Talentfortschritt sichern

Pfert speichert Talentpunkte, gekaufte Ränge und angefangene Spielzeit automatisch in den Websitedaten. Im Talentbaum lädt **Sicherung herunterladen** den aktuellen Stand als JSON-Datei herunter. **Sicherung laden** stellt diesen Stand auch nach dem Löschen der Websitedaten oder in einem anderen Browser wieder her.

## Ideenquellen

Die eigenständigen Kombinationen folgen dem Prinzip verhaltensändernder Support-Effekte aus [Path of Exile](https://www.pathofexile.com/game). Geladene Abschüsse und Punktekombinationen greifen das Arcade-Prinzip auf, das [SNK für Blazing Star beschreibt](https://www.snk-corp.co.jp/us/games/acaneogeo/blazingstar/). Grafiken, Texte und Soundeffekte sind eigens für Pfert erstellt. Die Hintergrundmusik besteht aus neun bereitgestellten Rekonstruktionen von 8-BeatsVGM aus *Super Street Fighter 2*. Sie läuft ab Spielstart in zufälliger Reihenfolge und wird nach jedem Durchlauf neu gemischt. Wenn der Browser die Musik beim Start per Controller blockiert, genügt ein Klick ins Spiel oder ein Tastendruck.

Die Ruhrpott-Level haben getrennte Bilder: Das erste zeigt das bestehende Industriepanorama; die Nachtschicht zeigt einen aktiven Hochofen-Innenraum in ruhrgebiet-nachtschicht-v1.png.
