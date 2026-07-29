# Trendfolge-Breakout-Strategie

Konkrete, regelbasierte Handelsstrategie für das Trading-Signal-Modul des Firmen-Tools.
Die Strategie liegt als Pine-Script-v6-Datei vor ([`trendfolge-breakout.pine`](./trendfolge-breakout.pine))
und sendet ihre Signale direkt an den vorhandenen Webhook (`/api/webhooks/tradingview`).

## ⚠️ Zuerst das Wichtigste: ehrliche Erwartungen

**Es gibt keine Strategie mit Gewinngarantie – von niemandem.** Wer so etwas verspricht, lügt.
Was eine gute Strategie leisten kann:

- **Positive Erwartung über viele Trades** (nicht: jeder Trade gewinnt – Trendfolge hat typisch
  nur 35–45 % Trefferquote, verdient aber, weil Gewinner deutlich größer sind als Verlierer).
- **Begrenzte Verluste** durch festes Risiko pro Trade und konsequente Stops.
- **Nachvollziehbarkeit**: feste Regeln statt Bauchgefühl, dadurch backtestbar und verbesserbar.

Was sie nicht verhindert: Verlustserien von 5–10 Trades in Folge und Drawdown-Phasen von
Monaten. Wer das nicht durchhält (finanziell und mental), verliert auch mit einer guten
Strategie Geld. Deshalb: **nur Geld einsetzen, dessen Totalverlust verkraftbar ist**, und
den Test-Fahrplan unten einhalten.

## Die Regeln

Die Strategie ist bewusst einfach – einfache Trendfolge-Regeln sind seit Jahrzehnten
dokumentiert robust, während komplexe, überoptimierte Systeme im Livebetrieb meist scheitern.

| Baustein | Regel | Zweck |
| --- | --- | --- |
| Trendfilter | Schlusskurs > EMA 200 | Nur in Aufwärtstrends kaufen, Seitwärts-/Bärenmärkte meiden |
| Einstieg | Schlusskurs über dem höchsten Hoch der letzten 20 Kerzen | Einstieg bei nachgewiesener Stärke (Breakout) |
| Ausstieg | Chandelier-Trailing-Stop: höchstes Hoch (20) − 3 × ATR(14), wird nur nachgezogen | Gewinne laufen lassen, Verluste begrenzen |
| Positionsgröße | max. 1 % des Kapitals Risiko pro Trade (über den Stop-Abstand berechnet) | Überleben von Verlustserien |
| Richtung | Nur Long | Einfacher, und Aufwärtstrends sind bei Aktien/Indizes/Krypto langlebiger |

**Empfohlener Timeframe: Tageschart (1D)**, alternativ 4H. Auf kleinen Timeframes fressen
Spread, Slippage und Rauschen die Erwartung auf – Intraday-Scalping ist für den Einstieg
die sicherste Methode, Geld zu verlieren.

**Geeignete Märkte:** liquide Werte mit Trendverhalten – große Indizes (z. B. NASDAQ 100,
S&P 500 über ETFs/CFDs), Gold, BTC/ETH, große liquide Aktien. Ein Portfolio aus 5–10
unkorrelierten Märkten glättet die Ergebniskurve deutlich gegenüber einem Einzelmarkt.

## Warum genau diese Bausteine?

- **Trendfolge** ist eine der wenigen Strategieklassen mit über Jahrzehnte dokumentierter,
  über viele Märkte hinweg positiver Erwartung (Managed-Futures-/CTA-Forschung).
- Der **EMA-200-Filter** hält die Strategie aus den Marktphasen heraus, in denen Breakouts
  am häufigsten scheitern (Seitwärts- und Bärenmärkte).
- Der **ATR-basierte Stop** passt sich der Volatilität an: enger in ruhigen Märkten, weiter
  in volatilen – statt eines fixen Prozentwerts, der mal zu eng, mal zu weit ist.
- Die **1-%-Regel** ist der wichtigste Baustein überhaupt: Selbst 10 Verlusttrades in Folge
  kosten dann nur rund 10 % des Kapitals – ärgerlich, aber überlebbar. Mit 10 % Risiko pro
  Trade wäre dasselbe Pech ein Totalschaden.

## Einrichtung in TradingView

1. TradingView öffnen → gewünschten Markt im **Tageschart** laden.
2. Pine Editor öffnen → Inhalt von `trendfolge-breakout.pine` einfügen → „Zum Chart hinzufügen“.
3. Im Strategie-Tester den Backtest prüfen (siehe Fahrplan unten).
4. In den Strategie-Einstellungen unter „Webhook-Alerts“ das **Webhook-Secret** eintragen
   (identisch mit `TRADINGVIEW_WEBHOOK_SECRET` aus der `.env` der App).
5. Alert anlegen: „Alert erstellen“ → Bedingung: diese Strategie →
   bei „Benachrichtigungen“ die Webhook-URL eintragen:
   `https://DEINE-DOMAIN/api/webhooks/tradingview`
   Als Nachricht `{{strategy.order.alert_message}}` verwenden – die Strategie baut das
   JSON (`secret`, `symbol`, `richtung`, `preis`, `quelle`) selbst zusammen.
6. Signale erscheinen dann wie gewohnt unter **Signale** in der App (mit iPhone-Push) und
   können dort als Paper-Trade bestätigt werden.

Hinweis: Für Webhook-Alerts ist mindestens TradingView **Essential** (bezahlter Plan) nötig.

## Test-Fahrplan (nicht abkürzen!)

**Phase 1 – Backtest (1–2 Tage Aufwand):**
- Backtest auf mindestens 5 verschiedenen Märkten und über mindestens 8–10 Jahre laufen lassen
  (Zeitraum ist in den Einstellungen einstellbar).
- Wichtig: Zeitraum splitten – z. B. auf 2018–2022 „optimieren“, dann **unverändert** auf
  2023–heute prüfen (Out-of-Sample-Test). Bricht die Strategie dort ein, ist sie überoptimiert.
- Realistische Kosten prüfen: Kommission (0,1 %) und Slippage sind im Script gesetzt –
  an den eigenen Broker (z. B. GBE) anpassen.
- Kennzahlen, auf die es ankommt: Profitfaktor > 1,3, max. Drawdown, den man aushalten würde,
  mindestens ~100 Trades im Test (sonst keine Aussagekraft).

**Phase 2 – Paper-Trading (mindestens 2–3 Monate):**
- Alerts an die App anschließen, Signale im Paper-Konto der App bestätigen.
- Prüfen: Kommen die Signale zuverlässig an? Weichen sie vom Backtest ab? Halte ich mich
  an die Regeln, auch wenn es unbequem ist?

**Phase 3 – Klein live (frühestens danach):**
- Mit dem kleinstmöglichen Einsatz starten (Micro-Lots / kleinste Stückzahl), Risiko pro
  Trade eher 0,5 % als 1 %.
- Erst vergrößern, wenn 30+ Live-Trades ungefähr das Bild aus Backtest und Paper-Phase
  bestätigen.

**Abbruchkriterien** (vorher festlegen, nicht im Drawdown entscheiden):
- Drawdown überschreitet das 1,5-Fache des maximalen Backtest-Drawdowns → stoppen und analysieren.
- Live-Ergebnisse weichen systematisch vom Paper-Trading ab (z. B. durch Slippage) → stoppen.

## Stellschrauben (mit Vorsicht)

| Parameter | Standard | Wirkung |
| --- | --- | --- |
| EMA-Länge | 200 | Kürzer = mehr Signale, mehr Fehlsignale |
| Breakout-Länge | 20 | Kürzer = früherer Einstieg, mehr Rauschen; länger (55) = klassischer „Turtle“-Stil |
| ATR-Multiplikator | 3,0 | Kleiner = engerer Stop, mehr Ausstopper; größer = mehr Rückgabe von Gewinnen |
| Risiko pro Trade | 1 % | Nicht über 1–2 % erhöhen. Das ist keine Stellschraube für „mehr Gewinn“, sondern für Überleben |

Regel: **maximal einen Parameter ändern und neu backtesten** – wer alle vier gleichzeitig
auf die Historie optimiert, baut sich eine Rückspiegel-Strategie, die vorwärts nicht funktioniert.

## Rechtlicher Hinweis

Dies ist keine Anlageberatung, sondern ein technisches Werkzeug mit dokumentierten Regeln.
Handel mit Hebelprodukten (CFDs, Futures) kann zum Verlust des gesamten Einsatzes führen.
Entscheidungen und Verantwortung liegen beim Nutzer.
