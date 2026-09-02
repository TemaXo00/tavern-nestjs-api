/*
  Warnings:

  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sessions_expires_at_idx";

-- DropIndex
DROP INDEX "sessions_is_active_idx";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires_at",
DROP COLUMN "is_active";
