# Grafik-Überarbeitung · 11.11.2026

Erstellt mit dem eingebauten Imagegen-Tool, ohne CLI-Fallback. Die Original-PNGs wurden unverändert ins Projekt kopiert. Die vollständigen verwendeten Prompts stehen in [prompts.json](prompts.json).

| Datei | Verwendung | Tatsächliche Größe |
| --- | --- | --- |
| [characters-v1.png](characters-v1.png) | Figuren, Pfert-Posen und Bosskörper | 1254 × 1254 |
| [bosporus-v1.png](bosporus-v1.png) | Stadtpanorama | 1672 × 941 |
| [ruhrgebiet-v1.png](ruhrgebiet-v1.png) | Industriepanorama | 1672 × 941 |
| [effects-v1.png](effects-v1.png) | Explosionen, Geschosse und magische Effekte | 1254 × 1254 |

Die tatsächlichen Figuren hielten die angefragten Rastergrenzen nicht überall ein. Deshalb nutzt die Integration die transparenten Objektgrenzen in frames.json. vfx-frames.json enthält die separaten Effektzellen. Alle Zuschnitte liegen in den Bildern; Transparenz und Originaldateien bleiben erhalten.

Die Bilder werden ohne weiche Interpolation skaliert. Panoramen werden gespiegelt und langsam gescrollt. Laufzeit-Licht, Partikel, Leuchtspuren und HUD entstehen weiterhin im Canvas. Die ursprünglichen Canvas-Grafiken bleiben bei Ladefehlern spielbare Fallbacks.

Die neue Kulisse ist aufwändiger, aber nicht als fertiggestellte AAA-Produktion zu verstehen. Die Kombination aus Artwork, Animation, Beleuchtung und Lesbarkeit wird über native Canvas-Vorschaubilder geprüft.

## Zweiter Ruhrpott-Hintergrund

[ruhrgebiet-nachtschicht-v1.png](ruhrgebiet-nachtschicht-v1.png) ist ein separat mit dem eingebauten Imagegen-Tool erzeugtes Bild für den Innenraum der aktiven Stahlgießerei. Der vollständige Prompt steht unter industryNight in prompts.json. Das erste Ruhrpott-Level verwendet weiterhin unverändert ruhrgebiet-v1.png.

## Teaser

[teaser-v1.png](teaser-v1.png) wurde mit dem eingebauten Imagegen-Tool erstellt. Bosporus und Figuren-Atlas dienten als Referenzen; das Pfert, Käse und Wein sind absichtlich nur als dunkle Silhouetten erkennbar. Der vollständige Prompt steht unter teaser in prompts.json.
