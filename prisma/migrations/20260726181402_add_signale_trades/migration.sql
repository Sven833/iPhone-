-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "richtung" TEXT NOT NULL,
    "preis" REAL,
    "quelle" TEXT,
    "rohdaten" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offen',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "richtung" TEXT NOT NULL,
    "menge" REAL NOT NULL,
    "einstiegspreis" REAL NOT NULL,
    "ausstiegspreis" REAL,
    "status" TEXT NOT NULL DEFAULT 'offen',
    "signalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geschlossenAt" DATETIME,
    CONSTRAINT "Trade_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
