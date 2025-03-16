import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './payment/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '172.18.0.2',
    port: 3306,
    username: 'nest',  
    password: 'nest',
    database: 'nest_payments',
    entities: [Payment],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }), 
  ConfigModule.forRoot({
    isGlobal: true,
  }), PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
