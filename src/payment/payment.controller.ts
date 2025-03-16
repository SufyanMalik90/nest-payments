import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) {}
    @Post('process')
  processPayment(@Body('order_id') order_id: string, @Body('amount') amount: number) {
    return this.paymentService.processPayment(order_id, amount);
  }
}
