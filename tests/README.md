# Pfert prüfen

[Spielanleitung und Entwicklungsdokumentation](../Entwicklung/README.md)

## Prüfung

Die folgenden Befehle laufen vom Projektstamm aus.

Tests passend zur Änderung auswählen; mehrere Bereiche bei Wechselwirkungen gemeinsam prüfen:

- `node tests/test-scoreboard.cjs`: Punktetafel, Sortierung und Speicherung.
- `node tests/test-game.cjs`: Kampf, Waffen, Karten, Gegner, Bosssegmente und Geheimlevel sowie Musikrotation (alle MP3-Dateien, neu gemischte Durchläufe und keine direkte Wiederholung am Rundenwechsel).
- `node tests/test-game.cjs --boomerang` prüft Durchschläge vor der Umkehr und erneute Treffer auf dem Rückflug.
- `node tests/test-encounters.cjs --boss-attacks`: Angriffsfolgen aller neun Bosse inklusive Warnungen und Wellen der 18 Sonderangriffe.
- `node tests/test-encounters.cjs --telegraphs` prüft beim Teppich und bei Impulsangriffen dass die Geschosse ohne sichtbare Warnlinien abgefeuert werden.
- `node tests/test-encounters.cjs --formation`: Fünf Formationen, Vorwarnung, Einflugspuren, Salven, Pause und Ausschluss bei Bossen und im Ruhrpott.
- `node tests/test-encounters.cjs --caravan`: Munitionskarten, Nachladung, Maschinen und Abschluss der neuen Hauptbosse.
- `node tests/test-encounters.cjs --wind`: Windschatten, Nachladeschub, Pausen und Sternenpost.
- `node tests/test-input.cjs`: Controller, Tastatur, Basisskills, Karten und Laserzielwahl.
- `node tests/test-items.cjs`: Ausrüstungskatalog, Beute, Boss-Rückwege, Rucksack, Bedienung, Werte und Run-Reset.
- `node tests/test-progress.cjs`: Orbs, Stufenaufstieg, Fortschrittsanzeige und Käserausch.
- `node tests/test-sound.cjs`: Soundausgabe, Stummschaltung und Stimmenlimits.
- `node tests/test-assets.cjs`: Asset-Laden, Fallbacks und Bildausschnitte. Mit `--ruhr` nur die Ruhrpott-Kulissen prüfen.
- `node tests/test-balance.cjs`: Waffen-DPS-Vergleich.
- `node tests/test-meta.cjs` und `node tests/test-meta-game.cjs`: Talentbaum, Speicherung und Talentwirkungen.
- `node tests/test-all.cjs`: vollständiger Testlauf in GitHub Actions und lokal auf ausdrückliche Anforderung. Er findet alle `test-*.cjs`-Suiten und führt auch die separaten Prüfungen für Bumerang, Warnspuren, Formationen, Windschatten und Basarkarawane aus.

GitHub Actions prüft zusätzlich den Spielstart, die Pause und das Fortsetzen in Chromium. Die dafür nötigen Browser-Abhängigkeiten installiert der Workflow auf dem Runner.

`node tests/render-preview.cjs` rendert echte Canvas-Vorschaubilder und eine kurze Renderlast. Dafür muss optional `@napi-rs/canvas` installiert oder im vorhandenen Node-Runtime gebündelt sein; das Spiel selbst benötigt es nicht. Ein Browser-Spieltest und eine Audio-Hörprobe werden dadurch nicht ersetzt.
