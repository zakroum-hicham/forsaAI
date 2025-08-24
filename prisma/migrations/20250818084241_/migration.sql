/*
  Warnings:

  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropIndex
DROP INDEX "public"."Job_companyId_idx";

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "companyId";

-- DropTable
DROP TABLE "public"."Company";
