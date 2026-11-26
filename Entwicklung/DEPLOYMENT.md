# Pfert auf GitHub Pages veröffentlichen

Der Workflow [Pfert CI/CD](../.github/workflows/pages.yml) prüft Branch-Pushes. Auf `main` folgen im selben Lauf das Pages-Deployment, die Live-Prüfung und das GitHub Release. Ein laufender Workflow auf `main` wird bei einem neuen Push zu Ende geführt. Unter **Settings → Pages → Build and deployment** ist **GitHub Actions** die Veröffentlichungsquelle. [GitHub Pages mit eigenen Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Automatische Prüfungen

Die CI führt mit Node.js 24 den Sammelrunner `node tests/test-all.cjs` aus. Danach startet Playwright Pfert in Chromium über einen lokalen HTTP-Server des GitHub-Runners. Der Test wählt einen Basisskill, startet eine Runde, öffnet das Pausenmenü und setzt die Runde fort. JavaScript-Fehler und fehlgeschlagene HTTP-Anfragen schlagen im Test fehl. Beide Prüfungen müssen für das Deployment und für GitHub Releases bestehen. Gezielte lokale Prüfungen stehen in der [Testanleitung](../tests/README.md).

## Versionsnummer

Die veröffentlichte Versionsnummer steht direkt auf dem Startbildschirm in `Pfert/index.html`. Das Format lautet `Hauptversion.Unterversion.Patchversion`.

- **Hauptversion** für grundlegende oder inkompatible Änderungen. Aus 1.4.2 wird 2.0.0.
- **Unterversion** für kompatible Erweiterungen. Aus 1.4.2 wird 1.5.0.
- **Patchversion** für Fehlerbehebungen und Feinschliff. Aus 1.4.2 wird 1.4.3.

## GitHub Release mit Offline-ZIP

Für die Veröffentlichung genügt ein Push auf `main`. Nach erfolgreicher Live-Prüfung erstellt der Release-Job einen Tag für den veröffentlichten Commit, generiert Release-Notizen und hängt das spielbare ZIP an. Die Laufnummer macht jeden Release eindeutig, auch wenn die sichtbare Spielversion gleich bleibt. Bei Spielversion 1.0.7 und Laufnummer 12 entstehen beispielsweise der Tag `v1.0.7-build.12` und das ZIP `Pfert-v1.0.7-build.12.zip`. Eine Wiederholung desselben Laufs verwendet denselben Tag. Zum Offline-Spielen das ZIP entpacken und `Pfert/index.html` öffnen.

## Veröffentlichung prüfen

Nach **Deploy Pages** prüft **Verify the public game** die öffentliche Spielseite. Der Schritt vergleicht HTTP-Status, Versionsanzeige, das beim Packen gesetzte Commit-Kennzeichen und den Inhalt zentraler Spieldateien. Während die neue Version im CDN ankommt, wiederholt der Schritt den Abruf bis zu zwei Minuten. Das Ergebnis steht unter **Actions → Pfert CI/CD** beim Push auf `main`. [Öffentliche Spielseite](https://konsuul.github.io/HorsemanGazi/)

Mit **Run workflow** auf `main` lässt sich der Workflow für den aktuellen Commit manuell starten. Bei **Re-run jobs** verwendet der Deployment-Job für jeden Versuch einen eigenen Artefaktnamen.
