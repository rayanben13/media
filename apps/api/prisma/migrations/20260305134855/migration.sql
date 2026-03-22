/*
  Warnings:

  - You are about to drop the `AuthCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthCode" DROP CONSTRAINT "AuthCode_userId_fkey";

-- DropTable
DROP TABLE "AuthCode";
