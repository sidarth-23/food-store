import { Router } from "express";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order_status";
import authMid from "../middlewares/auth.mid";

const router = Router();
router.use(authMid);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart is Empty!");
      return;
    }

    const newOrder = new OrderModel({
      ...requestOrder,
      user: req.user.id,
    });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  asyncHandler(async (req: any, res) => {
    const order = await OrderModel.findOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    })
    .sort({createdAt: -1})
    .limit(1)

    if (order) res.send(order)
    else res.status(HTTP_BAD_REQUEST).send()
  })
)
router.get('/userOrders', asyncHandler(async (req: any, res) => {
  const orders = await OrderModel.find({
    user: req.user.id
  })
  if (orders) res.send(orders)
    else res.status(HTTP_BAD_REQUEST).send()
}))

export default router;
