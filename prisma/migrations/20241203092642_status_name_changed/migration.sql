/*
  Warnings:

  - The `status` column on the `Shop` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'blocked');

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- DropEnum
DROP TYPE "UserStatus";
