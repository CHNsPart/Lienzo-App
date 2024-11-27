-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_License" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "duration" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "requestId" TEXT NOT NULL,
    CONSTRAINT "License_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "License_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "License_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "LicenseRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_License" ("createdAt", "duration", "expiryDate", "id", "key", "ownerId", "productId", "requestId", "startDate", "updatedAt", "version") SELECT "createdAt", "duration", "expiryDate", "id", "key", "ownerId", "productId", "requestId", "startDate", "updatedAt", "version" FROM "License";
DROP TABLE "License";
ALTER TABLE "new_License" RENAME TO "License";
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
