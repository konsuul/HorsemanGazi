# Pfert auf GitHub Pages veröffentlichen

Der Workflow [Pfert CI/CD](../.github/workflows/pages.yml) prüft Branch-Pushes und veröffentlicht nach bestandenen Tests den Ordner `Pfert/` aus dem geprüften Commit auf GitHub Pages, wenn der Lauf auf `main` gestartet wurde. Ein neuer Push auf denselben Branch ersetzt einen laufenden Workflow. Unter **Settings → Pages → Build and deployment** ist **GitHub Actions** die Veröffentlichungsquelle. [GitHub Pages mit eigenen Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Automatische Prüfungen

Die CI führt mit Node.js 24 den Sammelrunner `node tests/test-all.cjs` aus. Er findet alle `test-*.cjs`-Suiten und startet zusätzlich die Fälle, die nur mit einem eigenen Schalter laufen. Ein Fehler blockiert das Deployment. Gezielte lokale Prüfungen stehen in der [Testanleitung](../tests/README.md).

## Versionsnummer

Die veröffentlichte Versionsnummer steht direkt auf dem Startbildschirm in `Pfert/index.html`. Das Format lautet `Hauptversion.Unterversion.Patchversion`.

- **Hauptversion** für grundlegende oder inkompatible Änderungen. Aus 1.4.2 wird 2.0.0.
- **Unterversion** für kompatible Erweiterungen. Aus 1.4.2 wird 1.5.0.
- **Patchversion** für Fehlerbehebungen und Feinschliff. Aus 1.4.2 wird 1.4.3.

Die Anzeige bei einem Release vor dem Commit aktualisieren. Tags können Releases markieren.

## Veröffentlichung prüfen

Unter **Actions → Pfert CI/CD** den Lauf für den Push auf `main` öffnen. Nach erfolgreichem **Deploy Pages** die [Spielseite](https://konsuul.github.io/HorsemanGazi/) öffnen und die erwartete Versionsnummer prüfen. Bei einer alten Anzeige die Seite mit einem frischen Query-Parameter erneut laden.

Mit **Run workflow** auf `main` lässt sich der Workflow für den aktuellen Commit manuell starten. Bei **Re-run jobs** verwendet der Deployment-Job für jeden Versuch einen eigenen Artefaktnamen.
