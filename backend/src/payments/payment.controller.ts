import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Body() body: { items: any[] },
    @Request() req: any,
  ) {
    const session = await this.paymentService.createCheckoutSession(
      body.items,
      req.user.userId,
    );

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  @Get('checkout-session')
  async getCheckoutSession(
    @Query('sessionId') sessionId: string,
  ): Promise<{
    status: string | null;
    customer_email: string | null;
    amount_total: number | null;
  }> {
    const session = await this.paymentService.getCheckoutSession(sessionId);

    return {
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
    };
  }
}