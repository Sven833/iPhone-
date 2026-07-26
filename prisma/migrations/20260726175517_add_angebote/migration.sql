-- CreateTable
CREATE TABLE "Angebot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'entwurf',
    "notizen" TEXT,
    "kundeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Angebot_kundeId_fkey" FOREIGN KEY ("kundeId") REFERENCES "Kunde" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AngebotPosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "beschreibung" TEXT NOT NULL,
    "menge" REAL NOT NULL,
    "einheit" TEXT NOT NULL,
    "einzelpreis" REAL NOT NULL,
    "reihenfolge" INTEGER NOT NULL,
    "angebotId" INTEGER NOT NULL,
    CONSTRAINT "AngebotPosition_angebotId_fkey" FOREIGN KEY ("angebotId") REFERENCES "Angebot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
