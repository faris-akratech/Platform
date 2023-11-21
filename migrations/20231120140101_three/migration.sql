/*
  Warnings:

  - Changed the type of `attributes` on the `schema` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "schema" DROP COLUMN "attributes",
ADD COLUMN     "attributes" JSONB NOT NULL;
