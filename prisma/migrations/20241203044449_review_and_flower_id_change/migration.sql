/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Follower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followerId` on the `Follower` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reviewId` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_pkey",
DROP COLUMN "followerId",
ADD CONSTRAINT "Follower_pkey" PRIMARY KEY ("userId", "shopId");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "reviewId",
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("productId", "userId");
