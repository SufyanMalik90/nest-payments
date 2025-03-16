import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentAttempt } from './entities/payment-attempt.entity';
import axios from 'axios';

@Injectable()
export class PaymentService {

    private readonly logger = new Logger(PaymentService.name);

    constructor(
        @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
        @InjectRepository(PaymentAttempt) private attemptRepo: Repository<PaymentAttempt>,
      ) {}

      async processPayment(order_id: string, amount: number) {
        let payment = await this.paymentRepo.findOne({ where: { order_id } });
        if (payment && payment.status === 'completed') {
          return { message: 'Payment already completed' };
        }
    
        if (!payment) {
          payment = this.paymentRepo.create({ order_id, amount, status: 'pending' });
          await this.paymentRepo.save(payment);
        }
    
        let attemptNumber = 1;
        let success = false;
    
        while (attemptNumber <= 3 && !success) {
          this.logger.log(`Payment attempt ${attemptNumber} for ${order_id}`);
          try {
            const gatewayUrl = process.env.PAYMENT_GATEWAY_URL ?? 'https://default-gateway-url.com';
            const response = await axios.post(gatewayUrl, { order_id, amount });
                if (response.data.status === 'success') {
              payment.status = 'completed';
              success = true;
            } else {
              payment.status = 'failed';
            }
            await this.paymentRepo.save(payment);
            await this.attemptRepo.save({ payment, attempt_number: attemptNumber, status: response.data.status, response: JSON.stringify(response.data) });
          } catch (error) {
            this.logger.error(`Attempt ${attemptNumber} failed`, error.message);
          }
          attemptNumber++;
        }
      }
}
