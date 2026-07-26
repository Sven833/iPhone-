# Firmen-Tool

Internes, login-geschütztes Web-Tool mit zwei unabhängigen Bereichen:

1. **Malerbetrieb**: Kundenverwaltung und Angebotserstellung
2. **Trading-Signale**: TradingView-Webhook → Signal-Liste mit Buy/Sell-Buttons → virtuelles Paper-Trading-Konto, optional mit Push-Benachrichtigungen aufs iPhone

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io) mit SQLite als Datenbank
- [NextAuth (Auth.js) v5](https://authjs.dev) mit Credentials-Login
- [web-push](https://github.com/web-push-libs/web-push) für Push-Benachrichtigungen (PWA)

## Setup

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. `.env` anlegen (Vorlage: `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Darin `AUTH_SECRET` mit einem zufälligen Wert füllen (z.B. `openssl rand -base64 32`) und `ADMIN_EMAIL` / `ADMIN_PASSWORD` für den ersten Login setzen.

3. Datenbank migrieren:

   ```bash
   npm run db:migrate
   ```

4. Admin-Benutzer anlegen (liest `ADMIN_EMAIL` / `ADMIN_PASSWORD` aus `.env`):

   ```bash
   npm run db:seed
   ```

5. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

   Die App läuft dann unter [http://localhost:3000](http://localhost:3000) und leitet automatisch zum Login weiter.

## Trading-Signale einrichten

⚠️ **Wichtig**: Dieses Modul führt aktuell **keine echten Orders** bei einem Broker aus. Buy/Sell eröffnet nur eine **virtuelle Paper-Trading-Position** in der eigenen Datenbank (Startkapital konfigurierbar über `PAPER_TRADING_STARTKAPITAL`). Die tatsächliche Ausführung bei einem Broker (z.B. über einen MetaTrader-Expert-Advisor) ist bewusst ein separater, späterer Schritt – dafür sollte das Signal-Setup erst einige Wochen im Demo-Betrieb laufen.

1. In `.env` ein Secret für `TRADINGVIEW_WEBHOOK_SECRET` setzen (z.B. `openssl rand -hex 16`).
2. In TradingView bei einem Alert unter „Benachrichtigungen“ die Webhook-URL `https://DEINE-DOMAIN/api/webhooks/tradingview` eintragen.
3. Als Alert-Nachricht (JSON) z.B.:
   ```json
   {
     "secret": "dein-secret",
     "symbol": "{{ticker}}",
     "richtung": "buy",
     "preis": {{close}}
   }
   ```
   Für Verkaufssignale einen zweiten Alert mit `"richtung": "sell"` anlegen.
4. Die genaue, aktuell konfigurierte Webhook-URL und das Secret werden auch direkt auf der `/signale`-Seite in der App angezeigt.
5. Eingehende Signale erscheinen unter „Signale“ mit Buy/Sell/Ignorieren-Buttons. Bestätigte Signale eröffnen eine Position unter „Trades“, die dort manuell (mit Schlusskurs) geschlossen wird.

### Push-Benachrichtigungen aufs iPhone

1. In `.env` ein VAPID-Schlüsselpaar eintragen: `npx web-push generate-vapid-keys`.
2. Die App auf dem iPhone in Safari öffnen und über „Teilen“ → „Zum Home-Bildschirm“ hinzufügen (iOS 16.4+, notwendig für Push).
3. Die App vom Home-Bildschirm-Icon aus öffnen, zu „Signale“ gehen und auf „Push-Benachrichtigungen aktivieren“ tippen.
4. Bei jedem neuen TradingView-Signal kommt danach eine Push-Benachrichtigung an.

## Nützliche Befehle

| Befehl              | Zweck                                      |
| -------------------- | ------------------------------------------- |
| `npm run dev`         | Entwicklungsserver starten                  |
| `npm run build`       | Produktions-Build erstellen                 |
| `npm run start`       | Produktions-Build starten                   |
| `npm run lint`        | ESLint ausführen                            |
| `npm run db:migrate`  | Neue Prisma-Migration anlegen/anwenden      |
| `npm run db:seed`     | Admin-Benutzer aus `.env` anlegen/aktualisieren |
| `npm run db:studio`   | Prisma Studio (Datenbank-GUI) öffnen        |

## Projektstruktur

```
src/
  app/
    login/            Login-Seite
    (app)/             Geschützter Bereich (Login erforderlich)
      dashboard/       Übersicht
      kunden/          Kundenverwaltung (Liste, Neuanlage, Bearbeiten)
      angebote/        Angebote mit Positionen und Status (Entwurf/Versendet/Angenommen/Abgelehnt)
      signale/         Eingehende TradingView-Signale, Buy/Sell/Ignorieren
      trades/          Paper-Trading-Positionen, Schließen mit P&L-Berechnung
    api/
      webhooks/tradingview/  Webhook-Endpunkt für TradingView-Alerts (secret-geschützt)
      push/            Speichern/Löschen von Web-Push-Subscriptions
    manifest.ts          Web App Manifest (PWA, Add-to-Homescreen)
  components/          Wiederverwendbare UI-Komponenten
  lib/prisma.ts        Prisma-Client-Singleton
  lib/push.ts           Web-Push-Versand an alle gespeicherten Subscriptions
  lib/trading.ts         P&L-Berechnung, Startkapital
  auth.ts               NextAuth-Konfiguration (Provider, Callbacks)
  auth.config.ts        Edge-taugliche Basis-Konfiguration (Routenschutz)
  proxy.ts              Middleware/Proxy: erzwingt Login auf geschützten Routen
prisma/
  schema.prisma          Datenmodell (User, Kunde, Angebot, AngebotPosition, Signal, Trade, PushSubscription)
  seed.ts                 Anlegen des Admin-Benutzers
public/
  sw.js                   Service Worker (empfängt Push-Events, zeigt Benachrichtigungen)
```

## Nächste Schritte

Mögliche Ausbaustufen:

- Aufmaß direkt am Kunden erfassen
- Angebote als PDF exportieren/versenden
- Zeiterfassung pro Baustelle/Projekt
- Rollen/Rechte für mehrere Mitarbeiter
- Umzug von SQLite auf eine Server-Datenbank (z.B. PostgreSQL) für den Produktivbetrieb mit mehreren Nutzern
- Echte Order-Ausführung bei GBE Brokers (MetaTrader-Expert-Advisor, der bestätigte Trades aus der App abholt) – erst nach ausführlichem Test im Paper-Trading-Betrieb
