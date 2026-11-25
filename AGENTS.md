# Pfert

Ein schlankes, direkt im Browser spielbares Canvas-Spiel. `Pfert/index.html` öffnen; keine Installation nötig. Änderungen einfach halten.

Bei Implementierungen nur die kleinste für die Aufgabe notwendige Prüfung durchführen. Die `tests/README.md` dient zur Auswahl gezielter Tests für betroffene Spielabläufe und konkrete Regressionsrisiken. `node tests/test-all.cjs` und andere vollständige Testläufe nur auf ausdrückliche Anforderung des Nutzers ausführen. Visuelle Browser-Spieltests übernimmt der Nutzer. Getestete Abläufe und etwaige Einschränkungen im Ergebnis nennen.

Vor Änderungen am Spielablauf die [Spielarchitektur](Entwicklung/ARCHITEKTUR.md) und bei relevanten Änderungen die [Roadmap](Entwicklung/ROADMAP.md) lesen. Bei neuen Spielregeln oder geänderten Berechnungen die Architektur mit der Implementierung aktualisieren. Einen Roadmap-Punkt erst abhaken, wenn er vollständig umgesetzt ist und ein gezielter Test das gewünschte Verhalten bestätigt hat. Den Test und sein bestandenes Ergebnis beim Punkt dokumentieren und den abgehakten Eintrag nach [ROADMAP_done.md](Entwicklung/ROADMAP_done.md) verschieben. Teilweise erledigte Punkte und Punkte ohne bestandenen Test in der Roadmap offen lassen und ihren Stand kurz dokumentieren. Neue Anforderungen passend ergänzen.
