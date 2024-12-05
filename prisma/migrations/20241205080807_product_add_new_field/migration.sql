-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "material" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "weight" TEXT NOT NULL DEFAULT 'none';
