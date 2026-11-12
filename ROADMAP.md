# Pfert – Testfeedback vom 11.11.2026

Diese Übersicht hält die geplanten Änderungen und ihren Fortschritt fest. Ein Punkt wird erst nach Umsetzung und Prüfung abgehakt. Teilfortschritt und offene Entscheidungen stehen direkt beim jeweiligen Punkt.

## Etappe 1: Steuerung und Spielfluss

- [ ] **Controller-Unterstützung:** Bewegung und bestehende Spielaktionen mit einem Controller bedienen; Tastatur und Maus bleiben nutzbar.
- [ ] **Kartenwahl:** Karten mit Pfeiltasten und Controller auswählen und bestätigen; Maus und Zahlentasten bleiben nutzbar.
- [ ] **Levelwechsel:** Beim Betreten und Verlassen beider Ruhrpott-Abstecher eine Wirbelanimation zeigen und das Spiel während des Übergangs pausieren.
- [ ] **Seltene Karten:** Berechtigte seltene Synergiekarten abwechslungsreicher anbieten und unmittelbare Wiederholungen vermeiden, wenn genügend Alternativen verfügbar sind.

## Etappe 1: Balancing und Effekte

- [ ] **Schaden:** Spielerschaden insgesamt mit 1,5 multiplizieren.
- [ ] **Waffenbalance:** Durchschnittlichen Schaden pro Sekunde der Waffen unter vergleichbaren Bedingungen auf höchstens 15 % Abweichung abstimmen. Ausgangspunkt sind automatische Angriffe ohne Karten und Zufallstreffer gegen ein vergleichbares Ziel; Trefferverhalten und Builds können das Ergebnis im Spiel verändern.
- [ ] **Bosse:** Lebenspunkte aller Bosse und ihrer Segmente verfünffachen.
- [ ] **Käserausch:** Langsamer aufladen und bei Aktivierung bis zu zwei Herzen heilen, begrenzt auf das Herzmaximum. Startannahme für den Spieltest: halbe bisherige Aufladerate.
- [ ] **Boss-Treffer:** Das getroffene Segment bei jedem Schadensereignis einschließlich Schaden über Zeit unmittelbar kurz weiß aufblitzen lassen und danach seine ursprüngliche Grafik wiederherstellen. Ausgangslage: Segment-Blitze sind bereits angelegt; das gewünschte Verhalten muss geprüft werden.

## Spätere Etappe: Sonderwaffen und Power-up

- [ ] **Sonderwaffen:** Aufgeladene Schüsse ersetzen durch Sonderwaffen mit drei wiederaufladbaren Einsätzen, ausgelöst durch einmaliges Drücken der Leertaste. Ein Bildschirm-Clear ist ein möglicher Effekt. Offen: Aufladeregeln und konkrete Effekte.
- [ ] **Ansaug-Power-up:** Das im Feedback genannte 12-Pixel-Ansaug-Power-up um Faktor 20 vergrößern. Vor der Umsetzung die betroffene Funktion und die gemeinte Größe prüfen.

## Spätere Etappe: Metaprogression

- [ ] **Buildtree:** Für Spielrunden dauerhafte Punkte vergeben und damit Freischaltungen und Verbesserungen in einem Buildtree ermöglichen. Offen: Punktevergabe, Knoten und Speicherung.

## Spätere Etappe: Online-Multiplayer

- [ ] **Online gemeinsam spielen:** Spielen über das Internet auf getrennten Geräten ermöglichen. Architektur, Spielregeln, Anzahl der Spielenden und Betriebsanforderungen vor der Umsetzung festlegen.
