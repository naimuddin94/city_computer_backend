import { Order, Prisma, OrderStatus } from "@prisma/client";
import httpStatus from "http-status";
import { generateMetaData, prisma } from "../../lib";
import { AppError } from "../../utils";

// Save a new order into the database
const createOrder = async (
  payload: Omit<Order, "orderId" | "createdAt" | "updatedAt">
) => {
    
  return await prisma.order.create({
    data: payload,
    include: {
      orderItems: true,
    },
  });
};

// Get all orders with pagination and optional filters by status
const getAllOrders = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 50, status, userId } = query;

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

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
