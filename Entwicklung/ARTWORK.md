# Grafik-Überarbeitung · 11.11.2026

Erstellt mit dem eingebauten Imagegen-Tool, ohne CLI-Fallback. Die Original-PNGs wurden unverändert ins Projekt kopiert. Die vollständigen verwendeten Prompts stehen in [prompts.json](../tests/assets/prompts.json).

| Datei | Verwendung | Tatsächliche Größe |
| --- | --- | --- |
| [characters-v1.png](../tests/assets/characters-v1.png) | Figuren, Pfert-Posen und Bosskörper | 1254 × 1254 |
| [bosporus-v1.png](../Pfert/assets/bosporus-v1.png) | Stadtpanorama | 1672 × 941 |
| [ruhrgebiet-v1.png](../Pfert/assets/ruhrgebiet-v1.png) | Industriepanorama | 1672 × 941 |
| [effects-v1.png](../Pfert/assets/effects-v1.png) | Explosionen, Geschosse und magische Effekte | 1254 × 1254 |

Die tatsächlichen Figuren hielten die angefragten Rastergrenzen nicht überall ein. Deshalb nutzt die Integration die transparenten Objektgrenzen in frames.json. vfx-frames.json enthält die separaten Effektzellen. Alle Zuschnitte liegen in den Bildern; Transparenz und Originaldateien bleiben erhalten.

Die Bilder werden ohne weiche Interpolation skaliert. Panoramen werden gespiegelt und langsam gescrollt. Laufzeit-Licht, Partikel, Leuchtspuren und HUD entstehen weiterhin im Canvas. Die ursprünglichen Canvas-Grafiken bleiben bei Ladefehlern spielbare Fallbacks.

Die neue Kulisse ist aufwändiger, aber nicht als fertiggestellte AAA-Produktion zu verstehen. Die Kombination aus Artwork, Animation, Beleuchtung und Lesbarkeit wird über native Canvas-Vorschaubilder geprüft.

## Gegner- und Kulissenpass · 25.11.2026

Die neun neuen PNGs entstanden mit dem eingebauten ImageGen-Tool. Die [Prompts und Referenzrollen](../tests/assets/prompts.json) stehen unter `polish20261125`. Die Original-PNGs liegen im Spielordner. Das Spiel entnimmt einzeln vermessene Zuschnitte und skaliert sie ohne weiche Interpolation.

| Datei | Motive |
| --- | --- |
| [gegner-ruhr-maschinen-v1.png](../Pfert/assets/gegner-ruhr-maschinen-v1.png) | Currywurst, Kohlenlore, Teppichkumpel, Druckkessel, Grubenmotte, Spurweber, Kieltaucher und Splitterbake |
| [bosse-maschinen-v1.png](../Pfert/assets/bosse-maschinen-v1.png) | Prisma-Observatorium mit Glasfacetten, Gezeitenwerft mit genieteten Schloten und Schleusendeck |
| [bosse-karawane-v1.png](../Pfert/assets/bosse-karawane-v1.png) | Eigene Sprites für Sucuk-Pascha, Gewürz-Dschinn und Großmeister der Basarkarawane |
| [basar-v1.png](../Pfert/assets/basar-v1.png), [wuestenpass-v1.png](../Pfert/assets/wuestenpass-v1.png) | Basar am Anleger und nächtlicher Wüstenpass mit Karawanserei |
| [bosporus-ueberfahrt-v1.png](../Pfert/assets/bosporus-ueberfahrt-v1.png), [palast-morgenrot-v1.png](../Pfert/assets/palast-morgenrot-v1.png) | Offene Meerenge und Palastterrassen im Morgenrot |
| [kulissen-vordergrund-v1.png](../Pfert/assets/kulissen-vordergrund-v1.png) | Lastkahn, Sandstein, Balustrade und Gleis als unabhängige Vordergrundebene |
| [ruhrpott-fassaden-v2.png](../Pfert/assets/ruhrpott-fassaden-v2.png) | Texturierte Spielfassaden für Maschinenhalle Zweckel und Getränke Jörg Kopatz |

Bei regulären Gegnern, seltenen Typen, Blockern, Maschinen und Bossen folgen gebündelte Lichtpixel dem oberen linken Rand. Kühlere Vertiefungen und zwei nach rechts unten versetzte Schattenstufen trennen die Körperflächen von der Kulisse. Trefferblitze erscheinen auf dem getroffenen Bossbereich. Schlotzonen, Messingwiege und Karawanenmeister-Beine folgen den sichtbaren Sprites. Sucuk und Grubenlampe verwenden für die Portalziele detaillierte Sprites mit goldener beziehungsweise kühler Kennzeichnung.

Die Goldene Stadt nutzt weiter das dreischichtige Bosporus-Motiv. Die vier neuen Hauptpanoramen scrollen jeweils mit eigenen Geschwindigkeiten hinter der Vordergrundebene. Beide Ruhrpott-Abstecher erhalten Gleise in der vorderen Bildebene. Zweckels Spielfassade übernimmt Dreiecksgiebel, Rundbogenfenster und Lisenen. Die Kopatz-Fassade ist eine stilisierte Spielfassung mit beschriftetem Schild. [Fassadenbeschreibung der Ruhrtriennale](https://archiv.ruhrtriennale.de/www.2005.ruhrtriennale.de/de/spielstaetten/zeche-zweckel-gladbeck/index.html) · [Anzeige in der Gladbecker Festschrift](https://sv-gladbeck.de/wordpress/wp-content/uploads/Schuetzenverein-Gladbeck-Mitte-Festschrift-2022-7.pdf)

## Bosporus-Parallax

| Datei | Verwendung | Größe |
| --- | --- | --- |
| [bosporus-mittelgrund-v1.png](../Pfert/assets/bosporus-mittelgrund-v1.png) | Uferhäuser, Kuppeln und Minarette | 2164 × 395 |
| [bosporus-vordergrund-v1.png](../Pfert/assets/bosporus-vordergrund-v1.png) | Markisen, Iznik-Mosaike und bepflanzte Terrassen | 2164 × 290 |

Beide transparenten Streifen stammen aus einem gemeinsamen Pixelgrafik-Entwurf. Sie werden proportional skaliert, horizontal gespiegelt und hinter der Spielebene mit 23 beziehungsweise 39 Canvas-Pixeln pro Sekunde gescrollt. Das Stadtpanorama bewegt sich mit 7 Pixeln pro Sekunde.

## Verbindlicher 16-Bit-Retrostil

[characters-v2.png](../Pfert/assets/characters-v2.png) ist die Referenz für Spielfiguren und Gegner. Neue Sprites bei ihrer tatsächlichen Spielgröße beurteilen. Gezeichnete Umrisse auf das Pixelraster setzen und Animationen auf einen gemeinsamen Mittelpunkt ausrichten. Transparente Sprites mit deaktivierter Bildinterpolation skalieren. Kleine Details in lesbaren Pixelgruppen bündeln.

- **Qualitätsschwelle.** Für die Laufzeit nur Grafiken freigeben, deren Form, Material und Lichtführung bei nativer Größe und bei verkleinerter Ansicht überzeugend lesbar sind. Grob hochskalierte Miniaturen, verwaschene Filterung, störende Alpharänder und provisorische Rasterglyphen erfüllen die Vorgabe nicht. Solche Grafiken vor der Freigabe überarbeiten oder durch eine fertige Fassung ersetzen. Das gilt auch für Canvas-Zeichnungen und Ersatzgrafiken.
- **Pixelmaßstab.** Kanten und Details als bewusst gesetzte Pixelgruppen zeichnen. Die Detaildichte an benachbarten Spielgrafiken ausrichten. Bei beweglichen Sprites über alle Frames Ursprung, Licht und Silhouette prüfen. Zeichnungen bei der tatsächlichen Ausgabegröße beurteilen, inklusive ruhiger und stark strukturierter Hintergründe.
- **Effekte.** Zeitkritische Warnungen über Form und Helligkeit vermitteln. Vorwarnung, Trefferfläche und dekorative Spuren erhalten klar unterschiedliche Konturen. Gefahren und sichere Flugspuren müssen ihren Kollisionsgrenzen folgen. Bei reduzierter Bewegung bleiben Warnung und Gefahrenfläche gleich lesbar; dekorative Bewegung und Bruchstücke werden gedrosselt.
- **Licht und Material.** Licht kommt von links oben. Lichtkante, Grundton, Schattenfläche und tiefe Fuge als klar getrennte Farbstufen anlegen. Kühler, dunkler Konturenschlag trennt überlappende Flächen. Messing bekommt schmale Lichtkanten, Glas größere Facetten und Holz oder Stoff breite matte Flächen.
- **Gegner.** Angriff und Rolle an der Silhouette erkennen lassen. Maschinen setzen Glaslinsen, genietete Metallteile und gestufte Facetten ein. Konturen und versetzte Schatten geben Tiefe. Trefferblitz, Angriffswarnung und Bosssegmente müssen über der Textur lesbar bleiben. Die Kontur muss auch über hellen Wolken und vor dunkler Industrie erkennbar sein.
- **Warnsignale.** Gerade Gefahrenbahnen mit gestrichelten Lichtkanten und dunkler Unterlage markieren. Feindgeschosse vor Warnungen, Partikeln und Kulisse zeichnen. Herzverlust am Pfert und am Spielfeldrand zeigen, damit Trefferursache und nächste Gefahr im Blick bleiben.
- **Gebäude.** Die vorhandenen Bosporus-Streifen, Ruhrpott-Buden und Industriepanoramen geben Größe, Blickwinkel und Detaildichte vor. Vorderfront, Rücksprung und Seitenwand mit getrennten Tönen zeichnen. Fenster und Türen tief einfassen. In entfernten Schichten Kontraste und Detaildichte absenken. Beschriftungen auf bedeutsame Schilder begrenzen und bei Spielgröße prüfen.
- **Orte.** Hauptlevel bleiben osmanisch geprägt, etwa mit Kuppeln, Minaretten, Iznik-Mosaik und Markisen. Ruhrpott-Sonderlevel verwenden Ziegel, Stahl, Schornsteine und lokale Ladenfronten. Beide Welten teilen Pixelmaßstab, Lichtrichtung und Materialabstufung.
- **Abnahme im Spiel.** Gegner und Gebäude bei nativer Canvas-Größe sowie bei kleiner Darstellung prüfen. Angriffswarnungen und Projektile müssen bei dichtem Feuer lesbar sein. Bei realen Gebäuden die Silhouette und markanten Fassadendetails an einer eindeutig zugeordneten Vorlage prüfen.

## Figuren und Geschosse mit scharfen Pixelkanten

| Datei | Verwendung |
| --- | --- |
| [characters-v2.png](../Pfert/assets/characters-v2.png) | Reguläre Gegner und Bosse mit bereinigtem Alphakanal |
| [horse-v3.png](../Pfert/assets/horse-v3.png) | Beide Flügelposen im Spiel, Startmenü und Talentbaum |
| [rare-enemies-v2.png](../Pfert/assets/rare-enemies-v2.png) | Zehn seltene Gegner mit eigenen Silhouetten und abgestuften Lichtfarben |
| [blockers-v2.png](../Pfert/assets/blockers-v2.png) | Teppich, gepanzerte Laterne, Kupferibis und Gewürzbarke |
| [player-projectiles-v2.png](../Pfert/assets/player-projectiles-v2.png) | Sechzehn Geschossmotive mit bereinigten Konturen |

`assets.js` enthält die Zuschnitte für die Gegner. Das Spiel skaliert sie ohne weiche Interpolation, zeichnet sie an gerundeten Positionen und ergänzt einzelne Schattenpixel am Figurenrand. Leuchtspuren liegen als eigene Effekte hinter den Geschossen.

## Arkadenfeuer, Bossbruchstücke und Beute

Arkadenfeuer verwendet gestrichelte Ränder, schraffierte Gefahrenzonen und Pfeile zur freien Flugspur. Die sichtbaren Kanten liegen an derselben y-Grenze wie der Trefferbereich. Die aktive Welle wechselt auf Kupferrot mit hellen Kanten. Das Flimmern unterbleibt bei reduzierter Bewegung. Über den Warnungen bleiben Pfert und Feindgeschosse sichtbar.

Beim Zerstören eines Bosssegments springen kantige Bruchstücke vom Zielpunkt aus. Ausrüstung erscheint in gefassten Medaillons mit fünf silhouettenstarken Motiven für Kopf, Hufe, Sattel, Geschirr und Talisman. Der untere Balken zeigt die verbleibende Abholzeit. Die Medaillons werden pro Motiv und Seltenheitsfarbe zwischengespeichert. Feld-Power-ups zeigen eine Suchrakete, einen gewölbten Schild oder eine Räumstrahl-Optik in achteckigen Metallfassungen. Ihre Abzeichen werden einmal pro Typ gezeichnet und als Sprite wiederverwendet.

## Ruhrpott-Buden

Im ersten Ruhrpott-Level zieht [ruhrpott-buden-v1.png](../Pfert/assets/ruhrpott-buden-v1.png) vor der Industriekulisse vorbei. Die Puszta-Stube scrollt mit 23 Canvas-Pixeln pro Sekunde, die Currywurstbude und die Trinkhalle mit 36. Die Hausfront der Puszta-Stube ist eine stilisierte Spielfassung des Gladbecker Imbisses an der Bottroper Straße 103. [Gladbecker Imbissporträt](https://gwg-gladbeck.de/wp-content/uploads/2025/04/gwg_zuhause_in_gladbeck_07_25.pdf)

Vor der Trinkhalle steht ein Pixel-Cameo von VfL-Jesus Thomas Dragunski mit blonder Mähne, Sonnenbrille und VfL-Schal. [Bochum Tourismus](https://www.bochum-tourismus.de/was-ist-los/news/gute-wuensche-fuer-bochum.html)

Die **Maschinenhalle Zweckel** greift Rundbogenfenster, Lisenen und die repräsentative Fassadengliederung auf. Die Spielgrafik vereinfacht Ziegelmuster und Gebäudetiefe für den scrollenden Hintergrund. [Stadt Gladbeck](https://www.gladbeck.de/inhalt/maschinenhalle) · [RuhrTriennale-Archiv](https://archiv.ruhrtriennale.de/www.2005.ruhrtriennale.de/de/spielstaetten/zeche-zweckel-gladbeck/index.html)

Bei **Getränke Jörg Kopatz** orientieren sich Schriftzug, Rotkontrast und Kronkorkenmotiv an der Anzeige des Betriebs. Die Fassade bleibt eine stilisierte Ladenfront. Für einen Abgleich von Dach, Eingängen und Fenstern fehlt eine verifizierte Fassadenaufnahme. [Anzeige in der Festschrift des Schützenvereins Gladbeck-Mitte](https://sv-gladbeck.de/wordpress/wp-content/uploads/Schuetzenverein-Gladbeck-Mitte-Festschrift-2022-7.pdf)

## Zweiter Ruhrpott-Hintergrund

[ruhrgebiet-nachtschicht-v1.png](../Pfert/assets/ruhrgebiet-nachtschicht-v1.png) ist ein separat mit dem eingebauten Imagegen-Tool erzeugtes Bild für den Innenraum der aktiven Stahlgießerei. Der vollständige Prompt steht unter industryNight in prompts.json. Das erste Ruhrpott-Level verwendet weiterhin unverändert ruhrgebiet-v1.png.

## Teaser

[teaser-v1.png](../tests/assets/teaser-v1.png) wurde mit dem eingebauten Imagegen-Tool erstellt. Bosporus und Figuren-Atlas dienten als Referenzen; das Pfert, Käse und Wein sind absichtlich nur als dunkle Silhouetten erkennbar. Der vollständige Prompt steht unter teaser in prompts.json.
