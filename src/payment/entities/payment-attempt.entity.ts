import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('payment_attempts')
export class PaymentAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payment, (payment) => payment.attempts)
  payment: Payment;

  @Column()
  attempt_number: number;

  @Column({ type: 'enum', enum: ['success', 'failure'] })
  status: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @CreateDateColumn()
  created_at: Date;
}
