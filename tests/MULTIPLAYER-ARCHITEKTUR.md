# Multiplayer-Architektur für Pfert

Stand: 13.11.2026 · Entwurf zur Bestätigung · Noch keine Implementierung

## 1. Ziel und verbindliche Grenzen

- Kooperatives Online-Spiel auf getrennten Geräten für zwei bis vier Personen pro Raum; ein Raum darf mit einer Person starten.
- Auslieferung, Räume, Datenaustausch und Speicherung vollständig über ChatGPT Sites. Kein zusätzlicher Server, kein externer Echtzeitdienst und kein STUN-/TURN-Dienst.
- Der Browser des Raumerstellers berechnet die gemeinsame Runde. Sites übernimmt die Vermittlung der Daten über seine eigene Serverfunktion und D1-Datenbank.
- Zunächst private Freundesrunden mit Einladungscode; kein öffentliches Matchmaking, PvP oder manipulationssicheres Ranglistensystem.
- Das bestehende Solospiel bleibt lokal durch Öffnen von index.html spielbar. Online-Funktionen benötigen die gehostete Site.
- Dieser Entwurf benötigt die Bestätigung des Nutzers. Auch der Machbarkeitsprototyp beginnt erst danach.

## 2. Warum diese Architektur?

Sites dokumentiert HTTP, HTTPS, WebSockets und D1. Die bereitgestellte Hosting-Anleitung nennt Cloudflare Workers als Serverlaufzeit und D1/R2 als deklarierbare Speicher. Eine garantierte Raumzuordnung zu einer langlebigen Worker-Instanz oder unterstützte Durable-Objects-Bindings konnte ich darin nicht nachweisen.

Daraus folgt ausdrücklich keine Aussage, dass Sites solche Funktionen grundsätzlich ausschließt. Für das Konzept wird ihre Verfügbarkeit aber nicht vorausgesetzt. Eine globale JavaScript-Map in einem Worker wäre keine verlässliche gemeinsame Raumverwaltung über mehrere Instanzen und Neustarts hinweg.

Empfohlen wird deshalb ein browsergesteuertes Spiel mit einem anfragebasierten Relay in Sites. Alle Teilnehmer tauschen über kurze HTTPS-Anfragen Eingaben und Zustandsbilder aus; der gemeinsame Vermittlungszustand liegt in D1. Es gibt keine dauerhafte Simulationsschleife auf einem Server und keine Abhängigkeit von langlebigen Worker-Prozessen. WebRTC ohne externen Verbindungsdienst wird nicht als verlässliche Internetlösung eingeplant.

Der Preis dieser vollständig innerhalb von Sites betreibbaren Lösung ist zusätzlicher Anfrageverbrauch und mehr Verzögerung als bei einem spezialisierten Echtzeitserver. Ob sie sich für Pferts dichten Kampf gut genug anfühlt, muss vor dem großen Umbau gemessen werden. Flüssiges Online-Spiel ist in dieser Planungsphase noch nicht nachgewiesen.

## 3. Komponenten und Datenfluss

| Komponente | Aufgabe | Ausführung |
| --- | --- | --- |
| Browser-Spiel | Canvas, Eingaben, Ton, Menüs, lokale Bewegungsprognose | Alle Teilnehmer |
| Gemeinsamer Spielkern | Gegner, Waffen, Treffer, Bosssegmente, Karten, Weltzeit | Im Browser des Raumerstellers; im Solomodus lokal |
| Sites-API | Raum erstellen/beitreten, Berechtigungen, Datenaustausch, Wiederverbindung | Sites Worker |
| D1 | Räume, vier reservierbare Plätze, aktuelle Eingaben, bestätigungspflichtige Aktionen, letzter Spielzustand | Von Sites verwalteter Speicher |
| Lokaler Fortschritt | Talentbaum, persönliche Einstellungen, verbuchte Rundenbelohnungen | Browser-Speicher des jeweiligen Spielers |

Ablauf während des Spiels:

1. Mitspieler senden Bewegungszustand und neue Aktionen an die Sites-API; dieselbe Antwort liefert den letzten verfügbaren Spielzustand.
2. Der Raumersteller sendet regelmäßig ein neues Zustandsbild an die Sites-API; dieselbe Antwort liefert ausstehende Eingaben der Mitspieler.
3. Sein Spielkern verarbeitet die Eingaben in festen Simulationsschritten und entscheidet über alle Treffer und Belohnungen.
4. Die übrigen Browser zeichnen die erhaltene Welt, glätten fremde Bewegungen und korrigieren ihre lokale Bewegungsprognose anhand bestätigter Eingaben.

Alle Netzverbindungen gehen ausschließlich zur eigenen Site über HTTPS. Browser sprechen nicht direkt miteinander. Dadurch hängt die Erreichbarkeit nicht von Portfreigaben oder direkten Peer-Verbindungen ab; tatsächliche Latenz bleibt messpflichtig.

## 4. Spielregeln für die erste Version

Die folgenden Regeln sind Vorschläge und werden mit dem Gesamtkonzept bestätigt.

| Bereich | Vorgeschlagene Regel |
| --- | --- |
| Spielfeld | Alle sehen dieselbe Welt im bestehenden logischen Format 960 × 540. Jedes Pfert hat eine eigene Farbe und Kennzeichnung. |
| Eingaben | Jede Person steuert ihr Pfert mit der vorhandenen Tastatur- oder Controllerbelegung. Kein lokaler Mehrspielermodus erforderlich. |
| Schaden | Eigene Herzen, Schutzzeiten und Talente je Pfert. Kein gegenseitiger Schaden und keine Kollision zwischen Pferten. |
| Waffen | Eigene Weinwaffe, Weinzeit, Sonderangriffe und Käserausch je Pfert. |
| Erfahrung | Gemeinsamer Erfahrungsbalken und gemeinsames Level. Ein Orb wird einmal eingesammelt und einmal dem Teambalken gutgeschrieben; die Erfahrungstalente des Einsammlers wirken auf diesen Wert. Start-Erfahrungsboni werden über den Mittelwert der beim Rundenstart beteiligten Builds zusammengeführt. |
| Karten | Beim Teamaufstieg pausiert die Welt. Jede Person erhält drei eigene, für ihren Build gültige Karten und wählt eine. Nach 30 Sekunden wird die erste angebotene Karte gewählt; bei mehreren aufgelaufenen Leveln wird dies nacheinander abgearbeitet. Getrennte Verbindungen blockieren die Auswahl nicht. |
| Beute | Flaschen, Most und Sonderwein gehören dem ersten Pfert, das sie tatsächlich einsammelt. Anziehung gilt zum nächsten berechtigten Pfert innerhalb seiner individuellen Reichweite; Gleichstände entscheidet die feste Spieler-ID. Mehr Beute bei mehr Spielern wird über die Skalierung geprüft. |
| Käserausch | Persönlicher Schaden und Schutz. Das Entfernen sichtbarer regulärer Gegner und feindlicher Geschosse wirkt auf die gemeinsame Welt; Belohnungen entstehen pro Gegner nur einmal. Aufladung durch Abschüsse geht an den Verursacher, Ausweichen/Blocks gelten persönlich. |
| Gegnerziele | Gezielte Angriffe wählen ein lebendes Pfert nach einer festen, testbaren Regel, zunächst das nächste. Bereits abgefeuerte suchende Angriffe behalten ihr Ziel, solange es gültig ist. |
| Synergien | Jeder Angriff speichert seinen Besitzer und dessen Angriffswerte. Verbrennung, Splitter, Echos und Ketten behalten diese Zuordnung; bereits vergebene Bonuseffekte erzeugen keine unbegrenzten Generationen. |
| Tod | Bei null Herzen wird zugeschaut. Wenn ein Boss besiegt wird, kehren ausgeschiedene, noch verbundene Spieler mit zwei Herzen und kurzer Schutzzeit zurück. Sind alle besiegt, endet die Runde. |
| Levelwechsel | Hauptwelt, Geheimlevel, Übergänge und Bossstart gelten für alle gleichzeitig. Die Weltzeit pausiert wie im Solospiel im Geheimlevel. |
| Fortschritt | Eigener lokaler Talentbaum wird beim Rundenstart eingefroren. Belohnung nach eigener aktiver Überlebenszeit und gemeinsam besiegten Bossen, bei denen die Person lebend beteiligt war. Verbuchung je Runden-ID nur einmal. |
| Punkte | Gemeinsamer Rundenscore; Solowerte und Koopwerte werden später getrennt ausgewiesen, falls die geplante Punktetafel umgesetzt wird. |

Für die erste Balanceprobe gilt bei N fest eingeplanten Teilnehmern: Gegner- und Bossleben × (1 + 0,75 × (N − 1)); reguläre Spawnrate und Beuterate × (1 + 0,25 × (N − 1)). Der Druck durch Karten basiert auf durchschnittlicher Buildstärke statt der Summe aller Karten. Diese Faktoren sind Startwerte, keine getestete Balance. N bleibt während der Runde konstant; Verbindungsabbrüche ändern Lebenspunkte und Belohnungen nicht nachträglich. Die Zielzeit gewöhnlicher Bosse von ungefähr 45–90 Sekunden bleibt Prüfziel.

## 5. Raumablauf und Verbindungsprobleme

- Menü: Solo, Raum erstellen, Raum beitreten. Beitritt über Code oder Einladungslink; bis zu vier Plätze.
- Lobby: Anzeigename, Farbe, Verbindungsstatus, Talentübersicht und Bereitstatus. Nur der Ersteller startet, wenn alle verbundenen Teilnehmer bereit sind.
- Beitritt neuer Spieler zunächst nur vor Rundenstart. Nach Start sind Plätze fest; ein eigener getrennter Platz kann wieder verbunden werden.
- Unterbrochene Bewegungseingaben werden nach spätestens 250 ms ohne frische Eingabe neutralisiert. Es werden keine alten Bewegungszeiten nachträglich abgespielt.
- Bei einem getrennten Mitspieler wird dessen Pfert zunächst für höchstens 30 Sekunden aus dem Kampf genommen und erhält währenddessen keine Zeit- oder Bossbelohnungen. Bei Wiederverbindung kommt es mit dem letzten persönlichen Zustand und kurzer Schutzzeit zurück. Nach Ablauf bleibt es bis Rundenende ausgeschieden.
- Fehlt der Raumersteller oder kann sein Browser nicht weiter simulieren, frieren die anderen Browser die Runde ein. Wiederaufnahme mit derselben Host-Sitzung innerhalb von 30 Sekunden; danach Abbruch mit dem letzten bestätigten Belohnungsstand. Kein automatischer Hostwechsel in Version 1.
- Wechsel in einen inaktiven Host-Tab führt nach Möglichkeit sofort zur gemeinsamen Pause; ausbleibende Zustandsbilder lösen sie spätestens über einen Timeout aus. Browserdrosselung und Schlafmodus sind ein ausdrücklich zu testendes Risiko.
- Pausen- und Auswahlfristen werden von Sites anhand der Serverzeit verwaltet; ein nicht mehr reagierender Host kann die Runde trotzdem nicht fortsetzen.
- Abgelaufene Räume sind unabhängig von physischer Löschung nicht mehr zugänglich. Begrenzte Bereinigung bei API-Aufrufen entfernt alte Daten, ohne einen zusätzlichen Hintergrunddienst einzuführen.

## 6. Synchronisierung und Konsistenz

- Spielsimulation zunächst mit festen 60 Schritten pro Sekunde; Darstellung getrennt davon. Begrenztes Nachholen bei kurzen Verzögerungen, danach gemeinsame Pause statt eines großen Zeitsprungs.
- Netzfrequenz im Kampf als Startwert 15 Austausche pro Sekunde und Teilnehmer; im Prototyp 10, 15 und 20 vergleichen. Pro Teilnehmer höchstens eine ausstehende Anfrage, keine wachsende Warteschlange. Lobby/Pause deutlich langsamer.
- Bewegungszustände dürfen durch neuere ersetzt werden. Einmalige Aktionen wie Sonderangriff, Käserausch und Kartenauswahl bleiben mit einer eindeutigen Nummer ausstehend, bis der Host ihre Verarbeitung bestätigt. Wiederholte Anfragen lösen sie nicht doppelt aus.
- Zustandsbilder enthalten Runden-ID, Protokollversion, Simulationsschritt, Zustand aller spielrelevanten Objekte und bestätigte Eingaben/Aktionen. Ältere Antworten werden anhand der Versionsnummer verworfen.
- Vorerst vollständige kompakte Zustandsbilder statt fehleranfälliger Differenzketten; Teilchen, Rauchspuren, Bildschirmwackeln und Ton werden lokal aus begrenzten Ereignissen erzeugt. Keine Bilder oder Canvas-Frames übertragen.
- Alle Entitäten erhalten stabile IDs; Besitzer- und Trefferlisten verwenden IDs statt JavaScript-Objektreferenzen. Sets und unendliche Kartenlimits benötigen eine explizite, geprüfte Serialisierung.
- Der Host ist die einzige Schreibberechtigung für Simulationszustände. Sein Sitzungsschlüssel und eine Raumgeneration verhindern, dass eine alte oder fremde Sitzung Zustände überschreibt. Monotone Zustandsnummern schützen gegen verspätete Antworten und Retries.
- D1-Operationen für Zustandsübernahme und Bestätigungen werden atomar gebündelt. Kritische Lesezugriffe gehen konsistent gegen die primäre Datenbank; keine ungeprüften Cache-/Replikalesungen. API-Antworten sind nicht zwischenspeicherbar.
- Reservierung des vierten Platzes und Rundenstart erfolgen mit atomaren Bedingungen; zwei gleichzeitige Beitritte können keinen fünften Spieler erzeugen.
- Neue Verbindung erhält ein vollständiges Zustandsbild, keine Wiederholung sämtlicher alter Effekte. Spielversionskonflikte verlangen ein Neuladen vor dem Beitritt.

## 7. Zugriff und Grenzen des Vertrauens

Kurze lesbare Raumcodes dienen der Suche; separate zufällige Sitzungsschlüssel berechtigen zum eigenen Platz. Nur deren Hashes werden gespeichert. Rollen, Payload-Größe, Zahlenbereiche und Anfragerate werden in Sites geprüft; SQL verwendet gebundene Parameter. Raumcodes, Namen und alle Browserdaten sind untrusted input. Limits begrenzen Anfragen, offene Aktionen und gespeicherte Zustandsgröße. Keine Servergeheimnisse im ausgelieferten Spiel.

Die Vermittlung schützt Räume und Plätze, validiert aber nicht die gesamte Simulation. Ein manipuliertes Host-Spiel oder manipulierte lokale Talente können daher betrügen. Für private Freundesrunden wird dieses Vertrauensmodell vorgeschlagen. Manipulationssichere Ranglisten oder verlässlich zentrale Fortschrittskonten gehören nicht zu Version 1.

Site-Zugriff und Raumbeitritt sind getrennt: Alle Mitspieler benötigen zunächst Zugriff auf die veröffentlichte Site, danach den Raumcode. Die konkrete Sites-Freigabe wird beim späteren Hosting eingerichtet; heute wird keine Site erstellt oder veröffentlicht.

## 8. Anpassung des vorhandenen Spiels

Der aktuelle game.js hält unter anderem player, hearts, upgrades, metaData, Erfahrung und Weltzustand global in einer gemeinsamen Browserfunktion. Eingaben, Darstellung, Ton, Talente und Simulation sind eng verbunden. Es reicht deshalb nicht, drei zusätzliche Pfert-Grafiken zu zeichnen.

Vorgesehene, einfache Aufteilung:

- game-core.js: DOM-freier Weltzustand, Spielerzustände, Simulationsschritte, Treffer, Belohnungen und Kartenregeln. Ein Einspeisepunkt für reproduzierbaren Spielzufall; Darstellungszufall separat.
- game-data.js: gemeinsame Waffen-/Kartendaten und simulationsrelevante Bossgeometrie. Bosskollision darf nicht vom Canvas-Zeichencode abhängen.
- game.js: Browserablauf, Eingabe, Menüs und Anbindung des Kerns; Darstellung bei Bedarf in game-render.js auslagern.
- multiplayer.js: Lobby, Sitzungen, Transport, Zustandsabgleich und Wiederverbindung.
- sites/: getrenntes Hostingprojekt mit Sites-API, D1-Schema, Migrationen und Auslieferung des bestehenden Spiels. Die Sites-Werkzeuge erzeugen den Hosting-Build; das lokale Solospiel benötigt weiterhin keinen Build.

Die Sites-Serverfunktion folgt dem unterstützten Starter und bleibt eine kleine Vermittlungsschicht. Es wird kein kompletter neuer Spielfrontend-Stack eingeführt. Bestehende Grafiken, Sounds und lokale Talentdaten werden weiterverwendet. Der Wechsel von file:// zur gehosteten HTTPS-Adresse übernimmt vorhandene lokale Speicherstände nicht automatisch; zunächst separate Fortschrittsstände, kein stillschweigendes Versprechen einer Übertragung.

## 9. Hosting-Verbrauch

Es gibt kein zusätzliches Hostingkonto, Serverabo oder externes Relay. Das bedeutet jedoch nicht unbegrenzt kostenloses Sites-Hosting.

Bei vier Teilnehmern und einem gebündelten Austausch pro Teilnehmer ergeben sich rechnerisch:

| Frequenz | API-Anfragen pro Sekunde | API-Anfragen je Stunde |
| --- | ---: | ---: |
| 10 Hz | 40 | 144.000 |
| 15 Hz | 60 | 216.000 |
| 20 Hz | 80 | 288.000 |

Retries, Lobby, Assets und zusätzliche Aktionen kommen hinzu. Auch D1-Operationen und Datenvolumen werden gemessen. Die offizielle Sites-Dokumentation nennt am 13.11.2026 kostenloses Hosting bis 31.12.2026 und danach planabhängige Kontingente; Mehrverbrauch kann Kosten auslösen. Die genannten künftigen Sätze sind als Vorschlag gekennzeichnet und müssen vor Veröffentlichung erneut geprüft werden. Eine Zusage dauerhaft kostenfreien Betriebs ist daraus nicht ableitbar.

Zunächst wird eine aktive Runde mit vier Teilnehmern als Lastziel geprüft. Mehrere gleichzeitige Räume bleiben begrenzt, bis Messwerte vorliegen. Ein anwendungsseitiges Limit stoppt neue Räume bzw. reduziert zulässige Austauschfrequenzen; es ersetzt kein verifiziertes Kontolimit für die Sites-Abrechnung.

## 10. Umsetzung erst nach Bestätigung

1. **Machbarkeit innerhalb von Sites prüfen:** Kleiner technischer Versuchsaufbau mit einem simulierten Host und drei simulierten Teilnehmern. HTTPS-/D1-Roundtrips, atomare Beitritte, konsistente Zustände, Payloads, Anfragerate und Kostenannahmen messen. Keine visuellen Browser-Spieltests. Für diese gehostete Messung ist eine begrenzt freigegebene Test-Site nötig; rein lokale Messungen belegen die Sites-Latenz nicht.
2. **Entscheidung anhand der Messwerte:** Ziel für eine gemeinsame regionale Verbindung: im 95. Perzentil höchstens 150 ms vom Absenden einer Eingabe bis zur Verarbeitung beim Host und höchstens 250 ms bis zur bestätigten Zustandsantwort beim Mitspieler; keine dauerhaft anwachsenden Rückstände. Das sind Abnahmeschwellen, keine gemessenen Werte. Bei Nichterreichen nicht automatisch einen externen Dienst ergänzen, sondern den Befund mit dem Nutzer besprechen.
3. **Spielkern herauslösen:** Einen Spieler mit den bisherigen Waffen, Talenten, Bossen, Geheimleveln und Eingaben funktional erhalten. Vorher/nachher reproduzierbare Spielabläufe vergleichen.
4. **Koop im Kern:** Zwei bis vier Pferts, Besitzerzuordnung, Zielwahl, Erfahrung, Karten, Tod, Rückkehr und Skalierung implementieren und automatisiert prüfen.
5. **Online anbinden:** Lobby, atomare Platzvergabe, Austausch, lokale Bewegungsprognose, Wiederverbindung und Timeouts integrieren.
6. **Sites veröffentlichen:** Nur nach erfolgreichen technischen Prüfungen in der vorgesehenen Zugriffskonfiguration bereitstellen. Der Nutzer prüft anschließend das tatsächliche Spielgefühl auf getrennten Geräten und die visuelle Darstellung.

Neue sinnvolle Prüffälle: test-multiplayer.cjs für Koopregeln; test-network.cjs für Verzögerungen, verlorene Antworten, doppelte Aktionen, alte Zustände und Verbindungsabbrüche; test-sites-api.cjs für Raumzugriff, gleichzeitige Beitritte, D1-Konsistenz und Datenbegrenzung. D1-Integration mit der unterstützten lokalen Laufzeit prüfen; reine Mocks reichen für konkurrierende Beitritte nicht.

Nach übergreifenden Änderungen ist node test-all.cjs auszuführen und um die neuen relevanten Prüfungen zu erweitern. Vorhandene Tests für Kampf, Eingaben, Fortschritt, Sound, Assets, Balance und Talente bleiben maßgeblich. Praktische Vier-Spieler-Balance, Host-Tabwechsel und der Spielspaß unter realer Latenz bleiben Nutzerprüfungen. ROADMAP.md erst entsprechend tatsächlich umgesetzter und geprüfter Schritte abhaken.

## 11. Quellen und Prüfstand

- [OpenAI: Sites – Laufzeitgrenzen, WebSockets und Hosting-Verbrauch](https://learn.chatgpt.com/docs/sites)
- [OpenAI: Sites – Daten und Verbindungen](https://learn.chatgpt.com/docs/sites/data-and-connections)
- [Cloudflare: D1 Database API und atomare Batches](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Cloudflare: D1-Replikation und Konsistenz](https://developers.cloudflare.com/d1/best-practices/read-replication/)

Lokale Grundlage: ROADMAP.md, README.md, game.js, index.html, bestehende Tests und installierte Sites-Hosting-Anleitung. Nur Konzept und Roadmap-Verweis wurden bearbeitet. Keine Spielimplementierung, keine Site-Erstellung, keine Veröffentlichung und keine Spieltests in dieser Planungsphase.
