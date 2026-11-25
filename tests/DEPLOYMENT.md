# Pfert auf GitHub Pages veröffentlichen

Der Workflow [Publish Pfert](../.github/workflows/pages.yml) wird manuell auf `main` gestartet. Er lädt den angegebenen Release-Tag, prüft die Versionsanzeige in `Pfert/index.html` und veröffentlicht den Ordner `Pfert`.

## Release vorbereiten und pushen

1. Auf `main` mit `git status --short --branch` den Arbeitsstand prüfen und nach `git fetch origin` sicherstellen, dass alle Änderungen aus `origin/main` enthalten sind. Prüfen, dass die nächste Versionsnummer lokal und auf GitHub frei ist.
2. In `Pfert/index.html` die sichtbare Versionsnummer aktualisieren. Die betroffenen Abläufe gezielt nach [README](README.md#prüfung) prüfen. Nur die zum Release gehörenden Dateien stagen und committen.
3. Den Release-Commit taggen und Branch und Tag atomar pushen. Hier steht `1.0.5` als Beispiel.

   ```powershell
   git tag v1.0.5
   git push --atomic origin main refs/tags/v1.0.5
   git ls-remote origin refs/heads/main refs/tags/v1.0.5
   ```

   Vor der Veröffentlichung prüfen, ob beide Remote-Refs auf den vorgesehenen Release-Commit zeigen.

## Workflow starten und live prüfen

1. In GitHub unter **Actions → Publish Pfert → Run workflow** den Branch `main` wählen und bei `version` die Nummer ohne `v` eingeben. Mit authentifiziertem GitHub CLI geht das auch so.

   ```powershell
   gh workflow run pages.yml --repo konsuul/HorsemanGazi --ref main -f version=1.0.5
   ```

2. Den neu gestarteten Lauf bis zum erfolgreichen Schritt **Deploy Pages** verfolgen. Ein erfolgreicher Push oder angenommener Workflow-Start allein bestätigt noch keine Veröffentlichung.
3. Die [öffentliche Spielseite](https://konsuul.github.io/HorsemanGazi/) mit einem frischen Query-Parameter abrufen. HTTP 200 und die erwartete Versionsnummer im Startbildschirm prüfen. Bei erfolgreichem Workflow und alter Versionsanzeige kurz warten und mit einem neuen Parameter erneut prüfen.

   ```powershell
   $version = '1.0.5'
   $check = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
   $page = Invoke-WebRequest "https://konsuul.github.io/HorsemanGazi/?check=$check"
   if ($page.StatusCode -ne 200 -or $page.Content -notmatch ('class="title-version">Version ' + [regex]::Escape($version) + '<')) {
    throw "Version $version ist auf der öffentlichen Seite noch nicht bestätigt."
   }
   ```

## Wenn das Deployment-Artefakt fehlt oder doppelt ist

Wenn der Upload erfolgreich war und **Deploy Pages** anschließend null oder mehrere Artefakte namens `github-pages` meldet, nach Ende des Laufs über **Run workflow** einen neuen Lauf für denselben Tag starten. **Re-run jobs** verwendet dieselbe Lauf-ID. Der Upload kann dabei ein zweites gleichnamiges Artefakt anlegen und den nächsten Versuch blockieren. Für einen neuen Lauf bleibt der Release-Tag bestehen.

Dieses Vorgehen wurde mit Version 1.0.4 bestätigt. Der erste Lauf fand kein Artefakt, der erneut ausgeführte Job fand zwei. Ein neuer Workflow-Lauf veröffentlichte denselben Tag erfolgreich. Danach lieferte die öffentliche Seite HTTP 200 und zeigte Version 1.0.4. [Erfolgreicher Workflow-Lauf](https://github.com/konsuul/HorsemanGazi/actions/runs/45683357096)
