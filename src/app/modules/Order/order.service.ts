import { OrderStatus } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib";
import { AppError } from "../../utils";

// Define type for order items
interface IOrderItemType {
  productId: string;
  quantity: number;
  coupon?: string;
}

// Calculate total amount and discount based on the shop
const calculateTotalAmount = async (payload: {
  orderItems: IOrderItemType[];
}) => {
  const { orderItems } = payload;
  let totalAmount = 0;
  let totalDiscount = 0;
  const orderItemsData = [];

  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: { productId: item.productId },
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for product ${product.name}`
      );
    }

    let itemPrice = product.price * item.quantity;
    let discountAmount = 0;

    if (item.coupon) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code_shopId: {
            code: item.coupon,
            shopId: product.shopId,
          },
        },
      });

      if (coupon) {
        discountAmount = (itemPrice * coupon.discount) / 100;
        itemPrice -= discountAmount;
      }
    }

    totalAmount += itemPrice;
    totalDiscount += discountAmount;

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: itemPrice,
    });
  }

  return { totalAmount, totalDiscount, orderItemsData };
};

// Save a new order into the database
const createOrder = async (
  user: JwtPayload,
  payload: {
    orderItems: IOrderItemType[];
    paymentInfo: string;
    address: string;
    phone: string;
    payAmount: number;
  }
) => {
  // Initialize total amount
  let totalAmount = 0;
  const orderItemsData: {
    productId: string;
    quantity: number;
    price: number;
  }[] = [];

  // Validate and process each order item
  for (const item of payload.orderItems) {
    const product = await prisma.product.findUnique({
      where: { productId: item.productId },
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
    }

    // Check stock availability
    if (product.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for product ${product.name}`
      );
    }

    // Calculate item price after applying coupon (if any)
    let itemPrice = product.price * item.quantity;

    if (item.coupon) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code_shopId: {
            code: item.coupon,
            shopId: product.shopId,
          },
        },
      });

      // Apply discount if valid coupon
      if (coupon) {
        const discountAmount = (itemPrice * coupon.discount) / 100;
        itemPrice -= discountAmount;
      }
    }

    // Accumulate total amount
    totalAmount += itemPrice;

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: itemPrice,
    });
  }

  if (totalAmount > payload.payAmount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Insufficient payment amount. Please pay the full order total."
    );
  }

  // Create order and order items in a transaction
  return await prisma.$transaction(async (tx) => {
    orderItemsData.forEach(async (item) => {
      await tx.product.update({
        where: { productId: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    });

    return await tx.order.create({
      data: {
        userId: user.userId,
        totalAmount,
        paymentId: payload.paymentInfo,
        address: payload.address,
        phone: payload.phone,
        paymentStatus: "paid",
        orderItems: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  });
};

// Get all orders with pagination and optional filters by status
const getAllOrders = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 50, status, userId, searchTerm } = query;
};

// Fetches all owned orders
const getMyOrders = async (user: JwtPayload) => {
  return await prisma.order.findMany({
    where: {
      userId: user.userId,
    },
    select: {
      orderId: true,
      address: true,
      phone: true,
      totalAmount: true,
      status: true,
      paymentId: true,
      createdAt: true,
      orderItems: {
        select: {
          orderItemId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              productId: true,
              image: true,
              name: true,
              price: true,
              shop: {
                select: {
                  shopId: true,
                  name: true,
                  address: true,
                  logo: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get order by ID
const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      orderId,
    },
    include: {
      orderItems: true,
      user: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

// Update order status by ID
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: {
      orderId,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return await prisma.order.update({
    where: {
      orderId,
    },
    data: {
      status,
    },
  });
};

// Delete order by ID
const deleteOrder = async (orderId: string) => {
  await prisma.order.findUniqueOrThrow({
    where: {
      orderId,
    },
  });

  await prisma.order.delete({
    where: {
      orderId,
    },
  });

  return null;
};

// Fetch the shop orders which are pending
const getOrderForShopOwnerFromDB = async (user: JwtPayload) => {
  // Find the shop owned by the current vendor
  const shop = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: user.userId,
    },
  });

  // Fetch pending orders where the shop's products are involved
  const orders = await prisma.order.findMany({
    where: {
      status: "pending",
      orderItems: {
        some: {
          product: {
            shopId: shop.shopId,
          },
        },
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return orders;
};


export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  calculateTotalAmount,
  getOrderForShopOwnerFromDB,
};
