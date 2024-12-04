import express from 'express';
import { auth } from '../../middleware';
import { OrderController } from './order.controller';

const router = express.Router();

router.route("/").post(auth("user", "vendor"), OrderController.createOrder);

export const OrderRotes = router;