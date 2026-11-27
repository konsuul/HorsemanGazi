# Pfert – Roadmap

## Sichtabnahme im Spiel

- [ ] **Grafik und Lesbarkeit.** Die [Grafikvorgabe](ARTWORK.md) enthält verbindliche Abnahmekriterien. Im Spiel noch Kontrast, Lesbarkeit und Stil der ausgegrauten Umgebungsgefahren, Bosssegmentbrüche, Ausrüstung und Feld-Power-ups prüfen. Die Renderpfade und Gefahrenmarkierungen haben `test-readability.cjs` bestanden. [GitHub-Lauf](https://github.com/konsuul/HorsemanGazi/actions/runs/45980243776)
- [ ] **Ruhrpott.** Das durchgehende mittlere Parallax-Band in beiden Szenen und das neue Schild der Maschinenhalle Zweckel sind implementiert. `test-assets.cjs` hat Kachelanschluss, Scrollpositionen und Schild im Rasterbild sowie in der Ersatzgrafik bestätigt. Optik und Laufruhe im Gefecht stehen zur Sichtabnahme aus. [GitHub-Lauf](https://github.com/konsuul/HorsemanGazi/actions/runs/45980243776)
- [ ] **Bildrate bei vielen Projektilen.** Leuchthöfe und weichgezeichnete Elementarpartikel werden als Canvas-Sprites wiederverwendet. `test-readability.cjs` prüft bei 360 Spieler- und 216 Feindgeschossen die Darstellung, Animation und Sprite-Wiederverwendung. GitHub-Ergebnis und Bildrate auf älteren Geräten stehen noch aus.

## Balance und Bedienung · 27.11.2026

- [ ] **Patronen, Rückendeckung und Standardgegner.** Implementiert: Patronen-Nachladezeiten halbiert (Basis / 2,60), Rückwärtsschaden +500 % (1,2 × Rang), normale Feuertimer ×0,7 für 30 % weniger Projektile bei gleichen Salven. Gezielte Tests in `test-encounters.cjs --caravan` und `test-game.cjs` angepasst/ergänzt; GitHub-Ergebnis noch ausstehend.
- [ ] **Pause, Unsterblichkeit und Suchraketen.** Power-ups direkt sichtbar; Numpad 0 schaltet im Hauptmenü Unsterblichkeit für neue Runden; Suchraketen doppelt breit/hoch mit Rumpf, Spitze und Flossen. Regressionen in `test-pause-cards.cjs` und `test-game.cjs` ergänzt. GitHub-Ergebnis und visuelle Abnahme durch den Nutzer noch ausstehend.
`n- [ ] **Erdbolzen und Glutkern.** Erdbolzen-Faktor 1,18 → 1,77 (+50 %); Glutkern-Brand maximal drei Stapel mit erneuerter gemeinsamer Dauer, Reset nach Ablauf. GitHub-Tests ausstehend.
