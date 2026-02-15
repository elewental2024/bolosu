/*
  Warnings:

  - Added the required column `originalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "pin" TEXT;

-- CreateTable
CREATE TABLE "OrderLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveryAddress" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "deliveryTime" TEXT,
    "observations" TEXT,
    "deliveryFee" REAL,
    "totalPrice" REAL,
    "originalPrice" REAL NOT NULL,
    "negotiatedPrice" REAL,
    "priceHistory" TEXT,
    "agreedAt" DATETIME,
    "agreedByCustomer" BOOLEAN NOT NULL DEFAULT false,
    "agreedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "deliveryAddress", "deliveryDate", "deliveryFee", "id", "observations", "status", "totalPrice", "updatedAt", "userId") SELECT "createdAt", "deliveryAddress", "deliveryDate", "deliveryFee", "id", "observations", "status", "totalPrice", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "OrderLog_orderId_idx" ON "OrderLog"("orderId");

-- CreateIndex
CREATE INDEX "OrderLog_createdAt_idx" ON "OrderLog"("createdAt");
