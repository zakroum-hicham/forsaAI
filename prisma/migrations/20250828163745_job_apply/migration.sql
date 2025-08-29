/*
  Warnings:

  - You are about to drop the column `githubConnected` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `JobApplication` table. All the data in the column will be lost.
  - Added the required column `city` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationLevel` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsAccepted` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'PHD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ExperienceEnum" AS ENUM ('ZERO', 'ONE_TWO', 'THREE_FIVE', 'SIX_TEN', 'TEN_PLUS');

-- AlterTable
ALTER TABLE "public"."JobApplication" DROP COLUMN "githubConnected",
DROP COLUMN "major",
DROP COLUMN "university",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "educationLevel" "public"."EducationLevel" NOT NULL,
ADD COLUMN     "experience" "public"."ExperienceEnum" NOT NULL,
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
