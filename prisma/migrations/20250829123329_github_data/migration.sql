/*
  Warnings:

  - You are about to drop the column `bio` on the `GitHubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `contributionsCalendar` on the `GitHubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `contributionsTotal` on the `GitHubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `repositoriesCount` on the `GitHubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `topRepositories` on the `GitHubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `devpostUsername` on the `JobApplication` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `GitHubProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `GitHubProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."GitHubProfile" DROP CONSTRAINT "GitHubProfile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."GitHubProfile" DROP COLUMN "bio",
DROP COLUMN "contributionsCalendar",
DROP COLUMN "contributionsTotal",
DROP COLUMN "repositoriesCount",
DROP COLUMN "topRepositories",
ADD COLUMN     "CodeReviewActivity" JSONB,
ADD COLUMN     "Contributions" JSONB,
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "bioHTML" TEXT,
ADD COLUMN     "contributionsCollection" JSONB,
ADD COLUMN     "githubCreatedAt" TEXT,
ADD COLUMN     "issues" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pullRequests" JSONB,
ADD COLUMN     "repositories" JSONB,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "public"."JobApplication" DROP COLUMN "devpostUsername";

-- AddForeignKey
ALTER TABLE "public"."GitHubProfile" ADD CONSTRAINT "GitHubProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
