-- CreateTable
CREATE TABLE "Coupon" (
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("code","shopId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_shopId_key" ON "Coupon"("shopId");
