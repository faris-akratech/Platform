/*
  Warnings:

  - You are about to drop the column `clientId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecret` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `supabaseUserId` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "clientId",
DROP COLUMN "clientSecret",
DROP COLUMN "supabaseUserId";
