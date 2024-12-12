import httpStatus from "http-status";
import { AppResponse, catchAsync } from "../../utils";
import { PaymentService } from "./payment.service";

const getPaymentKey = catchAsync(async (req, res) => {
  const { price } = req.body;
  const result = await PaymentService.generatePaymentKey(price);
  res
    .status(httpStatus.OK)
    .json(
      new AppResponse(
        httpStatus.OK,
        result,
        "Payment key retrieved successfully"
      )
    );
});

export const PaymentController = {
  getPaymentKey,
};
