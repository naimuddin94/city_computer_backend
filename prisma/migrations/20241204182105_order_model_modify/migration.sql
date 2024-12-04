-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'unpaid');

-- DropIndex
DROP INDEX "Coupon_shopId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
ALTER COLUMN "status" SET DEFAULT 'pending';
