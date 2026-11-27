# Pfert

Ein schlankes, direkt im Browser spielbares Canvas-Spiel. `Pfert/index.html` öffnen; keine Installation nötig. Änderungen einfach halten.

Bei kleinen Änderungen immer die Patch-Version (die letzte der drei Zahlen) in `Pfert/index.html` um eins erhöhen und mit der Änderung committen. Beispiel: 1.1.0 → 1.1.1.

Tests für betroffene Spielabläufe und konkrete Regressionsrisiken weiterhin entwickeln und pflegen; die `tests/README.md` dient zur Auswahl. Vor jedem Push grundsätzlich die betroffenen Abläufe lokal gezielt und inkrementell testen, nicht erst nach einem Fehler in GitHub. Erforderliche Tests mitpushen, damit sie Teil der GitHub-Pipeline sind. Keine lokalen Gesamttests ausführen; der Gesamttest läuft über GitHub. Pushes erfolgen als Fire-and-forget: Pipeline-Läufe danach weder verfolgen noch Ergebnisse abwarten oder abrufen. Die GitHub-Pipeline und visuelle Browser-Spieltests überprüft der Nutzer. Lokal getestete Abläufe und etwaige Einschränkungen im Ergebnis nennen; ein Push allein gilt nicht als bestandener Pipeline-Test.

Vor Änderungen am Spielablauf die [Spielarchitektur](Entwicklung/ARCHITEKTUR.md) und bei relevanten Änderungen die [Roadmap](Entwicklung/ROADMAP.md) lesen. Bei neuen Spielregeln oder geänderten Berechnungen die Architektur mit der Implementierung aktualisieren. Einen Roadmap-Punkt erst abhaken, wenn er vollständig umgesetzt ist und ein gezielter Test in der GitHub-Pipeline das gewünschte Verhalten bestätigt hat. Den Test und sein bestandenes Ergebnis beim Punkt dokumentieren und den abgehakten Eintrag nach [ROADMAP_done.md](Entwicklung/ROADMAP_done.md) verschieben. Teilweise erledigte Punkte und Punkte ohne bestandenen Test in der Roadmap offen lassen und ihren Stand kurz dokumentieren. Neue Anforderungen passend ergänzen.
