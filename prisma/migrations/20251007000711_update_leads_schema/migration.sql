/*
  Warnings:

  - Added the required column `receivedAt` to the `leads` table without a default value. This is not possible if the table is not empty.
  - Made the column `subject` on table `leads` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emailId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'DIRECT',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedTo" TEXT,
    "tags" TEXT,
    "notes" TEXT,
    "receivedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_leads" ("assignedTo", "company", "createdAt", "email", "id", "message", "name", "notes", "phone", "priority", "source", "status", "subject", "updatedAt") SELECT "assignedTo", "company", "createdAt", "email", "id", "message", "name", "notes", "phone", "priority", coalesce("source", 'DIRECT') AS "source", "status", "subject", "updatedAt" FROM "leads";
DROP TABLE "leads";
ALTER TABLE "new_leads" RENAME TO "leads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
