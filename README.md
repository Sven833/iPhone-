# MSB Malerbetrieb – Firmen-Tool

Internes Web-Tool für den Malerbetrieb: Login-geschützter Bereich mit Kundenverwaltung und Angebotserstellung. Weitere Module (Aufmaß, Zeiterfassung, ...) können darauf aufgebaut werden.

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io) mit SQLite als Datenbank
- [NextAuth (Auth.js) v5](https://authjs.dev) mit Credentials-Login

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
  components/          Wiederverwendbare UI-Komponenten
  lib/prisma.ts        Prisma-Client-Singleton
  auth.ts               NextAuth-Konfiguration (Provider, Callbacks)
  auth.config.ts        Edge-taugliche Basis-Konfiguration (Routenschutz)
  proxy.ts              Middleware/Proxy: erzwingt Login auf geschützten Routen
prisma/
  schema.prisma          Datenmodell (User, Kunde, Angebot, AngebotPosition)
  seed.ts                 Anlegen des Admin-Benutzers
```

## Nächste Schritte

Mögliche Ausbaustufen für den Malerbetrieb:

- Aufmaß direkt am Kunden erfassen
- Angebote als PDF exportieren/versenden
- Zeiterfassung pro Baustelle/Projekt
- Rollen/Rechte für mehrere Mitarbeiter
- Umzug von SQLite auf eine Server-Datenbank (z.B. PostgreSQL) für den Produktivbetrieb mit mehreren Nutzern
